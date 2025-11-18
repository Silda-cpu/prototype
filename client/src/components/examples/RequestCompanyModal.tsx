import { RequestCompanyModal } from '../RequestCompanyModal';
import type { Category } from '@shared/schema';

const mockCategories: Category[] = [
  { id: '1', name: 'Groceries', icon: '🛒', companies: [] },
  { id: '2', name: 'Coffee', icon: '☕', companies: [] },
  { id: '3', name: 'Retail', icon: '🛍️', companies: [] }
];

export default function RequestCompanyModalExample() {
  return (
    <RequestCompanyModal
      categories={mockCategories}
      onClose={() => console.log('Modal closed')}
      onSubmit={(request) => console.log('Request submitted:', request)}
    />
  );
}
