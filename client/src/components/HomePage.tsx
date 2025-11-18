import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Sparkles,
  Bell,
  Eye,
  EyeOff,
  ExternalLink,
  DollarSign,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { AppUser, Category, Company } from "@shared/schema";
import { useState } from "react";

interface HomePageProps {
  user: AppUser | null;
  categories: Category[];
  onCompanySelect: (company: Company) => void;
  onCategorySelect: (category: Category) => void;
  onToggleCategoryVisibility: (categoryId: string) => void;
  onLogout?: () => void;
}

export function HomePage({
  user,
  categories,
  onCompanySelect,
  onCategorySelect,
  onToggleCategoryVisibility,
  onLogout,
}: HomePageProps) {
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [showHiddenCategories, setShowHiddenCategories] = useState(false);
  const allCompanies = categories.flatMap((cat) => cat.companies);
  const topCompanies = [...allCompanies]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-600";
    if (score >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return "from-emerald-500 to-teal-500";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-red-600";
  };

  const orderedCategories = user?.categoryOrder
    ? (user.categoryOrder
        .map((id) => categories.find((c) => c.id === id))
        .filter(Boolean) as Category[])
    : categories;

  const visibleCategories = orderedCategories.filter(
    (cat) => !user || user.categoryVisibility[cat.id] !== false,
  );

  const hiddenCategories = orderedCategories.filter(
    (cat) => user && user.categoryVisibility[cat.id] === false,
  );

  const notificationsToShow = showAllNotifications
    ? user?.notifications || []
    : (user?.notifications || []).slice(0, 2);

  const brandColor = user?.whiteLabelSettings.color || "#14b8a6";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="gradient-data px-6 pt-16 pb-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {onLogout && (
          <button
            onClick={onLogout}
            data-testid="button-logout-home"
            className="absolute top-6 right-6 z-20 p-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10 max-w-4xl mx-auto">
          {user?.whiteLabelSettings.logo && (
            <img
              src={user.whiteLabelSettings.logo}
              alt="Logo"
              className="w-16 h-16 object-contain mb-8"
            />
          )}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <p className="text-sm font-body text-white/90 uppercase tracking-wide">
                {user?.whiteLabelSettings.appName || "Empowered Insight"}
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-black tracking-tight mb-4">
              Buy with Power.
              <br />
              Back it with Data.
            </h1>
            <p className="text-lg font-body text-white/90 max-w-2xl">
              {user?.whiteLabelSettings.mantra ||
                "Discover how brands treat people and the planet. Make every purchase a vote for change."}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8 -mt-6 relative z-10">
        {user && (
          <Card
            data-testid="card-user-score"
            className="gradient-card border-0 shadow-soft rounded-3xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm font-body text-slate-600 mb-1">
                    Your Overall Score
                  </p>
                  <h2 className="text-xl font-heading font-semibold text-slate-900">
                    Democracy Index
                  </h2>
                </div>
                <div
                  className={`text-5xl font-heading font-bold ${getScoreColor(user.overallScore)}`}
                  data-testid="text-overall-score"
                >
                  {user.overallScore}
                </div>
              </div>

              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(user.overallScore)} transition-all duration-500 rounded-full`}
                  style={{ width: `${user.overallScore}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Categories</p>
                  <p className="text-lg text-slate-900">
                    {Object.keys(user.categoryScores).length}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Stores</p>
                  <p className="text-lg text-slate-900">
                    {new Set(user.userSpending.map((s) => s.companyId)).size}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="text-xs text-slate-600 mb-1">Impact</p>
                  <div className="flex items-center justify-center gap-1">
                    {user.overallScore >= 70 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                    <p className="text-lg text-slate-900">
                      {user.overallScore >= 70
                        ? "High"
                        : user.overallScore >= 40
                          ? "Med"
                          : "Low"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {user && user.notifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-rose-600" />
                <h3 className="text-lg font-heading font-semibold text-slate-900">
                  Notifications
                </h3>
              </div>
              <Badge className="bg-rose-100 text-rose-700 border-0 rounded-xl px-3 py-1 font-body">
                {user.notifications.length} new
              </Badge>
            </div>

            <div className="space-y-3">
              {notificationsToShow.map((notification) => (
                <Card
                  key={notification.id}
                  data-testid={`card-notification-${notification.id}`}
                  className={`p-4 border-0 rounded-2xl shadow-soft ${
                    notification.trend === "up"
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50"
                      : "bg-gradient-to-r from-rose-50 to-orange-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        notification.trend === "up"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    >
                      {notification.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-white" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900">
                          {notification.companyName}
                        </h4>
                        <Badge
                          className={`text-xs border-0 ${
                            notification.trend === "up"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {notification.oldScore} → {notification.newScore}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        {notification.reason}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                        {notification.newsUrl && (
                          <a
                            href={notification.newsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`link-news-${notification.id}`}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Read source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {user.notifications.length > 2 && (
                <Button
                  variant="ghost"
                  onClick={() => setShowAllNotifications(!showAllNotifications)}
                  data-testid="button-toggle-notifications"
                  className="w-full text-sm text-slate-600 hover:text-slate-900"
                >
                  {showAllNotifications
                    ? "Show Less"
                    : `View ${user.notifications.length - 2} More Updates`}
                </Button>
              )}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-slate-900">
              Explore Categories
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-1 font-body text-xs"
              >
                {visibleCategories.length}/{categories.length} visible
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {visibleCategories.map((category) => {
              const userScore = user?.categoryScores[category.id];
              const hasScore = userScore !== undefined;
              const isVisible =
                !user || user.categoryVisibility[category.id] !== false;

              const avgScore =
                category.companies.length > 0
                  ? Math.round(
                      category.companies.reduce((sum, c) => sum + c.score, 0) /
                        category.companies.length,
                    )
                  : 0;

              return (
                <Card
                  key={category.id}
                  data-testid={`card-category-${category.id}`}
                  className="p-4 border-slate-200 bg-white rounded-2xl relative group"
                >
                  <div
                    onClick={() => onCategorySelect(category)}
                    className="flex flex-col h-full cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <div className="relative flex items-center justify-end min-w-[32px]">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${getScoreColor(avgScore)} bg-slate-50 opacity-100 group-hover:opacity-0 transition-opacity`}
                        >
                          {avgScore}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleCategoryVisibility(category.id);
                          }}
                          data-testid={`button-toggle-visibility-${category.id}`}
                          className="absolute top-1/2 -translate-y-1/2 right-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-slate-50"
                        >
                          {isVisible ? (
                            <Eye className="w-3 h-3 text-slate-600" />
                          ) : (
                            <EyeOff className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-heading font-semibold text-slate-900 mb-1">
                      {category.name}
                    </h4>
                    <p className="text-xs font-body text-slate-600">
                      {category.companies.length} brands ranked by impact
                    </p>
                    <div className="mt-3 flex items-center text-xs font-heading uppercase tracking-wide text-rose-600 group-hover:text-rose-700">
                      <span>View Details</span>
                      <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {user && hiddenCategories.length > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowHiddenCategories(!showHiddenCategories)}
                data-testid="button-toggle-hidden-categories"
                className="w-full text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2"
              >
                <EyeOff className="w-4 h-4" />
                {showHiddenCategories ? "Hide" : "Show"}{" "}
                {hiddenCategories.length} Hidden{" "}
                {hiddenCategories.length === 1 ? "Category" : "Categories"}
              </Button>

              {showHiddenCategories && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {hiddenCategories.map((category) => (
                    <Card
                      key={category.id}
                      data-testid={`card-hidden-category-${category.id}`}
                      className="p-4 border-slate-200 bg-slate-50 rounded-2xl relative group opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCategoryVisibility(category.id);
                        }}
                        data-testid={`button-unhide-${category.id}`}
                        className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center z-10 hover:bg-emerald-50 hover:border-emerald-300 hover-elevate active-elevate-2"
                      >
                        <Eye className="w-4 h-4 text-emerald-600" />
                      </button>

                      <div
                        onClick={() => {
                          onToggleCategoryVisibility(category.id);
                          onCategorySelect(category);
                        }}
                        className="flex flex-col h-full cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-2xl mb-3">
                          {category.icon}
                        </div>
                        <h4 className="text-sm text-slate-700 mb-1">
                          {category.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {category.companies.length} companies
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-heading font-semibold text-slate-900">
              Top Rated Brands
            </h3>
          </div>

          <div className="space-y-3">
            {topCompanies.map((company, index) => (
              <Card
                key={company.id}
                onClick={() => onCompanySelect(company)}
                data-testid={`card-top-company-${company.id}`}
                className="p-4 hover:shadow-medium transition-all cursor-pointer border-slate-200 bg-white rounded-2xl hover-elevate active-elevate-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <span className="text-lg">{company.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900 truncate">
                          {company.name}
                        </h4>
                        {index === 0 && (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs px-2 py-0">
                            #1
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {company.description}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`ml-3 px-3 py-1.5 rounded-full ${getScoreColor(company.score)} bg-emerald-50`}
                  >
                    <span className="text-sm">{company.score}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
