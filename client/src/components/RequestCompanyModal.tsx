import { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Category } from "@shared/schema";

interface RequestCompanyModalProps {
  categories: Category[];
  onClose: () => void;
  onSubmit: (request: {
    companyName: string;
    category: string;
    website?: string;
    reason: string;
  }) => void;
}

export function RequestCompanyModal({
  categories,
  onClose,
  onSubmit,
}: RequestCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [website, setWebsite] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      companyName,
      category,
      website,
      reason,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <Send className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="mb-2">Request Submitted!</h2>
          <p className="text-sm text-slate-600">
            Thank you for your suggestion. We'll review it and add the company
            to our database soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        {/* ✅ Move the button OUTSIDE the padding or adjust position */}
        <button
          onClick={onClose}
          data-testid="button-close"
          className="absolute -top-3 -right-3 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 hover-elevate active-elevate-2 z-50 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="mb-2">Request a Company</h2>
        <p className="text-sm text-slate-600 mb-6">
          Don't see a company you're looking for? Let us know and we'll add it
          to our database.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Target, Whole Foods"
              data-testid="input-company-name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1" data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">
                  Other (please specify in reason)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              data-testid="input-website"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="reason">Why should we add this company? *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why this company is important to include..."
              data-testid="textarea-reason"
              required
              className="mt-1 min-h-24"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="button-submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
