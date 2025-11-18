import { WhiteLabelPage } from '../WhiteLabelPage';
import type { AppUser } from '@shared/schema';

const mockUser: AppUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  isGuest: false,
  overallScore: 72,
  categoryScores: {},
  userSpending: [],
  notifications: [],
  categoryOrder: [],
  categoryVisibility: {},
  whiteLabelSettings: {
    appName: 'White Label',
    color: '#14b8a6',
    mantra: 'Shop your politics. Spend your values.'
  }
};

export default function WhiteLabelPageExample() {
  return (
    <WhiteLabelPage
      user={mockUser}
      onSave={(settings) => console.log('Settings saved:', settings)}
    />
  );
}
