import { CategoryDetailPage } from '../CategoryDetailPage';
import type { AppUser, Category } from '@shared/schema';

const mockCategory: Category = {
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
    },
    {
      id: 'c3',
      name: 'Kroger',
      description: 'Major supermarket chain',
      category: '1',
      score: 45,
      status: 'neutral',
      politicalInfo: { donations: [], lobbying: [], statements: [] }
    }
  ]
};

const mockUser: AppUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  isGuest: false,
  overallScore: 72,
  categoryScores: { '1': 82 },
  userSpending: [
    { companyId: 'c1', companyName: 'Whole Foods', categoryId: '1', amount: 1250, date: '2024-01-15' },
    { companyId: 'c2', companyName: 'Trader Joes', categoryId: '1', amount: 800, date: '2024-01-20' }
  ],
  notifications: [],
  categoryOrder: ['1'],
  categoryVisibility: { '1': true },
  whiteLabelSettings: {
    appName: 'White Label',
    color: '#14b8a6',
    mantra: 'Shop your politics. Spend your values.'
  }
};

export default function CategoryDetailPageExample() {
  return (
    <CategoryDetailPage
      category={mockCategory}
      user={mockUser}
      onBack={() => console.log('Go back')}
      onCompanySelect={(company) => console.log('Company selected:', company.name)}
      onLogin={() => console.log('Login clicked')}
    />
  );
}
