import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../src/app.service';
import { CustomerRepository } from '../src/repositories/customer.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from '../src/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../src/dtos/update-customer.dto';
import { Customer } from '../src/schemas/customer.schema';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: CustomerRepository;

  const mockCustomerRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = { name: 'John', email: 'john@example.com' };
      const createdCustomer = { id: '1', ...createCustomerDto };
      mockCustomerRepository.create.mockResolvedValue(createdCustomer);

      expect(await service.create(createCustomerDto)).toEqual(createdCustomer);
      expect(mockCustomerRepository.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [{ id: '1', name: 'John', email: 'john@example.com' }];
      mockCustomerRepository.findAll.mockResolvedValue(customers);

      expect(await service.findAll()).toEqual(customers);
      expect(mockCustomerRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by email', async () => {
      const customer = { id: '1', name: 'John', email: 'john@example.com' };
      mockCustomerRepository.findOne.mockResolvedValue(customer);

      expect(await service.findOne('john@example.com')).toEqual(customer);
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith('john@example.com');
    });

    it('should throw a NotFoundException if customer not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('notfound@example.com')).rejects.toThrow(NotFoundException);
      expect(mockCustomerRepository.findOne).toHaveBeenCalledWith('notfound@example.com');
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = { name: 'Jane' };
      const updatedCustomer = { id: '1', name: 'Jane', email: 'john@example.com' };
      mockCustomerRepository.update.mockResolvedValue(updatedCustomer);

      expect(await service.update('john@example.com', updateCustomerDto)).toEqual(updatedCustomer);
      expect(mockCustomerRepository.update).toHaveBeenCalledWith('john@example.com', updateCustomerDto);
    });

    it('should throw a NotFoundException if customer not found', async () => {
      mockCustomerRepository.update.mockResolvedValue(null);

      await expect(service.update('notfound@example.com', { name: 'Jane' })).rejects.toThrow(NotFoundException);
      expect(mockCustomerRepository.update).toHaveBeenCalledWith('notfound@example.com', { name: 'Jane' });
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      mockCustomerRepository.remove.mockResolvedValue({ deletedCount: 1 });

      await expect(service.remove('john@example.com')).resolves.not.toThrow();
      expect(mockCustomerRepository.remove).toHaveBeenCalledWith('john@example.com');
    });

    it('should throw a NotFoundException if customer not found', async () => {
      mockCustomerRepository.remove.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove('notfound@example.com')).rejects.toThrow(NotFoundException);
      expect(mockCustomerRepository.remove).toHaveBeenCalledWith('notfound@example.com');
    });
  });
});
