import { ProfilePage } from '../ProfilePage';
import type { AppUser, Category } from '@shared/schema';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Groceries',
    icon: '🛒',
    companies: [
      {
        id: 'c1',
        name: 'Whole Foods',
        description: 'Organic grocery chain',
        category: '1',
        score: 85,
        status: 'support',
        politicalInfo: { donations: [], lobbying: [], statements: [] }
      },
      {
        id: 'c2',
        name: 'Trader Joes',
        description: 'Affordable organic groceries',
        category: '1',
        score: 78,
        status: 'neutral',
        politicalInfo: { donations: [], lobbying: [], statements: [] }
      }
    ]
  },
  {
    id: '2',
    name: 'Coffee',
    icon: '☕',
    companies: [
      {
        id: 'c3',
        name: 'Starbucks',
        description: 'Global coffee chain',
        category: '2',
        score: 42,
        status: 'neutral',
        politicalInfo: { donations: [], lobbying: [], statements: [] }
      }
    ]
  }
];

const mockUser: AppUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  isGuest: false,
  overallScore: 72,
  categoryScores: { '1': 82, '2': 42 },
  userSpending: [
    { companyId: 'c1', companyName: 'Whole Foods', categoryId: '1', amount: 1250, date: '2024-01-15' },
    { companyId: 'c2', companyName: 'Trader Joes', categoryId: '1', amount: 800, date: '2024-01-20' },
    { companyId: 'c3', companyName: 'Starbucks', categoryId: '2', amount: 340, date: '2024-01-18' }
  ],
  notifications: [],
  categoryOrder: ['1', '2'],
  categoryVisibility: { '1': true, '2': true },
  whiteLabelSettings: {
    appName: 'White Label',
    color: '#14b8a6',
    mantra: 'Shop your politics. Spend your values.'
  }
};

export default function ProfilePageExample() {
  return (
    <ProfilePage
      user={mockUser}
      categories={mockCategories}
      onLogin={() => console.log('Login clicked')}
      onCompanySelect={(company) => console.log('Company selected:', company.name)}
      onCategorySelect={(category) => console.log('Category selected:', category.name)}
    />
  );
}
