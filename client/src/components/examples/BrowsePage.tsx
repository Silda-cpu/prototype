import { BrowsePage } from '../BrowsePage';
import type { AppUser, Category } from '@shared/schema';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Groceries',
    icon: '🛒',
    userStores: ['c1'],
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
  },
  {
    id: '2',
    name: 'Coffee',
    icon: '☕',
    userStores: [],
    companies: [
      {
        id: 'c4',
        name: 'Starbucks',
        description: 'Global coffee chain',
        category: '2',
        score: 42,
        status: 'neutral',
        politicalInfo: { donations: [], lobbying: [], statements: [] }
      },
      {
        id: 'c5',
        name: 'Blue Bottle',
        description: 'Artisanal coffee roaster',
        category: '2',
        score: 82,
        status: 'support',
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
    { companyId: 'c4', companyName: 'Starbucks', categoryId: '2', amount: 340, date: '2024-01-18' }
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

export default function BrowsePageExample() {
  return (
    <BrowsePage
      categories={mockCategories}
      user={mockUser}
      onCompanySelect={(company) => console.log('Company selected:', company.name)}
      onAddStore={(catId, storeId) => console.log('Add store:', storeId, 'to category:', catId)}
      onRemoveStore={(catId, storeId) => console.log('Remove store:', storeId, 'from category:', catId)}
      onUpdateCategoryOrder={(order) => console.log('New order:', order)}
    />
  );
}
