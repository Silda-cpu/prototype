import { CompanyDetail } from '../CompanyDetail';
import type { Company } from '@shared/schema';

const mockCompany: Company = {
  id: 'c1',
  name: 'Whole Foods',
  description: 'Organic grocery chain owned by Amazon',
  category: '1',
  score: 85,
  status: 'support',
  website: 'https://www.wholefoodsmarket.com',
  politicalInfo: {
    donations: [
      {
        recipient: 'Environmental Defense Fund',
        amount: '$2.5 million',
        year: 2024
      },
      {
        recipient: 'Fair Labor Standards PAC',
        amount: '$1.2 million',
        year: 2023
      }
    ],
    lobbying: [
      {
        issue: 'Sustainable Agriculture Standards',
        amount: '$850,000',
        year: 2024
      },
      {
        issue: 'Worker Rights Protection',
        amount: '$620,000',
        year: 2023
      }
    ],
    statements: [
      'Committed to carbon neutrality by 2030',
      'Implemented $15 minimum wage for all employees',
      'Publicly supported voting rights legislation',
      'Donated $5M to local food banks and community programs'
    ]
  }
};

const mockAlternatives: Company[] = [
  {
    id: 'c2',
    name: 'Trader Joes',
    description: 'Affordable organic groceries',
    category: '1',
    score: 92,
    status: 'support',
    politicalInfo: { donations: [], lobbying: [], statements: [] }
  }
];

export default function CompanyDetailExample() {
  return (
    <CompanyDetail
      company={mockCompany}
      onClose={() => console.log('Close modal')}
      allCompanies={[mockCompany, ...mockAlternatives]}
      onCompanySelect={(company) => console.log('Select company:', company.name)}
    />
  );
}
