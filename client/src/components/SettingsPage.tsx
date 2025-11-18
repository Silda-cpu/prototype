import { useState } from 'react';
import { User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Palette, Type, Save, Upload, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import type { AppUser } from '@shared/schema';

interface SettingsPageProps {
  user: AppUser | null;
  onSaveWhiteLabel: (settings: { appName: string; color: string; mantra: string; logo?: string }) => void;
}

export function SettingsPage({ user, onSaveWhiteLabel }: SettingsPageProps) {
  const [appName, setAppName] = useState(user?.whiteLabelSettings.appName || 'White Label');
  const [color, setColor] = useState(user?.whiteLabelSettings.color || '#14b8a6');
  const [mantra, setMantra] = useState(user?.whiteLabelSettings.mantra || 'Shop your politics. Spend your values.');
  const [logo, setLogo] = useState(user?.whiteLabelSettings.logo || '');
  const [showWhiteLabelSettings, setShowWhiteLabelSettings] = useState(false);
  const [showHelpFaq, setShowHelpFaq] = useState(false);

  const handleSave = () => {
    onSaveWhiteLabel({ appName, color, mantra, logo });
    setShowWhiteLabelSettings(false);
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

  const settingsGroups = [
    {
      title: 'Customization',
      items: [
        { icon: Palette, label: 'White Label Settings', action: () => setShowWhiteLabelSettings(true) },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: () => setShowHelpFaq(true) },
      ]
    }
  ];

  if (showHelpFaq) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
        <div className="bg-white px-6 py-8 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelpFaq(false)}
              data-testid="button-back-help"
              className="p-2 rounded-xl"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-slate-900">Help & FAQ</h1>
              <p className="text-sm text-slate-600">Common questions and support</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-6">
          <Card className="p-6 rounded-2xl border-slate-200">
            <h3 className="text-slate-900 mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-slate-900 mb-2">How do I add stores to track?</h4>
                <p className="text-sm text-slate-600">
                  Go to the Browse page, expand a category, and click the "+" button next to any store. 
                  You can add up to 3 stores per category to track your spending.
                </p>
              </div>
              <div>
                <h4 className="text-sm text-slate-900 mb-2">What do the scores mean?</h4>
                <p className="text-sm text-slate-600">
                  Scores (0-100) reflect how companies align with democratic values based on political donations, 
                  lobbying activities, and public statements. Higher scores indicate stronger democratic alignment.
                </p>
              </div>
              <div>
                <h4 className="text-sm text-slate-900 mb-2">How do I hide categories?</h4>
                <p className="text-sm text-slate-600">
                  On the Home page, hover over any category card and click the eye icon that appears. 
                  Hidden categories won't appear in Browse but can be shown again anytime.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200">
            <h3 className="text-slate-900 mb-4">Customization</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-slate-900 mb-2">Can I customize the app branding?</h4>
                <p className="text-sm text-slate-600">
                  Yes! Go to Settings → White Label Settings to customize the app name, tagline, 
                  colors, and upload your own logo.
                </p>
              </div>
              <div>
                <h4 className="text-sm text-slate-900 mb-2">Can I request stores not in the database?</h4>
                <p className="text-sm text-slate-600">
                  Absolutely! Click the "Request Shop" button on the Browse page to submit a request 
                  for any store you'd like us to add.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200">
            <h3 className="text-slate-900 mb-4">Contact & Support</h3>
            <p className="text-sm text-slate-600 mb-4">
              Need more help? Have feedback or suggestions?
            </p>
            <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (showWhiteLabelSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
        <div className="bg-white px-6 py-8 border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWhiteLabelSettings(false)}
              data-testid="button-back-settings"
              className="p-2 rounded-xl"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Button>
            <div>
              <h1 className="text-slate-900">White Label Settings</h1>
              <p className="text-sm text-slate-600">Customize your app experience</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 space-y-6">
          <Card className="p-6 rounded-2xl border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-slate-900">App Branding</h3>
                <p className="text-xs text-slate-500">Customize your app's name and tagline</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="appName">App Name</Label>
                <Input
                  id="appName"
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  data-testid="input-app-name"
                  className="mt-1 rounded-xl"
                  placeholder="e.g., White Label, ValueVote, etc."
                />
              </div>

              <div>
                <Label htmlFor="mantra">App Tagline</Label>
                <Textarea
                  id="mantra"
                  value={mantra}
                  onChange={(e) => setMantra(e.target.value)}
                  data-testid="textarea-mantra"
                  className="mt-1 rounded-xl min-h-20"
                  placeholder="Your app's mission statement or tagline"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-slate-900">App Logo</h3>
                <p className="text-xs text-slate-500">Upload your custom logo</p>
              </div>
            </div>

            <div className="space-y-4">
              {logo && (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={logo}
                    alt="App logo"
                    className="w-full h-full object-contain rounded-xl border border-slate-200"
                  />
                  <button
                    onClick={() => setLogo('')}
                    data-testid="button-remove-logo"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 shadow-soft"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div>
                <Label htmlFor="logo" className="cursor-pointer">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-500 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm text-slate-600 mb-1">Click to upload logo</p>
                    <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                  </div>
                </Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  data-testid="input-logo-upload"
                  className="hidden"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-slate-900">Brand Color</h3>
                <p className="text-xs text-slate-500">Choose your primary brand color</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  data-testid={`button-color-${c.name.toLowerCase()}`}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    color === c.value
                      ? 'border-slate-900 shadow-soft'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: c.value }}
                  ></div>
                  <p className="text-xs text-slate-600 text-center">{c.name}</p>
                </button>
              ))}
            </div>

            <div>
              <Label htmlFor="customColor">Custom Color</Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="customColor"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  data-testid="input-custom-color"
                  className="w-20 h-10 rounded-xl cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 rounded-xl"
                  placeholder="#14b8a6"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-slate-200">
            <h3 className="text-slate-900 mb-4">Preview</h3>
            <div
              className="p-6 rounded-2xl text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, #3b82f6 100%)`
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                {logo && (
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="w-12 h-12 object-contain mb-3"
                  />
                )}
                <h2 className="text-2xl font-semibold mb-2 text-white">{appName}</h2>
                <p className="text-sm text-white/90">{mantra}</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            data-testid="button-save"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="bg-white px-6 py-8 border-b border-slate-200">
        <h1 className="mb-2 text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Manage your account and preferences
        </p>
      </div>

      <div className="px-6 py-8 space-y-6">
        {user && !user.isGuest && (
          <Card className="p-6 rounded-2xl border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900" data-testid="text-user-name">{user.name}</h3>
                <p className="text-sm text-slate-600" data-testid="text-user-email">{user.email}</p>
              </div>
            </div>
          </Card>
        )}

        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-slate-900 mb-3 px-1">{group.title}</h3>
            <Card className="divide-y divide-slate-100 rounded-2xl overflow-hidden border-slate-200">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.action}
                    data-testid={`button-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left hover-elevate active-elevate-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <span className="text-sm text-slate-900">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
