import { IntegrationConnectorType } from '@/types';

export interface ConnectorMetadata {
  id: IntegrationConnectorType;
  name: string;
  description: string;
  mockEndpoint: string;
  supportedOperations: string[];
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
}

export const CONNECTOR_REGISTRY: Record<IntegrationConnectorType, ConnectorMetadata> = {
  IDBI_SANDBOX: {
    id: 'IDBI_SANDBOX',
    name: 'IDBI Bank Sandbox APIs',
    description: 'Sandbox API interface providing realistic access to customer profiles and ledger stubs.',
    mockEndpoint: 'https://sandbox.idbi.com/api/v1',
    supportedOperations: ['getCustomerDetails', 'getLedgerSummary', 'postAuditLog'],
    status: 'ONLINE'
  },
  CORE_BANKING: {
    id: 'CORE_BANKING',
    name: 'Finacle Core Banking Connector',
    description: 'Internal core banking link for deposit balances, interest rates, and loan ledgers.',
    mockEndpoint: 'https://internal.bank.net/cbs/v2',
    supportedOperations: ['getAccountBalance', 'createAccount', 'disburseLoan', 'freezeAccount'],
    status: 'ONLINE'
  },
  UPI: {
    id: 'UPI',
    name: 'NPCI UPI Engine Gateway',
    description: 'Unified Payments Interface callback route for peer-to-peer real-time transactions.',
    mockEndpoint: 'https://npci.upi.gov.in/api/v4',
    supportedOperations: ['initiateTransfer', 'verifyVPA', 'getTransactionStatus'],
    status: 'ONLINE'
  },
  ACCOUNT_AGGREGATOR: {
    id: 'ACCOUNT_AGGREGATOR',
    name: 'Account Aggregator Consent Manager',
    description: 'Provides encrypted, multi-bank consent-based access to customer statements.',
    mockEndpoint: 'https://aa.consentmanager.org.in/v1',
    supportedOperations: ['requestConsent', 'getConsentStatus', 'fetchFinancialData'],
    status: 'ONLINE'
  },
  GSTN: {
    id: 'GSTN',
    name: 'GST Network Tax Portal',
    description: 'Interface for fetching MSME monthly/quarterly tax returns (GSTR-1, GSTR-3B).',
    mockEndpoint: 'https://api.gst.gov.in/taxpayer',
    supportedOperations: ['fetchGSTR1', 'fetchGSTR3B', 'verifyGSTIN'],
    status: 'ONLINE'
  },
  CKYC: {
    id: 'CKYC',
    name: 'Central KYC Registry',
    description: 'Verifies customer credentials against the government CERSAI registry database.',
    mockEndpoint: 'https://ckycindia.in/api/v2',
    supportedOperations: ['searchCKYC', 'downloadCKYCDocument'],
    status: 'ONLINE'
  },
  PAN_VERIFICATION: {
    id: 'PAN_VERIFICATION',
    name: 'NSDL PAN Verification API',
    description: 'Validates Permanent Account Number registration status and matching names.',
    mockEndpoint: 'https://nsdl.pan.co.in/verify',
    supportedOperations: ['verifyPANStatus', 'fetchPANCardDetails'],
    status: 'ONLINE'
  },
  AADHAAR: {
    id: 'AADHAAR',
    name: 'UIDAI Aadhaar Verification Engine',
    description: 'Handles secure Aadhaar verification parameters and token lookups.',
    mockEndpoint: 'https://uidai.gov.in/auth/v3',
    supportedOperations: ['initiateOTP', 'verifyOTP', 'checkBiometricStatus'],
    status: 'ONLINE'
  },
  EPFO: {
    id: 'EPFO',
    name: 'EPFO Employment Registry',
    description: 'Retrieves corporate PF deposit histories to verify employment tenure and income.',
    mockEndpoint: 'https://epfindia.gov.in/api',
    supportedOperations: ['verifyEmployment', 'fetchPFHistory'],
    status: 'ONLINE'
  },
  OCEN: {
    id: 'OCEN',
    name: 'Open Credit Enabled Network Protocol',
    description: 'Decentralized lending API for immediate working capital and supplier finance.',
    mockEndpoint: 'https://ocen.network/lend/v1',
    supportedOperations: ['listOffers', 'acceptCreditTerms', 'drawdownLoan'],
    status: 'ONLINE'
  },
  CRM: {
    id: 'CRM',
    name: 'Salesforce Banking CRM Service',
    description: 'Stores customer relationship notes, value tiers, and interaction tickets.',
    mockEndpoint: 'https://crm.bank.net/salesforce',
    supportedOperations: ['getRMNotes', 'updateCustomerTier', 'logInteraction'],
    status: 'ONLINE'
  },
  DMS: {
    id: 'DMS',
    name: 'Enterprise Document Management System',
    description: 'Internal encrypted repository storing physical and digital documents.',
    mockEndpoint: 'https://dms.bank.net/storage',
    supportedOperations: ['uploadDocument', 'downloadDocument', 'deleteDocument', 'extractMetadata'],
    status: 'ONLINE'
  }
};
