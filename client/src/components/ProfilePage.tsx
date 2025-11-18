import { useState } from 'react';
import { TrendingUp, Award, DollarSign, Smartphone, Palette, HelpCircle, ChevronRight, Save, Upload, X, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { AppUser, Category, Company } from '@shared/schema';

interface ProfilePageProps {
  user: AppUser | null;
  categories: Category[];
  onLogin: () => void;
  onLogout: () => void;
  onCompanySelect: (company: Company) => void;
  onCategorySelect?: (category: Category) => void;
  onSaveWhiteLabel: (settings: { appName: string; color: string; mantra: string; logo?: string }) => void;
  onUpdateMaxStores: (maxStores: number) => void;
}

export function ProfilePage({ user, categories, onLogin, onLogout, onCompanySelect, onCategorySelect, onSaveWhiteLabel, onUpdateMaxStores }: ProfilePageProps) {
  const [showWhiteLabelSettings, setShowWhiteLabelSettings] = useState(false);
  const [showMaxStoresSettings, setShowMaxStoresSettings] = useState(false);
  const [appName, setAppName] = useState(user?.whiteLabelSettings.appName || 'VoteWallet');
  const [color, setColor] = useState(user?.whiteLabelSettings.color || '#14b8a6');
  const [mantra, setMantra] = useState(user?.whiteLabelSettings.mantra || 'Shop your politics. Spend your values.');
  const [logo, setLogo] = useState(user?.whiteLabelSettings.logo || '');
  const [maxStores, setMaxStores] = useState(user?.maxStoresPerCategory || 3);

  const handleSaveWhiteLabel = () => {
    onSaveWhiteLabel({ appName, color, mantra, logo });
    setShowWhiteLabelSettings(false);
  };

  const handleSaveMaxStores = () => {
    onUpdateMaxStores(maxStores);
    setShowMaxStoresSettings(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = [
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
  ];

  if (!user || user.isGuest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">👤</span>
          </div>
          <h2 className="mb-2">Join White Label</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Create an account to track your democracy score and see how your spending aligns with your values
          </p>
          <Button 
            className="bg-teal-500 hover:bg-teal-600 text-white w-full rounded-xl"
            onClick={onLogin}
            data-testid="button-login"
          >
            Sign Up / Login
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-emerald-600';
    if (score >= 40) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-pink-600';
  };

  const spendingByCategory = user.userSpending.reduce((acc, spending) => {
    if (!acc[spending.categoryId]) {
      acc[spending.categoryId] = {
        totalAmount: 0,
        companies: new Set<string>()
      };
    }
    acc[spending.categoryId].totalAmount += spending.amount;
    acc[spending.categoryId].companies.add(spending.companyId);
    return acc;
  }, {} as Record<string, { totalAmount: number; companies: Set<string> }>);

  const totalSpending = user.userSpending.reduce((sum, s) => sum + s.amount, 0);
  const uniqueCompanies = new Set(user.userSpending.map(s => s.companyId)).size;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white px-4 py-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 data-testid="text-user-name">{user.name}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <Card className={`p-6 bg-gradient-to-br ${getScoreGradient(user.overallScore)} text-white overflow-hidden relative`} data-testid="card-overall-score">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Your Democracy Score</p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-white">{user.overallScore}</h1>
                  <span className="text-white/80">/100</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm text-white/90">
              Living your democracy values
            </p>
            <p className="text-xs text-white/70 mt-1">
              Based on your spending patterns and company alignments
            </p>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -left-4 top-0 w-24 h-24 bg-white/10 rounded-full"></div>
        </Card>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div>
          <h3 className="mb-4">Your Impact</h3>
          <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Companies Tracked</span>
              <span data-testid="text-companies-tracked">{uniqueCompanies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Categories Engaged</span>
              <span data-testid="text-categories-engaged">
                {Object.keys(spendingByCategory).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Avg. Company Score</span>
              <span className={getScoreColor(user.overallScore)} data-testid="text-avg-score">
                {user.overallScore}/100
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Values Alignment</span>
              <span className={user.overallScore >= 70 ? 'text-emerald-600' : user.overallScore >= 40 ? 'text-amber-600' : 'text-rose-600'} data-testid="text-alignment">
                {user.overallScore >= 70 ? 'Strong' : user.overallScore >= 40 ? 'Moderate' : 'Developing'}
              </span>
            </div>
          </div>
        </Card>
        </div>

        <div>
          <h3 className="mb-4 font-heading font-semibold">Settings</h3>
          <Card className="divide-y divide-slate-100 rounded-2xl overflow-hidden border-slate-200">
            <button
              onClick={() => setShowMaxStoresSettings(true)}
              data-testid="button-max-stores-settings"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left hover-elevate active-elevate-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-sm font-body text-slate-900">Store Tracking Limit</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <button
              onClick={() => setShowWhiteLabelSettings(true)}
              data-testid="button-white-label-settings"
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left hover-elevate active-elevate-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm font-body text-slate-900">White Label Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </Card>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            onLogout();
            onLogin();
          }}
          data-testid="button-logout"
          className="w-full text-rose-600 border-rose-300 hover:bg-rose-50 hover:border-rose-400 rounded-xl"
        >
          Sign Out
        </Button>
      </div>

      {showMaxStoresSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <Card className="bg-white rounded-2xl max-w-md mx-auto p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-slate-900">Store Tracking Limit</h2>
                <button
                  onClick={() => setShowMaxStoresSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxStores" className="font-body">Maximum stores per category</Label>
                  <p className="text-xs text-slate-600 mb-2">Choose how many stores you want to track per category</p>
                  <Input
                    id="maxStores"
                    type="number"
                    min="1"
                    max="10"
                    value={maxStores}
                    onChange={(e) => setMaxStores(parseInt(e.target.value) || 1)}
                    className="rounded-xl"
                  />
                </div>
                
                <Button
                  onClick={handleSaveMaxStores}
                  className="w-full gradient-cta rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {showWhiteLabelSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <Card className="bg-white rounded-2xl max-w-md mx-auto p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-slate-900">White Label Settings</h2>
                <button
                  onClick={() => setShowWhiteLabelSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appName" className="font-body">App Name</Label>
                  <Input
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Enter app name"
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="mantra" className="font-body">Tagline</Label>
                  <Textarea
                    id="mantra"
                    value={mantra}
                    onChange={(e) => setMantra(e.target.value)}
                    placeholder="Enter your tagline"
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className="font-body">Brand Color</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {colors.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`w-full h-10 rounded-xl transition-all ${
                          color === c.value ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="logo-upload" className="font-body">Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {logo && (
                      <div className="relative">
                        <img src={logo} alt="Logo preview" className="w-16 h-16 rounded-xl object-cover" />
                        <button
                          onClick={() => setLogo('')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <label
                      htmlFor="logo-upload"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-slate-400 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-600">Upload Logo</span>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Separator />

                <Button
                  onClick={handleSaveWhiteLabel}
                  className="w-full gradient-cta rounded-xl"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
