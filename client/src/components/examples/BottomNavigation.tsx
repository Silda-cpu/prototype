import { BottomNavigation } from '../BottomNavigation';
import { useState } from 'react';

export default function BottomNavigationExample() {
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'white-label' | 'profile' | 'settings'>('home');

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Current Page: {currentPage}</h2>
        <p className="text-slate-600">Click on the navigation items below to navigate between pages</p>
      </div>
      <BottomNavigation
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          console.log('Navigate to:', page);
        }}
      />
    </div>
  );
}
