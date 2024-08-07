import { Test, TestingModule } from '@nestjs/testing';
import { SpecialOfferService } from '../src/app.service';
import { SpecialOfferRepository } from '../src/repositories/special-offer.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateSpecialOfferDto } from '../src/dtos/create-special-offer.dto';
import { UpdateSpecialOfferDto } from '../src/dtos/update-special-offer.dto';
import { SpecialOffer } from '../src/schemas/special-offer.schema';

describe('SpecialOfferService', () => {
  let service: SpecialOfferService;
  let repository: SpecialOfferRepository;

  const mockSpecialOfferRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialOfferService,
        { provide: SpecialOfferRepository, useValue: mockSpecialOfferRepository },
      ],
    }).compile();

    service = module.get<SpecialOfferService>(SpecialOfferService);
    repository = module.get<SpecialOfferRepository>(SpecialOfferRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a special offer', async () => {
      const createSpecialOfferDto: CreateSpecialOfferDto = { name: 'Summer Sale', discountPercentage: 20 };
      const createdSpecialOffer = { id: '1', ...createSpecialOfferDto };
      mockSpecialOfferRepository.create.mockResolvedValue(createdSpecialOffer);

      expect(await service.create(createSpecialOfferDto)).toEqual(createdSpecialOffer);
      expect(mockSpecialOfferRepository.create).toHaveBeenCalledWith(createSpecialOfferDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of special offers', async () => {
      const specialOffers = [{ id: '1', name: 'Summer Sale', discountPercentage: 20 }];
      mockSpecialOfferRepository.findAll.mockResolvedValue(specialOffers);

      expect(await service.findAll()).toEqual(specialOffers);
      expect(mockSpecialOfferRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a special offer by name', async () => {
      const specialOffer = { id: '1', name: 'Summer Sale', discountPercentage: 20 };
      mockSpecialOfferRepository.findOne.mockResolvedValue(specialOffer);

      expect(await service.findOne('Summer Sale')).toEqual(specialOffer);
      expect(mockSpecialOfferRepository.findOne).toHaveBeenCalledWith('Summer Sale');
    });

    it('should throw a NotFoundException if special offer not found', async () => {
      mockSpecialOfferRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('NotExist')).rejects.toThrow(NotFoundException);
      expect(mockSpecialOfferRepository.findOne).toHaveBeenCalledWith('NotExist');
    });
  });

  describe('update', () => {
    it('should update a special offer', async () => {
      const updateSpecialOfferDto: UpdateSpecialOfferDto = { name: 'Winter Sale', discountPercentage: 25 };
      const updatedSpecialOffer = { id: '1', name: 'Winter Sale', discountPercentage: 25 };
      mockSpecialOfferRepository.update.mockResolvedValue(updatedSpecialOffer);

      expect(await service.update('Summer Sale', updateSpecialOfferDto)).toEqual(updatedSpecialOffer);
      expect(mockSpecialOfferRepository.update).toHaveBeenCalledWith('Summer Sale', updateSpecialOfferDto);
    });

    it('should throw a NotFoundException if special offer not found', async () => {
      mockSpecialOfferRepository.update.mockResolvedValue(null);

      await expect(service.update('NotExist', { name: 'Winter Sale', discountPercentage: 25 })).rejects.toThrow(NotFoundException);
      expect(mockSpecialOfferRepository.update).toHaveBeenCalledWith('NotExist', { name: 'Winter Sale', discountPercentage: 25 });
    });
  });

  describe('remove', () => {
    it('should remove a special offer', async () => {
      mockSpecialOfferRepository.remove.mockResolvedValue({ deletedCount: 1 });

      await expect(service.remove('Summer Sale')).resolves.not.toThrow();
      expect(mockSpecialOfferRepository.remove).toHaveBeenCalledWith('Summer Sale');
    });

    it('should throw a NotFoundException if special offer not found', async () => {
      mockSpecialOfferRepository.remove.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('NotExist')).rejects.toThrow(NotFoundException);
      expect(mockSpecialOfferRepository.remove).toHaveBeenCalledWith('NotExist');
    });
  });
});
