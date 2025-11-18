import { useState } from 'react';
import { Palette, Type, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { AppUser } from '@shared/schema';

interface WhiteLabelPageProps {
  user: AppUser | null;
  onSave: (settings: { appName: string; color: string; mantra: string }) => void;
}

export function WhiteLabelPage({ user, onSave }: WhiteLabelPageProps) {
  const [appName, setAppName] = useState(user?.whiteLabelSettings.appName || 'White Label');
  const [color, setColor] = useState(user?.whiteLabelSettings.color || '#14b8a6');
  const [mantra, setMantra] = useState(user?.whiteLabelSettings.mantra || 'Shop your politics. Spend your values.');

  const handleSave = () => {
    onSave({ appName, color, mantra });
  };

  const colors = [
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="bg-white px-6 py-8 border-b border-slate-200">
        <h1 className="mb-2 text-slate-900">White Label Settings</h1>
        <p className="text-sm text-slate-600">
          Customize the look and feel of your experience
        </p>
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
