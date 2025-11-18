import { X, ExternalLink, DollarSign, Scale, MessageSquare, ArrowRight, AlertTriangle, Check, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import type { Company } from '@shared/schema';

interface CompanyDetailProps {
  company: Company;
  onClose: () => void;
  allCompanies: Company[];
  onCompanySelect: (company: Company) => void;
  userStores?: string[];
  categoryId?: string;
  onAddStore?: (categoryId: string, storeId: string) => void;
  onRemoveStore?: (categoryId: string, storeId: string) => void;
  maxStoresPerCategory?: number;
}

export function CompanyDetail({ company, onClose, allCompanies, onCompanySelect, userStores = [], categoryId, onAddStore, onRemoveStore, maxStoresPerCategory = 3 }: CompanyDetailProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'from-emerald-500 to-teal-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-red-600';
  };

  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'support':
        return (
          <Badge className="bg-emerald-500 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            <Check className="w-3 h-3 mr-1" />
            Support
          </Badge>
        );
      case 'boycott':
        return (
          <Badge className="bg-rose-500 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Avoid
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-400 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            Neutral
          </Badge>
        );
    }
  };

  const getPoliticalLeanBadge = (lean?: Company['politicalLean']) => {
    if (!lean) return null;
    
    switch (lean) {
      case 'progressive':
        return (
          <Badge className="bg-blue-500 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            Progressive
          </Badge>
        );
      case 'conservative':
        return (
          <Badge className="bg-red-500 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            Conservative
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-400 text-white border-0 rounded-xl px-3 py-1 font-heading text-xs uppercase tracking-wide">
            Neutral
          </Badge>
        );
    }
  };

  const alternatives = allCompanies
    .filter(c => c.category === company.category && c.id !== company.id && c.score > company.score)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const isUserStore = userStores.includes(company.id);
  const canAddMore = userStores.length < maxStoresPerCategory;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="bg-white rounded-2xl max-w-2xl mx-auto overflow-hidden shadow-xl">
          <div className="relative gradient-data p-8">
            <button
              onClick={onClose}
              data-testid="button-close"
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all hover-elevate active-elevate-2"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${company.score >= 70 ? 'from-emerald-400 to-teal-400' : company.score >= 40 ? 'from-amber-400 to-orange-400' : 'from-rose-400 to-orange-400'} rounded-2xl flex items-center justify-center shadow-card`}>
                <span className="text-4xl font-heading font-bold text-white">{company.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-heading font-bold text-white" data-testid="text-company-name">{company.name}</h2>
                <p className="text-sm font-body text-white/90 mb-3">{company.description}</p>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(company.status)}
                  {getPoliticalLeanBadge(company.politicalLean)}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <p className="text-xs font-heading uppercase tracking-wide text-white/80 mb-3">Impact Score</p>
              <div className="flex items-center gap-4 mb-3">
                <div className={`text-5xl font-heading font-black text-white`} data-testid="text-company-score">
                  {company.score}
                </div>
                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreGradient(company.score)} rounded-full transition-all`}
                    style={{ width: `${company.score}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs font-body text-white/90">
                {company.score >= 70 ? 'Strong alignment with democratic values' : 
                 company.score >= 40 ? 'Mixed record on democratic values' : 
                 'Significant concerns about democratic values'}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex gap-3">
              {company.website && (
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 rounded-2xl border-slate-300 hover:bg-slate-50 font-heading text-sm uppercase tracking-wide"
                  onClick={() => window.open(company.website, '_blank')}
                  data-testid="button-visit-website"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </Button>
              )}
              {categoryId && onAddStore && onRemoveStore && (
                isUserStore ? (
                  <Button 
                    variant="outline" 
                    className="gap-2 rounded-2xl border-rose-300 text-rose-600 hover:bg-rose-50 font-heading text-sm uppercase tracking-wide"
                    onClick={() => onRemoveStore(categoryId, company.id)}
                    data-testid="button-remove-store-detail"
                  >
                    <Minus className="w-4 h-4" />
                    Remove
                  </Button>
                ) : (
                  <div className="relative group/tooltip">
                    <Button 
                      variant="outline" 
                      className="gap-2 rounded-2xl border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed font-heading text-sm uppercase tracking-wide"
                      onClick={() => onAddStore(categoryId, company.id)}
                      disabled={!canAddMore}
                      data-testid="button-add-store-detail"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                    {!canAddMore && (
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tooltip:block z-50 w-48">
                        <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg font-body">
                          You already have your top {maxStoresPerCategory} for this category. Remove one to add a new one.
                          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <Separator className="bg-slate-100" />

            {/* Political Donations Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-900">Political Donations</h3>
                  <p className="text-xs font-body text-slate-600">Campaign contributions and PAC funding</p>
                </div>
              </div>
              
              {!company.politicalInfo.donations.available ? (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl" data-testid="text-no-donation-data">
                  No political donation data available.
                </p>
              ) : (
                <div className="space-y-4">
                  {/* PAC Name */}
                  {company.politicalInfo.donations.pacName && (
                    <Card className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-blue-50 to-transparent">
                      <p className="text-xs font-heading uppercase tracking-wide text-slate-600 mb-1">Corporate PAC</p>
                      <p className="text-sm font-semibold text-slate-900" data-testid="text-pac-name">
                        {company.politicalInfo.donations.pacName}
                      </p>
                    </Card>
                  )}

                  {/* Total Donations */}
                  {company.politicalInfo.donations.totalDonations !== undefined && (
                    <Card className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-transparent">
                      <p className="text-xs font-heading uppercase tracking-wide text-slate-600 mb-1">Total Political Contributions</p>
                      <p className="text-lg font-bold text-slate-900" data-testid="text-total-donations">
                        ${(company.politicalInfo.donations.totalDonations / 1000).toFixed(0)}K (2023–2024)
                      </p>
                      {company.politicalInfo.donations.lastDonationDate && (
                        <p className="text-xs text-slate-600 mt-2" data-testid="text-last-donation">
                          Last political activity: {new Date(company.politicalInfo.donations.lastDonationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </Card>
                  )}

                  {/* Party Breakdown */}
                  {company.politicalInfo.donations.partyBreakdown && company.politicalInfo.donations.partyBreakdown.length > 0 && (
                    <Card className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-transparent">
                      <p className="text-xs font-heading uppercase tracking-wide text-slate-600 mb-3">Party Distribution</p>
                      {(() => {
                        const total = company.politicalInfo.donations.partyBreakdown!.reduce((sum, p) => sum + p.amount, 0);
                        const demData = company.politicalInfo.donations.partyBreakdown!.find(p => p.party === 'Democratic');
                        const repData = company.politicalInfo.donations.partyBreakdown!.find(p => p.party === 'Republican');
                        const demPercent = demData ? Math.round((demData.amount / total) * 100) : 0;
                        const repPercent = repData ? Math.round((repData.amount / total) * 100) : 0;
                        
                        return (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-700" data-testid="text-party-breakdown">
                                {demPercent}% Democratic / {repPercent}% Republican
                              </span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                              {demData && (
                                <div 
                                  className="bg-blue-500 h-full"
                                  style={{ width: `${demPercent}%` }}
                                  data-testid="bar-democratic"
                                ></div>
                              )}
                              {repData && (
                                <div 
                                  className="bg-red-500 h-full"
                                  style={{ width: `${repPercent}%` }}
                                  data-testid="bar-republican"
                                ></div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </Card>
                  )}

                  {/* Top Recipients */}
                  {company.politicalInfo.donations.topRecipients && company.politicalInfo.donations.topRecipients.length > 0 && (
                    <Card className="p-4 border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-transparent">
                      <p className="text-xs font-heading uppercase tracking-wide text-slate-600 mb-3">Top Recipients</p>
                      <div className="space-y-2">
                        {company.politicalInfo.donations.topRecipients.map((recipient, index) => (
                          <div key={index} className="flex items-center justify-between" data-testid={`item-recipient-${index}`}>
                            <span className="text-sm text-slate-700">{recipient.name}</span>
                            <Badge variant="outline" className="text-xs border-slate-200 text-slate-600 rounded-full">
                              ${(recipient.amount / 1000).toFixed(0)}K
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Source */}
                  {company.politicalInfo.donations.source && (
                    <p className="text-xs text-slate-500 italic" data-testid="text-donation-source">
                      Source: {company.politicalInfo.donations.source}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-slate-100" />

            {/* Lobbying Activities Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shadow-sm">
                  <Scale className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-900">Lobbying Activities</h3>
                  <p className="text-xs font-body text-slate-600">Legislative influence and advocacy</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl" data-testid="text-no-lobbying-data">
                No lobbying data available.
              </p>
            </div>

            <Separator className="bg-slate-100" />

            {/* Public Statements & Actions Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-semibold text-slate-900">Public Statements & Actions</h3>
                  <p className="text-xs font-body text-slate-600">Corporate positions and initiatives</p>
                </div>
              </div>
              
              {!company.politicalInfo.statements.available || !company.politicalInfo.statements.tags || company.politicalInfo.statements.tags.length === 0 ? (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl" data-testid="text-no-statement-data">
                  No statement data available.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {company.politicalInfo.statements.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      className="bg-emerald-100 text-emerald-800 border-emerald-200 rounded-full px-3 py-1.5 font-body text-xs"
                      data-testid={`badge-statement-${index}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {company.score < 50 && alternatives.length > 0 && (
              <>
                <Separator className="bg-slate-100" />
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center shadow-sm">
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-slate-900">Better Alternatives</h3>
                      <p className="text-xs font-body text-slate-600">Higher-scoring brands in this category</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {alternatives.map((alt) => (
                        <Card 
                          key={alt.id} 
                          className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover-elevate active-elevate-2"
                          onClick={() => onCompanySelect(alt)}
                          data-testid={`card-alternative-${alt.id}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-slate-900">{alt.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-emerald-600 text-white border-0 text-xs rounded-full">
                                {alt.score}
                              </Badge>
                              <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                          <p className="text-xs text-slate-600">{alt.description}</p>
                        </Card>
                      ))}
                  </div>
                </div>
              </>
            )}

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200 rounded-xl">
              <p className="text-xs text-slate-700" data-testid="text-data-sources">
                <strong className="text-slate-900">Data sources:</strong> Federal Election Commission (FEC) API for political donations, verified corporate statements, and news data. Campaign finance data tracks PAC contributions, recipient candidates, and party affiliations. Last updated: Oct 2024.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
