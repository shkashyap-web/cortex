import { Customer } from '@/types';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { domainRegistryService } from '../domain/DomainRegistry';
import { observabilityService } from '../observability/ObservabilityService';

export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  public async getCustomerById(id: string): Promise<Customer | undefined> {
    return observabilityService.measure('CustomerService', 'getCustomerById', async () => {
      const customer = MOCK_CUSTOMERS.find(c => c.id === id);
      if (customer) {
        domainRegistryService.registerEntity('Customer', customer.id);
      }
      return customer;
    });
  }

  public async listCustomers(): Promise<Customer[]> {
    return observabilityService.measure('CustomerService', 'listCustomers', async () => {
      return MOCK_CUSTOMERS;
    });
  }
}

export const customerService = CustomerService.getInstance();
export default customerService;
