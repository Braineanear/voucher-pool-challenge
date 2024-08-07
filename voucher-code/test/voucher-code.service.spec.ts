import { Test, TestingModule } from '@nestjs/testing';
import { VoucherCodeService } from '../src/app.service';
import { VoucherCodeRepository } from '../src/repositories/voucher-code.repository';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVoucherDto } from '../src/dtos/create-voucher.dto';
import { ValidateVoucherDto } from '../src/dtos/validate-voucher.dto';
import { of, throwError } from 'rxjs';

describe('VoucherCodeService', () => {
  let service: VoucherCodeService;
  let repository: VoucherCodeRepository;
  let client: ClientProxy;
  let configService: ConfigService;

  const mockVoucherCodeRepository = {
    create: jest.fn(),
    findByCode: jest.fn(),
    markAsUsed: jest.fn(),
    findAllByCustomerEmail: jest.fn(),
  };

  const mockClientProxy = {
    send: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'OFFER_SERVICE_PORT') return 3001;
      if (key === 'OFFER_SERVICE_HOST') return 'localhost';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherCodeService,
        { provide: VoucherCodeRepository, useValue: mockVoucherCodeRepository },
        { provide: ClientProxy, useValue: mockClientProxy },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<VoucherCodeService>(VoucherCodeService);
    repository = module.get<VoucherCodeRepository>(VoucherCodeRepository);
    client = module.get<ClientProxy>(ClientProxy);
    configService = module.get<ConfigService>(ConfigService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a voucher', async () => {
      const createVoucherDto: CreateVoucherDto = {
        customerEmail: 'customer@example.com',
        specialOfferName: 'Black Friday Sale',
        expirationDate: '2024-12-31',
      };
      const createdVoucher = { id: '1', ...createVoucherDto, code: 'abc123' };
      jest.spyOn(service as any, 'generateUniqueCode').mockReturnValue('abc123');
      mockVoucherCodeRepository.create.mockResolvedValue(createdVoucher);

      expect(await service.create(createVoucherDto)).toEqual(createdVoucher);
      expect(mockVoucherCodeRepository.create).toHaveBeenCalledWith(createVoucherDto, 'abc123');
    });
  });

  describe('validateAndFetchDiscount', () => {
    it('should validate a voucher and fetch discount', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        customerEmail: 'customer@example.com',
        code: 'abc123',
      };
      const voucher = {
        id: '1',
        code: 'abc123',
        customerEmail: 'customer@example.com',
        specialOfferName: 'Black Friday Sale',
        expirationDate: '2024-12-31',
        usedAt: null,
        createdAt: new Date(),
      };
      const specialOffer = { name: 'Black Friday Sale', discountPercentage: 20 };

      mockVoucherCodeRepository.findByCode.mockResolvedValue(voucher);
      mockClientProxy.send.mockReturnValue(of(specialOffer));

      const result = await service.validateAndFetchDiscount(validateVoucherDto);
      expect(result).toEqual({ voucher, discount: 20 });
      expect(mockVoucherCodeRepository.findByCode).toHaveBeenCalledWith('abc123');
      expect(mockClientProxy.send).toHaveBeenCalledWith('get_special_offer', { name: 'Black Friday Sale' });
    });

    it('should throw NotFoundException if voucher not found', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        customerEmail: 'customer@example.com',
        code: 'notfound',
      };

      mockVoucherCodeRepository.findByCode.mockResolvedValue(null);

      await expect(service.validateAndFetchDiscount(validateVoucherDto)).rejects.toThrow(NotFoundException);
      expect(mockVoucherCodeRepository.findByCode).toHaveBeenCalledWith('notfound');
    });

    it('should throw BadRequestException if voucher has been used', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        customerEmail: 'customer@example.com',
        code: 'used123',
      };
      const voucher = {
        id: '1',
        code: 'used123',
        customerEmail: 'customer@example.com',
        specialOfferName: 'Black Friday Sale',
        expirationDate: '2024-12-31',
        usedAt: new Date(),
        createdAt: new Date(),
      };

      mockVoucherCodeRepository.findByCode.mockResolvedValue(voucher);

      await expect(service.validateAndFetchDiscount(validateVoucherDto)).rejects.toThrow(BadRequestException);
      expect(mockVoucherCodeRepository.findByCode).toHaveBeenCalledWith('used123');
    });

    it('should throw BadRequestException if voucher has expired', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        customerEmail: 'customer@example.com',
        code: 'expired123',
      };
      const voucher = {
        id: '1',
        code: 'expired123',
        customerEmail: 'customer@example.com',
        specialOfferName: 'Black Friday Sale',
        expirationDate: '2022-12-31',
        usedAt: null,
        createdAt: new Date(),
      };

      mockVoucherCodeRepository.findByCode.mockResolvedValue(voucher);

      await expect(service.validateAndFetchDiscount(validateVoucherDto)).rejects.toThrow(BadRequestException);
      expect(mockVoucherCodeRepository.findByCode).toHaveBeenCalledWith('expired123');
    });

    it('should throw NotFoundException if special offer not found', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        customerEmail: 'customer@example.com',
        code: 'specialnotfound',
      };
      const voucher = {
        id: '1',
        code: 'specialnotfound',
        customerEmail: 'customer@example.com',
        specialOfferName: 'Nonexistent Offer',
        expirationDate: '2024-12-31',
        usedAt: null,
        createdAt: new Date(),
      };

      mockVoucherCodeRepository.findByCode.mockResolvedValue(voucher);
      mockClientProxy.send.mockReturnValue(throwError(() => new NotFoundException('Special offer not found')));

      await expect(service.validateAndFetchDiscount(validateVoucherDto)).rejects.toThrow(NotFoundException);
      expect(mockVoucherCodeRepository.findByCode).toHaveBeenCalledWith('specialnotfound');
      expect(mockClientProxy.send).toHaveBeenCalledWith('get_special_offer', { name: 'Nonexistent Offer' });
    });
  });

  describe('markAsUsed', () => {
    it('should mark a voucher as used', async () => {
      const voucher = {
        id: '1',
        code: 'abc123',
        customerEmail: 'customer@example.com',
        specialOfferName: 'Black Friday Sale',
        expirationDate: '2024-12-31',
        usedAt: new Date(),
        createdAt: new Date(),
      };

      mockVoucherCodeRepository.markAsUsed.mockResolvedValue(voucher);

      expect(await service.markAsUsed('abc123')).toEqual(voucher);
      expect(mockVoucherCodeRepository.markAsUsed).toHaveBeenCalledWith('abc123');
    });

    it('should throw NotFoundException if voucher not found', async () => {
      mockVoucherCodeRepository.markAsUsed.mockResolvedValue(null);

      await expect(service.markAsUsed('notfound')).rejects.toThrow(NotFoundException);
      expect(mockVoucherCodeRepository.markAsUsed).toHaveBeenCalledWith('notfound');
    });
  });

  describe('findAllByCustomerEmail', () => {
    it('should return all vouchers for a customer email', async () => {
      const vouchers = [
        { id: '1', code: 'abc123', customerEmail: 'customer@example.com', specialOfferName: 'Black Friday Sale', expirationDate: '2024-12-31', usedAt: null, createdAt: new Date() },
      ];

      mockVoucherCodeRepository.findAllByCustomerEmail.mockResolvedValue(vouchers);

      expect(await service.findAllByCustomerEmail('customer@example.com')).toEqual(vouchers);
      expect(mockVoucherCodeRepository.findAllByCustomerEmail).toHaveBeenCalledWith('customer@example.com');
    });
  });
});
