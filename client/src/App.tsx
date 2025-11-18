import { useState } from 'react';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { AppUser, Category, Company, UserSpending } from '@shared/schema';
import { HomePage } from './components/HomePage';
import { BrowsePage } from './components/BrowsePage';
import { ProfilePage } from './components/ProfilePage';
import { AuthModal } from './components/AuthModal';
import { BottomNavigation } from './components/BottomNavigation';
import { CompanyDetail } from './components/CompanyDetail';
import { RequestCompanyModal } from './components/RequestCompanyModal';
import { CategoryDetailPage } from './components/CategoryDetailPage';
import { SettingsPage } from './components/SettingsPage';

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Grocery shopping',
    icon: '🛒',
    userStores: [],
    companies: [
      { id: 'c1', name: 'Whole Foods', description: 'Organic grocery chain', category: '1', score: 85, status: 'support', website: 'https://www.wholefoodsmarket.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Committed to carbon neutrality by 2030'] } }},
      { id: 'c2', name: 'Trader Joes', description: 'Affordable organic groceries', category: '1', score: 78, status: 'neutral', website: 'https://www.traderjoes.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Committed to sustainable packaging'] } }},
      { id: 'c3', name: 'Kroger', description: 'Major supermarket chain', category: '1', score: 45, status: 'neutral', website: 'https://www.kroger.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c4', name: 'Safeway', description: 'Supermarket chain', category: '1', score: 52, status: 'neutral', website: 'https://www.safeway.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c401', name: 'Publix', description: 'Employee-owned supermarket', category: '1', score: 68, status: 'neutral', website: 'https://www.publix.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Employee stock ownership'] } }},
      { id: 'c402', name: 'Albertsons', description: 'Grocery store chain', category: '1', score: 48, status: 'neutral', website: 'https://www.albertsons.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c403', name: 'Wegmans', description: 'Family-owned supermarket', category: '1', score: 72, status: 'support', website: 'https://www.wegmans.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Top employer'] } }},
      { id: 'c404', name: 'Costco', description: 'Wholesale warehouse club', category: '1', score: 75, status: 'support', politicalLean: 'progressive', website: 'https://www.costco.com', politicalInfo: { donations: { available: true, pacName: 'Costco Wholesale PAC', totalDonations: 420000, lastDonationDate: '2024-08-25', partyBreakdown: [{ party: 'Democratic', amount: 273000 }, { party: 'Republican', amount: 147000 }], topRecipients: [{ name: 'Worker Rights Advocate (D-WA)', amount: 28000 }, { name: 'Small Business Champion (D-CA)', amount: 22000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Fair employee wages'] } }},
      { id: 'c405', name: 'Walmart', description: 'Discount supermarket chain', category: '1', score: 32, status: 'boycott', politicalLean: 'conservative', website: 'https://www.walmart.com', politicalInfo: { donations: { available: true, pacName: 'Walmart Inc. PAC', totalDonations: 1200000, lastDonationDate: '2024-06-18', partyBreakdown: [{ party: 'Democratic', amount: 300000 }, { party: 'Republican', amount: 900000 }], topRecipients: [{ name: 'Business Committee Chair (R-AR)', amount: 45000 }, { name: 'Commerce Leader (R-TX)', amount: 38000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Anti-union lobbying history'] } }},
      { id: 'c406', name: 'Aldi', description: 'Discount grocery chain', category: '1', score: 62, status: 'neutral', website: 'https://www.aldi.us', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Efficient operations'] } }},
    ]
  },
  {
    id: '2',
    name: 'Hardware stores',
    icon: '🔨',
    userStores: [],
    companies: [
      { id: 'c5', name: 'Home Depot', description: 'Home improvement retailer', category: '2', score: 38, status: 'neutral', politicalLean: 'conservative', website: 'https://www.homedepot.com', politicalInfo: { donations: { available: true, pacName: 'Home Depot Inc. PAC', totalDonations: 680000, lastDonationDate: '2024-07-10', partyBreakdown: [{ party: 'Democratic', amount: 204000 }, { party: 'Republican', amount: 476000 }], topRecipients: [{ name: 'Construction Industry Supporter (R-GA)', amount: 35000 }, { name: 'Business Tax Reform Leader (R-FL)', amount: 28000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Pro-business advocacy'] } }},
      { id: 'c6', name: 'Lowes', description: 'Home improvement chain', category: '2', score: 42, status: 'neutral', website: 'https://www.lowes.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c7', name: 'Ace Hardware', description: 'Local hardware cooperative', category: '2', score: 68, status: 'neutral', website: 'https://www.acehardware.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Supports local businesses'] } }},
      { id: 'c501', name: 'Menards', description: 'Midwest home improvement chain', category: '2', score: 35, status: 'boycott', website: 'https://www.menards.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c502', name: 'True Value', description: 'Hardware store cooperative', category: '2', score: 65, status: 'neutral', website: 'https://www.truevalue.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Locally owned stores'] } }},
      { id: 'c503', name: 'Harbor Freight', description: 'Discount tool retailer', category: '2', score: 45, status: 'neutral', website: 'https://www.harborfreight.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c504', name: 'Tractor Supply', description: 'Rural lifestyle retailer', category: '2', score: 48, status: 'neutral', website: 'https://www.tractorsupply.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c505', name: 'Northern Tool', description: 'Equipment and tool retailer', category: '2', score: 52, status: 'neutral', website: 'https://www.northerntool.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c506', name: 'Orchard Supply', description: 'California hardware chain', category: '2', score: 58, status: 'neutral', website: '', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Community focused'] } }},
    ]
  },
  {
    id: '3',
    name: 'Clothes shopping',
    icon: '👕',
    userStores: [],
    companies: [
      { id: 'c8', name: 'Patagonia', description: 'Outdoor clothing and gear', category: '3', score: 92, status: 'support', politicalLean: 'progressive', website: 'https://www.patagonia.com', politicalInfo: { donations: { available: true, pacName: 'Patagonia Action Works Fund', totalDonations: 580000, lastDonationDate: '2024-09-15', partyBreakdown: [{ party: 'Democratic', amount: 470000 }, { party: 'Republican', amount: 110000 }], topRecipients: [{ name: 'Environmental Candidate (D-CO)', amount: 25000 }, { name: 'Green Energy Advocate (D-CA)', amount: 20000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['1% for the Planet member', 'Fair Trade Certified', 'Environmental activism'] } }},
      { id: 'c9', name: 'Gap', description: 'Casual clothing retailer', category: '3', score: 55, status: 'neutral', website: 'https://www.gap.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c10', name: 'Zara', description: 'Fast fashion retailer', category: '3', score: 35, status: 'boycott', website: 'https://www.zara.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Criticized for labor practices'] } }},
      { id: 'c11', name: 'Nike', description: 'Athletic apparel and footwear', category: '3', score: 62, status: 'neutral', politicalLean: 'progressive', website: 'https://www.nike.com', politicalInfo: { donations: { available: true, pacName: 'Nike Inc. PAC', totalDonations: 520000, lastDonationDate: '2024-08-15', partyBreakdown: [{ party: 'Democratic', amount: 374400 }, { party: 'Republican', amount: 145600 }], topRecipients: [{ name: 'Social Justice Leader (D-OR)', amount: 32000 }, { name: 'Worker Safety Advocate (D-CA)', amount: 26000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Improved labor standards', 'Social justice advocacy'] } }},
      { id: 'c801', name: 'H&M', description: 'Fashion retailer', category: '3', score: 48, status: 'neutral', website: 'https://www.hm.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Sustainability efforts'] } }},
      { id: 'c802', name: 'Uniqlo', description: 'Japanese casual wear', category: '3', score: 52, status: 'neutral', website: 'https://www.uniqlo.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c803', name: 'Levi Strauss', description: 'Denim and apparel', category: '3', score: 78, status: 'support', website: 'https://www.levi.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Gun safety advocacy', 'Worker rights'] } }},
      { id: 'c804', name: 'Nordstrom', description: 'Department store', category: '3', score: 68, status: 'neutral', website: 'https://www.nordstrom.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Diversity initiatives'] } }},
      { id: 'c805', name: 'Target', description: 'Discount retailer', category: '3', score: 58, status: 'neutral', website: 'https://www.target.com', politicalInfo: { donations: { available: true, pacName: 'Target Corporation PAC', totalDonations: 340000, lastDonationDate: '2024-09-05', partyBreakdown: [{ party: 'Democratic', amount: 187000 }, { party: 'Republican', amount: 153000 }], topRecipients: [{ name: 'Equality Advocate (D-MN)', amount: 22000 }, { name: 'Retail Policy Leader (R-OH)', amount: 18000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Diversity and inclusion focus'] } }},
      { id: 'c806', name: 'Old Navy', description: 'Affordable fashion', category: '3', score: 55, status: 'neutral', website: 'https://www.oldnavy.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '4',
    name: 'Car insurance',
    icon: '🚗',
    userStores: [],
    companies: [
      { id: 'c12', name: 'Geico', description: 'Auto insurance provider', category: '4', score: 48, status: 'neutral', website: 'https://www.geico.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c13', name: 'Progressive', description: 'Insurance company', category: '4', score: 72, status: 'support', politicalLean: 'neutral', website: 'https://www.progressive.com', politicalInfo: { donations: { available: true, pacName: 'Progressive Corporation PAC', totalDonations: 380000, lastDonationDate: '2024-06-28', partyBreakdown: [{ party: 'Democratic', amount: 190000 }, { party: 'Republican', amount: 190000 }], topRecipients: [{ name: 'Insurance Reform (D-OH)', amount: 24000 }, { name: 'Business Committee (R-OH)', amount: 24000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Supports LGBTQ+ rights'] } }},
      { id: 'c14', name: 'State Farm', description: 'Insurance and financial services', category: '4', score: 52, status: 'neutral', website: 'https://www.statefarm.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1201', name: 'Allstate', description: 'Insurance provider', category: '4', score: 45, status: 'neutral', website: 'https://www.allstate.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1202', name: 'Liberty Mutual', description: 'Insurance company', category: '4', score: 50, status: 'neutral', website: 'https://www.libertymutual.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1203', name: 'USAA', description: 'Military insurance', category: '4', score: 65, status: 'neutral', website: 'https://www.usaa.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Serves military families'] } }},
      { id: 'c1204', name: 'Farmers Insurance', description: 'Auto and home insurance', category: '4', score: 48, status: 'neutral', website: 'https://www.farmers.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1205', name: 'Nationwide', description: 'Insurance and financial services', category: '4', score: 55, status: 'neutral', website: 'https://www.nationwide.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1206', name: 'Esurance', description: 'Digital insurance provider', category: '4', score: 58, status: 'neutral', website: 'https://www.esurance.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '5',
    name: 'Streaming services',
    icon: '📺',
    userStores: [],
    companies: [
      { id: 'c15', name: 'Netflix', description: 'Streaming entertainment service', category: '5', score: 68, status: 'neutral', website: 'https://www.netflix.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Diverse content creation'] } }},
      { id: 'c16', name: 'Spotify', description: 'Music streaming platform', category: '5', score: 58, status: 'neutral', website: 'https://www.spotify.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c17', name: 'Disney+', description: 'Family entertainment streaming', category: '5', score: 45, status: 'neutral', website: 'https://www.disneyplus.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1501', name: 'Hulu', description: 'Streaming platform', category: '5', score: 52, status: 'neutral', website: 'https://www.hulu.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1502', name: 'HBO Max', description: 'Premium streaming', category: '5', score: 62, status: 'neutral', website: 'https://www.hbomax.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1503', name: 'Apple TV+', description: 'Apple streaming service', category: '5', score: 70, status: 'support', website: 'https://www.apple.com/tv', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Privacy focused'] } }},
      { id: 'c1504', name: 'YouTube Premium', description: 'Ad-free video platform', category: '5', score: 48, status: 'neutral', website: 'https://www.youtube.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1505', name: 'Amazon Prime Video', description: 'Video streaming service', category: '5', score: 42, status: 'neutral', website: 'https://www.amazon.com/prime', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1506', name: 'Paramount+', description: 'Entertainment streaming', category: '5', score: 50, status: 'neutral', website: 'https://www.paramountplus.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c1507', name: 'AT&T', description: 'Telecommunications and media', category: '5', score: 45, status: 'neutral', politicalLean: 'conservative', website: 'https://www.att.com', politicalInfo: { donations: { available: true, pacName: 'AT&T Inc. Federal PAC', totalDonations: 1850000, lastDonationDate: '2024-09-10', partyBreakdown: [{ party: 'Democratic', amount: 832500 }, { party: 'Republican', amount: 1017500 }], topRecipients: [{ name: 'Telecom Committee (R-TX)', amount: 58000 }, { name: '5G Infrastructure (D-CA)', amount: 45000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Major telecom donor'] } }},
    ]
  },
  {
    id: '6',
    name: 'Car purchase',
    icon: '🏎️',
    userStores: [],
    companies: [
      { id: 'c18', name: 'Tesla', description: 'Electric vehicle manufacturer', category: '6', score: 42, status: 'neutral', website: 'https://www.tesla.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Controversial leadership'] } }},
      { id: 'c19', name: 'Toyota', description: 'Automobile manufacturer', category: '6', score: 55, status: 'neutral', website: 'https://www.toyota.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c20', name: 'Ford', description: 'American auto manufacturer', category: '6', score: 65, status: 'neutral', website: 'https://www.ford.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Investing in electric vehicles'] } }},
    ]
  },
  {
    id: '7',
    name: 'Higher education',
    icon: '🎓',
    userStores: [],
    companies: [
      { id: 'c21', name: 'Harvard University', description: 'Private research university', category: '7', score: 75, status: 'support', website: 'https://www.harvard.edu', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Financial aid for low-income students'] } }},
      { id: 'c22', name: 'MIT', description: 'Technology research university', category: '7', score: 82, status: 'support', website: 'https://www.mit.edu', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Need-blind admissions'] } }},
      { id: 'c23', name: 'University of Phoenix', description: 'For-profit online university', category: '7', score: 28, status: 'boycott', website: 'https://www.phoenix.edu', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Criticized for student debt'] } }},
    ]
  },
  {
    id: '8',
    name: 'Health insurance',
    icon: '🏥',
    userStores: [],
    companies: [
      { id: 'c24', name: 'Blue Cross Blue Shield', description: 'Health insurance provider', category: '8', score: 52, status: 'neutral', website: 'https://www.bcbs.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c25', name: 'UnitedHealth', description: 'Health insurance company', category: '8', score: 38, status: 'neutral', website: 'https://www.uhc.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c26', name: 'Kaiser Permanente', description: 'Integrated healthcare provider', category: '8', score: 78, status: 'support', website: 'https://www.kp.org', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Non-profit healthcare model'] } }},
    ]
  },
  {
    id: '9',
    name: 'Life insurance',
    icon: '🛡️',
    userStores: [],
    companies: [
      { id: 'c27', name: 'Northwestern Mutual', description: 'Life insurance and financial services', category: '9', score: 62, status: 'neutral', website: 'https://www.northwesternmutual.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c28', name: 'MetLife', description: 'Insurance provider', category: '9', score: 48, status: 'neutral', website: 'https://www.metlife.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c29', name: 'Prudential', description: 'Financial services company', category: '9', score: 55, status: 'neutral', website: 'https://www.prudential.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '10',
    name: 'Healthcare',
    icon: '⚕️',
    userStores: [],
    companies: [
      { id: 'c30', name: 'CVS Health', description: 'Pharmacy and healthcare', category: '10', score: 58, status: 'neutral', website: 'https://www.cvs.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c31', name: 'Walgreens', description: 'Pharmacy chain', category: '10', score: 52, status: 'neutral', website: 'https://www.walgreens.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c32', name: 'Johnson & Johnson', description: 'Healthcare products', category: '10', score: 45, status: 'neutral', website: 'https://www.jnj.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '11',
    name: 'Newspaper/Magazines',
    icon: '📰',
    userStores: [],
    companies: [
      { id: 'c33', name: 'The New York Times', description: 'Daily newspaper', category: '11', score: 75, status: 'support', website: 'https://www.nytimes.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Independent journalism'] } }},
      { id: 'c34', name: 'The Washington Post', description: 'Daily newspaper', category: '11', score: 72, status: 'support', website: 'https://www.washingtonpost.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Democracy Dies in Darkness'] } }},
      { id: 'c35', name: 'The Wall Street Journal', description: 'Business newspaper', category: '11', score: 58, status: 'neutral', website: 'https://www.wsj.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '12',
    name: 'Online retailers',
    icon: '📦',
    userStores: [],
    companies: [
      { id: 'c36', name: 'Amazon', description: 'E-commerce and cloud computing', category: '12', score: 42, status: 'neutral', website: 'https://www.amazon.com', politicalInfo: { donations: { available: true, pacName: 'Amazon.com PAC', totalDonations: 1450000, lastDonationDate: '2024-09-20', partyBreakdown: [{ party: 'Democratic', amount: 754000 }, { party: 'Republican', amount: 696000 }], topRecipients: [{ name: 'Tech Innovation Leader (D-WA)', amount: 55000 }, { name: 'E-commerce Committee (R-TX)', amount: 48000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Criticized for warehouse conditions'] } }},
      { id: 'c37', name: 'Etsy', description: 'Handmade and vintage marketplace', category: '12', score: 82, status: 'support', website: 'https://www.etsy.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['B-Corp certified', 'Supports small businesses'] } }},
      { id: 'c38', name: 'eBay', description: 'Online auction platform', category: '12', score: 55, status: 'neutral', website: 'https://www.ebay.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '13',
    name: 'Banking',
    icon: '🏦',
    userStores: [],
    companies: [
      { id: 'c39', name: 'Chase Bank', description: 'Major banking institution', category: '13', score: 35, status: 'boycott', politicalLean: 'conservative', website: 'https://www.chase.com', politicalInfo: { donations: { available: true, pacName: 'JPMorgan Chase & Co. PAC', totalDonations: 2100000, lastDonationDate: '2024-08-30', partyBreakdown: [{ party: 'Democratic', amount: 735000 }, { party: 'Republican', amount: 1365000 }], topRecipients: [{ name: 'Banking Committee Chair (R-NY)', amount: 65000 }, { name: 'Financial Services Leader (R-TX)', amount: 52000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Major financial sector donor'] } }},
      { id: 'c40', name: 'Bank of America', description: 'Multinational bank', category: '13', score: 38, status: 'neutral', website: 'https://www.bankofamerica.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c41', name: 'Aspiration', description: 'Sustainable banking', category: '13', score: 88, status: 'support', website: 'https://www.aspiration.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Carbon-neutral banking', 'Fossil fuel free'] } }},
      { id: 'c3901', name: 'Wells Fargo', description: 'National bank', category: '13', score: 32, status: 'boycott', politicalLean: 'conservative', website: 'https://www.wellsfargo.com', politicalInfo: { donations: { available: true, pacName: 'Wells Fargo & Company PAC', totalDonations: 1650000, lastDonationDate: '2024-07-15', partyBreakdown: [{ party: 'Democratic', amount: 627000 }, { party: 'Republican', amount: 1023000 }], topRecipients: [{ name: 'Banking Regulation (R-CA)', amount: 48000 }, { name: 'Financial Committee (R-NC)', amount: 42000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Numerous scandals'] } }},
      { id: 'c3902', name: 'Citibank', description: 'Global bank', category: '13', score: 40, status: 'neutral', website: 'https://www.citi.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c3903', name: 'Capital One', description: 'Financial services', category: '13', score: 48, status: 'neutral', website: 'https://www.capitalone.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c3904', name: 'PNC Bank', description: 'Regional bank', category: '13', score: 52, status: 'neutral', website: 'https://www.pnc.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c3905', name: 'TD Bank', description: 'Banking services', category: '13', score: 55, status: 'neutral', website: 'https://www.td.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c3906', name: 'Ally Bank', description: 'Online banking', category: '13', score: 68, status: 'neutral', website: 'https://www.ally.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Digital-first approach'] } }},
    ]
  },
  {
    id: '14',
    name: 'Restaurants',
    icon: '🍔',
    userStores: [],
    companies: [
      { id: 'c42', name: 'Chipotle', description: 'Fast-casual Mexican restaurant', category: '14', score: 75, status: 'support', politicalLean: 'progressive', website: 'https://www.chipotle.com', politicalInfo: { donations: { available: true, pacName: 'Chipotle Mexican Grill PAC', totalDonations: 175000, lastDonationDate: '2024-08-08', partyBreakdown: [{ party: 'Democratic', amount: 122500 }, { party: 'Republican', amount: 52500 }], topRecipients: [{ name: 'Food Safety Advocate (D-CO)', amount: 15000 }, { name: 'Agriculture Committee (D-CA)', amount: 12000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Food with integrity', 'Fair wage practices'] } }},
      { id: 'c43', name: 'McDonalds', description: 'Fast food chain', category: '14', score: 32, status: 'boycott', website: 'https://www.mcdonalds.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c44', name: 'Starbucks', description: 'Coffee chain', category: '14', score: 42, status: 'neutral', politicalLean: 'progressive', website: 'https://www.starbucks.com', politicalInfo: { donations: { available: true, pacName: 'Starbucks Corporation PAC', totalDonations: 285000, lastDonationDate: '2024-07-22', partyBreakdown: [{ party: 'Democratic', amount: 193800 }, { party: 'Republican', amount: 91200 }], topRecipients: [{ name: 'Labor Rights Advocate (D-WA)', amount: 18000 }, { name: 'Small Business Supporter (D-CA)', amount: 15000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Anti-union activities'] } }},
      { id: 'c4201', name: 'Panera Bread', description: 'Bakery cafe chain', category: '14', score: 68, status: 'neutral', website: 'https://www.panerabread.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Clean ingredients'] } }},
      { id: 'c4202', name: 'Shake Shack', description: 'Burger restaurant', category: '14', score: 72, status: 'support', website: 'https://www.shakeshack.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Fair wages'] } }},
      { id: 'c4203', name: 'In-N-Out Burger', description: 'West Coast burger chain', category: '14', score: 45, status: 'neutral', website: 'https://www.in-n-out.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c4204', name: 'Subway', description: 'Sandwich chain', category: '14', score: 48, status: 'neutral', website: 'https://www.subway.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c4205', name: 'Sweetgreen', description: 'Healthy fast-casual', category: '14', score: 82, status: 'support', website: 'https://www.sweetgreen.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Sustainable sourcing', 'Fair wages'] } }},
      { id: 'c4206', name: 'Chick-fil-A', description: 'Chicken restaurant', category: '14', score: 28, status: 'boycott', website: 'https://www.chick-fil-a.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '15',
    name: 'Garbage pickup',
    icon: '🗑️',
    userStores: [],
    companies: [
      { id: 'c45', name: 'Waste Management', description: 'Waste services provider', category: '15', score: 52, status: 'neutral', website: 'https://www.wm.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c46', name: 'Republic Services', description: 'Waste disposal company', category: '15', score: 48, status: 'neutral', website: 'https://www.republicservices.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c47', name: 'Local Waste Services', description: 'Community waste management', category: '15', score: 72, status: 'support', website: '', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Community-owned'] } }},
    ]
  },
  {
    id: '16',
    name: 'Payment services',
    icon: '💳',
    userStores: [],
    companies: [
      { id: 'c48', name: 'PayPal', description: 'Digital payment platform', category: '16', score: 62, status: 'neutral', website: 'https://www.paypal.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c49', name: 'Venmo', description: 'Peer-to-peer payment app', category: '16', score: 58, status: 'neutral', website: 'https://www.venmo.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c50', name: 'Square', description: 'Payment processing', category: '16', score: 68, status: 'neutral', politicalLean: 'neutral', website: 'https://www.square.com', politicalInfo: { donations: { available: true, pacName: 'Block Inc. PAC', totalDonations: 195000, lastDonationDate: '2024-08-12', partyBreakdown: [{ party: 'Democratic', amount: 120000 }, { party: 'Republican', amount: 75000 }], topRecipients: [{ name: 'Jane Doe (D-CA)', amount: 15000 }, { name: 'John Smith (R-TX)', amount: 12000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Small business focus'] } }},
    ]
  },
  {
    id: '17',
    name: 'Travel',
    icon: '✈️',
    userStores: [],
    companies: [
      { id: 'c51', name: 'Airbnb', description: 'Vacation rental marketplace', category: '17', score: 65, status: 'neutral', website: 'https://www.airbnb.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c52', name: 'Expedia', description: 'Travel booking platform', category: '17', score: 52, status: 'neutral', website: 'https://www.expedia.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c53', name: 'Delta Airlines', description: 'Major airline', category: '17', score: 48, status: 'neutral', website: 'https://www.delta.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '18',
    name: 'Trading',
    icon: '📈',
    userStores: [],
    companies: [
      { id: 'c54', name: 'Robinhood', description: 'Commission-free trading app', category: '18', score: 45, status: 'neutral', website: 'https://www.robinhood.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Controversial trading restrictions'] } }},
      { id: 'c55', name: 'Fidelity', description: 'Investment management', category: '18', score: 62, status: 'neutral', website: 'https://www.fidelity.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c56', name: 'Vanguard', description: 'Investment company', category: '18', score: 75, status: 'support', website: 'https://www.vanguard.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Client-owned structure'] } }},
    ]
  },
  {
    id: '19',
    name: 'Entertainment',
    icon: '🎬',
    userStores: [],
    companies: [
      { id: 'c57', name: 'AMC Theatres', description: 'Movie theater chain', category: '19', score: 48, status: 'neutral', website: 'https://www.amctheatres.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c58', name: 'Live Nation', description: 'Entertainment company', category: '19', score: 42, status: 'neutral', website: 'https://www.livenation.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Criticized for monopolistic practices'] } }},
      { id: 'c59', name: 'Local Venues', description: 'Independent entertainment spaces', category: '19', score: 85, status: 'support', website: '', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Supports local artists'] } }},
    ]
  },
  {
    id: '20',
    name: 'Fitness',
    icon: '💪',
    userStores: [],
    companies: [
      { id: 'c63', name: 'Planet Fitness', description: 'Budget gym chain', category: '20', score: 65, status: 'neutral', website: 'https://www.planetfitness.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: true, tags: ['Judgment-free zone'] } }},
      { id: 'c61', name: 'Equinox', description: 'Luxury fitness club', category: '20', score: 38, status: 'neutral', website: 'https://www.equinox.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
      { id: 'c62', name: 'LA Fitness', description: 'Gym and fitness center', category: '20', score: 52, status: 'neutral', website: 'https://www.lafitness.com', politicalInfo: { donations: { available: false }, lobbying: { available: false }, statements: { available: false } }},
    ]
  },
  {
    id: '21',
    name: 'Energy',
    icon: '⚡',
    userStores: [],
    companies: [
      { id: 'c60', name: 'ExxonMobil', description: 'Oil and gas corporation', category: '21', score: 22, status: 'boycott', politicalLean: 'conservative', website: 'https://www.exxonmobil.com', politicalInfo: { donations: { available: true, pacName: 'ExxonMobil PAC', totalDonations: 850000, lastDonationDate: '2024-07-20', partyBreakdown: [{ party: 'Democratic', amount: 170000 }, { party: 'Republican', amount: 680000 }], topRecipients: [{ name: 'Energy Committee Chair (R-TX)', amount: 45000 }, { name: 'Oil Industry Supporter (R-LA)', amount: 38000 }], source: 'FEC API (mock data)' }, lobbying: { available: false }, statements: { available: true, tags: ['Climate change denial history'] } }},
    ]
  },
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'browse' | 'settings' | 'profile'>('home');
  const [showAuth, setShowAuth] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [initialExpandedCategoryId, setInitialExpandedCategoryId] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [categories, setCategories] = useState(mockCategories);
  const [user, setUser] = useState<AppUser | null>(null);
  const { toast } = useToast();

  const handleLogin = (userData: { name: string; email: string }) => {
    const categoryOrder = categories.map(c => c.id);
    const categoryVisibility = Object.fromEntries(categories.map(c => [c.id, true]));
    
    // Create initial spending data across multiple categories
    const initialSpending: UserSpending[] = [
      // Grocery
      { companyId: 'c1', companyName: 'Whole Foods', categoryId: '1', amount: 180, date: new Date().toISOString() },
      { companyId: 'c403', companyName: 'Wegmans', categoryId: '1', amount: 145, date: new Date().toISOString() },
      { companyId: 'c404', companyName: 'Costco', categoryId: '1', amount: 220, date: new Date().toISOString() },
      // Hardware
      { companyId: 'c7', companyName: 'Ace Hardware', categoryId: '2', amount: 85, date: new Date().toISOString() },
      { companyId: 'c502', companyName: 'True Value', categoryId: '2', amount: 65, date: new Date().toISOString() },
      // Clothes
      { companyId: 'c8', companyName: 'Patagonia', categoryId: '3', amount: 160, date: new Date().toISOString() },
      { companyId: 'c10', companyName: 'Everlane', categoryId: '3', amount: 95, date: new Date().toISOString() },
      // Streaming
      { companyId: 'c16', companyName: 'Netflix', categoryId: '5', amount: 45, date: new Date().toISOString() },
      { companyId: 'c17', companyName: 'Spotify', categoryId: '5', amount: 30, date: new Date().toISOString() },
      // Restaurants
      { companyId: 'c19', companyName: 'Chipotle', categoryId: '7', amount: 125, date: new Date().toISOString() },
      { companyId: 'c701', companyName: 'Panera Bread', categoryId: '7', amount: 90, date: new Date().toISOString() },
    ];

    // Add stores to categories
    setCategories(prevCategories =>
      prevCategories.map(cat => {
        const storesForCategory = initialSpending
          .filter(s => s.categoryId === cat.id)
          .map(s => s.companyId)
          .slice(0, 3);
        return storesForCategory.length > 0 
          ? { ...cat, userStores: storesForCategory }
          : cat;
      })
    );
    
    // Create notifications for companies user has spent on
    const initialNotifications = [
      {
        id: 'n1',
        companyName: 'Whole Foods',
        oldScore: 82,
        newScore: 85,
        trend: 'up' as const,
        reason: 'Increased commitment to sustainable farming and worker benefits',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        newsUrl: 'https://www.npr.org/2024/10/15/whole-foods-sustainability-commitment'
      },
      {
        id: 'n2',
        companyName: 'Costco',
        oldScore: 73,
        newScore: 75,
        trend: 'up' as const,
        reason: 'Announced 1M donation to voting rights advocacy groups',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        newsUrl: 'https://www.reuters.com/business/costco-voting-rights-donation-2024'
      },
      {
        id: 'n3',
        companyName: 'Netflix',
        oldScore: 68,
        newScore: 65,
        trend: 'down' as const,
        reason: 'CEO made controversial political donations to anti-climate PACs',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        newsUrl: 'https://www.theguardian.com/technology/netflix-political-donations-controversy'
      },
      {
        id: 'n4',
        companyName: 'Patagonia',
        oldScore: 88,
        newScore: 92,
        trend: 'up' as const,
        reason: 'Pledged 1% of all sales to grassroots environmental organizations',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        newsUrl: 'https://www.bbc.com/news/patagonia-environmental-pledge-2024'
      }
    ];

    setUser({
      id: 'user1',
      name: userData.name,
      email: userData.email,
      isGuest: false,
      overallScore: 72,
      categoryScores: {},
      userSpending: initialSpending,
      notifications: initialNotifications,
      categoryOrder,
      categoryVisibility,
      whiteLabelSettings: {
        appName: 'VoteWallet',
        color: '#14b8a6',
        mantra: 'Shop your politics. Spend your values.'
      },
      maxStoresPerCategory: 3
    });
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowAuth(true);
    setCurrentPage('home');
  };

  const handleAddStore = (categoryId: string, storeId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id === categoryId) {
          const userStores = cat.userStores || [];
          const maxStores = user?.maxStoresPerCategory || 3;
          if (!userStores.includes(storeId) && userStores.length < maxStores) {
            const company = cat.companies.find(c => c.id === storeId);
            if (company && user) {
              const randomAmount = Math.floor(Math.random() * 200) + 50;
              const newSpending: UserSpending = {
                companyId: storeId,
                companyName: company.name,
                categoryId: categoryId,
                amount: randomAmount,
                date: new Date().toISOString()
              };
              setUser(prevUser => prevUser ? {
                ...prevUser,
                userSpending: [...prevUser.userSpending, newSpending]
              } : null);
            }
            return { ...cat, userStores: [...userStores, storeId] };
          }
        }
        return cat;
      })
    );
  };

  const handleRemoveStore = (categoryId: string, storeId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id === categoryId) {
          const userStores = cat.userStores || [];
          return { ...cat, userStores: userStores.filter(id => id !== storeId) };
        }
        return cat;
      })
    );
  };

  const handleUpdateCategoryOrder = (newOrder: string[]) => {
    if (user) {
      setUser({ ...user, categoryOrder: newOrder });
    }
  };

  const handleToggleCategoryVisibility = (categoryId: string) => {
    if (user) {
      setUser({
        ...user,
        categoryVisibility: {
          ...user.categoryVisibility,
          [categoryId]: !user.categoryVisibility[categoryId]
        }
      });
    }
  };

  const handleSaveWhiteLabel = (settings: { appName: string; color: string; mantra: string; logo?: string }) => {
    if (user) {
      setUser({
        ...user,
        whiteLabelSettings: settings
      });
    }
  };

  const handleUpdateMaxStores = (maxStores: number) => {
    if (user) {
      setUser({
        ...user,
        maxStoresPerCategory: maxStores
      });
    }
  };

  const handleRequestShop = (request: { companyName: string; category: string; website?: string; reason: string }) => {
    console.log('Company request submitted:', request);
    setShowRequestModal(false);
    toast({
      title: "Request submitted!",
      description: "Thank you for your suggestion. We'll review it and add the company to our database soon.",
    });
  };

  const allCompanies = categories.flatMap(cat => cat.companies);

  const renderPage = () => {
    if (selectedCategory) {
      return (
        <CategoryDetailPage
          category={selectedCategory}
          user={user}
          onBack={() => setSelectedCategory(null)}
          onCompanySelect={setSelectedCompany}
          onLogin={() => setShowAuth(true)}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            user={user}
            categories={categories}
            onCompanySelect={setSelectedCompany}
            onCategorySelect={(category) => {
              setInitialExpandedCategoryId(category.id);
              setCurrentPage('browse');
            }}
            onToggleCategoryVisibility={handleToggleCategoryVisibility}
            onLogout={handleLogout}
          />
        );
      case 'browse':
        return (
          <BrowsePage
            categories={categories}
            user={user}
            onCompanySelect={setSelectedCompany}
            onAddStore={handleAddStore}
            onRemoveStore={handleRemoveStore}
            onUpdateCategoryOrder={handleUpdateCategoryOrder}
            onRequestShop={() => setShowRequestModal(true)}
            initialExpandedCategoryId={initialExpandedCategoryId}
            onClearInitialExpanded={() => setInitialExpandedCategoryId(null)}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            user={user}
            onSaveWhiteLabel={handleSaveWhiteLabel}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={user}
            categories={categories}
            onLogin={() => setShowAuth(true)}
            onLogout={handleLogout}
            onCompanySelect={setSelectedCompany}
            onCategorySelect={setSelectedCategory}
            onSaveWhiteLabel={handleSaveWhiteLabel}
            onUpdateMaxStores={handleUpdateMaxStores}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {renderPage()}
      
      <BottomNavigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {showAuth && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}

      {selectedCompany && (
        <CompanyDetail
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          allCompanies={allCompanies}
          onCompanySelect={setSelectedCompany}
          userStores={categories.find(c => c.id === selectedCompany.category)?.userStores || []}
          categoryId={selectedCompany.category}
          onAddStore={handleAddStore}
          onRemoveStore={handleRemoveStore}
          maxStoresPerCategory={user?.maxStoresPerCategory || 3}
        />
      )}

      {showRequestModal && (
        <RequestCompanyModal
          categories={categories}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestShop}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
