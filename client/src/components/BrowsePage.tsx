import { useState, useEffect, useRef } from 'react';
import { GripVertical, Plus, Minus, Search, X, TrendingUp, DollarSign, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Category, Company, AppUser } from '@shared/schema';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BrowsePageProps {
  categories: Category[];
  user: AppUser | null;
  onCompanySelect: (company: Company) => void;
  onAddStore: (categoryId: string, storeId: string) => void;
  onRemoveStore: (categoryId: string, storeId: string) => void;
  onUpdateCategoryOrder: (newOrder: string[]) => void;
  onRequestShop: () => void;
  initialExpandedCategoryId?: string | null;
  onClearInitialExpanded?: () => void;
}

function SortableCategoryCard({
  category,
  user,
  onCompanySelect,
  onAddStore,
  onRemoveStore,
  isExpanded,
  onToggleExpand,
  globalSearch,
  onRefSet,
}: {
  category: Category;
  user: AppUser | null;
  onCompanySelect: (company: Company) => void;
  onAddStore: (categoryId: string, storeId: string) => void;
  onRemoveStore: (categoryId: string, storeId: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  globalSearch?: string;
  onRefSet?: (categoryId: string, node: HTMLDivElement | null) => void;
}) {
  const [categorySearch, setCategorySearch] = useState('');
  const { toast } = useToast();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 border-emerald-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const userStoresInCategory = category.userStores || [];
  
  // Get user stores sorted by score
  const userStoreCompanies = userStoresInCategory
    .map(storeId => category.companies.find(c => c.id === storeId))
    .filter(Boolean) as Company[];
  userStoreCompanies.sort((a, b) => b.score - a.score);

  const categoryScore = category.companies.length > 0
    ? Math.round(category.companies.reduce((sum, c) => sum + c.score, 0) / category.companies.length)
    : 0;

  // Use global search if available and no category-specific search
  const activeSearch = categorySearch.trim() || globalSearch?.trim() || '';
  
  const filteredCompanies = activeSearch
    ? category.companies.filter(company =>
        company.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        company.description?.toLowerCase().includes(activeSearch.toLowerCase())
      )
    : category.companies;

  // Sort filtered companies by score (high to low)
  const sortedCompanies = [...filteredCompanies].sort((a, b) => b.score - a.score);

  const isUserStore = (companyId: string) => {
    return userStoresInCategory.includes(companyId);
  };

  const maxStores = user?.maxStoresPerCategory || 3;
  
  const handleAddStore = (companyId: string) => {
    if (userStoresInCategory.length >= maxStores) {
      toast({
        title: "Maximum reached",
        description: `You already have your top ${maxStores} for this category`,
        variant: "destructive",
      });
      return;
    }
    onAddStore(category.id, companyId);
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (onRefSet) {
          onRefSet(category.id, node);
        }
      }}
      style={style}
    >
      <Card className="overflow-hidden border-slate-200 rounded-2xl shadow-md bg-white">
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            {...attributes}
            {...listeners}
            data-testid={`button-drag-${category.id}`}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded-xl transition-colors touch-none hover-elevate active-elevate-2"
          >
            <GripVertical className="w-5 h-5 text-slate-400" />
          </button>

          <div className="w-14 h-14 bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
            {category.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-heading font-semibold text-slate-900">{category.name}</h3>
              <Badge className={`text-xs border font-heading ${getScoreBgColor(categoryScore)} ${getScoreColor(categoryScore)}`}>
                {categoryScore}
              </Badge>
            </div>
            <p className="text-xs font-body text-slate-600">
              {userStoresInCategory.length}/{maxStores} tracked • {filteredCompanies.length} brands
            </p>
          </div>

          <button
            onClick={onToggleExpand}
            data-testid={`button-expand-${category.id}`}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors hover-elevate active-elevate-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {userStoreCompanies.length > 0 && (
            <div className="p-5 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-heading font-semibold text-rose-900 uppercase tracking-wide">Your Top {maxStores}</h4>
              </div>
              <div className="space-y-2">
                {userStoreCompanies.map((company, index) => (
                  <div
                    key={company.id}
                    data-testid={`card-user-store-${company.id}`}
                    className="flex items-center justify-between p-3 bg-white rounded-xl group shadow-sm"
                  >
                    <div 
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => onCompanySelect(company)}
                    >
                      <Badge className="bg-rose-600 text-white border-0 text-xs w-6 h-6 flex items-center justify-center p-0 shrink-0 font-heading">
                        {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-heading font-semibold text-slate-900 truncate">{company.name}</p>
                        <p className="text-xs font-body text-slate-600">Score: {company.score}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveStore(category.id, company.id);
                      }}
                      data-testid={`button-remove-top-${company.id}`}
                      className="w-8 h-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl ml-2 shrink-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder={`Search in ${category.name}...`}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                data-testid={`input-category-search-${category.id}`}
                className="pl-10 pr-10 h-10 rounded-xl border-slate-200 focus:border-teal-500 focus:ring-teal-500 text-sm font-body"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch('')}
                  data-testid={`button-clear-category-search-${category.id}`}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {sortedCompanies.length > 0 ? (
              sortedCompanies.map((company) => (
                <div
                  key={company.id}
                  data-testid={`item-company-${company.id}`}
                  className="p-4 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onCompanySelect(company)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-slate-900 truncate">{company.name}</h4>
                        {isUserStore(company.id) && (
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Added
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {company.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className={`px-3 py-1.5 rounded-full border ${getScoreBgColor(company.score)}`}>
                        <span className={`text-xs ${getScoreColor(company.score)}`}>
                          {company.score}
                        </span>
                      </div>

                      {isUserStore(company.id) ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemoveStore(category.id, company.id)}
                          data-testid={`button-remove-${company.id}`}
                          className="w-8 h-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="relative group/tooltip">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddStore(company.id)}
                            data-testid={`button-add-${company.id}`}
                            disabled={userStoresInCategory.length >= maxStores}
                            className="w-8 h-8 p-0 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          {userStoresInCategory.length >= maxStores && (
                            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tooltip:block z-50">
                              <div className="bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                                You already have your top {maxStores} for this category.<br />Remove one of the stores to add the new one.
                                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">No stores found</p>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
    </div>
  );
}

export function BrowsePage({
  categories,
  user,
  onCompanySelect,
  onAddStore,
  onRemoveStore,
  onUpdateCategoryOrder,
  onRequestShop,
  initialExpandedCategoryId,
  onClearInitialExpanded
}: BrowsePageProps) {
  const themeColor = user?.whiteLabelSettings.color || '#14b8a6';
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    if (initialExpandedCategoryId) {
      return new Set([initialExpandedCategoryId]);
    }
    return new Set([categories[0]?.id]);
  });
  const [globalCategorySearch, setGlobalCategorySearch] = useState('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll to the initially expanded category
  useEffect(() => {
    if (initialExpandedCategoryId && categoryRefs.current[initialExpandedCategoryId]) {
      // Longer delay to ensure the element is fully rendered and expanded
      setTimeout(() => {
        const element = categoryRefs.current[initialExpandedCategoryId];
        if (element) {
          // Get the element's position
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          // Account for sticky header (approximate height: 180px)
          const offset = 180;
          // Scroll to position with offset
          window.scrollTo({
            top: absoluteElementTop - offset,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [initialExpandedCategoryId]);

  // Clear the initial expanded category after it's been consumed
  useEffect(() => {
    if (initialExpandedCategoryId) {
      onClearInitialExpanded?.();
    }
  }, [initialExpandedCategoryId, onClearInitialExpanded]);

  // Filter categories based on visibility from home page
  const visibleCategories = categories.filter(cat => {
    if (!user?.categoryVisibility) return true;
    return user.categoryVisibility[cat.id] !== false;
  });

  // Filter by global category search (search both category names and store names)
  const searchFilteredCategories = globalCategorySearch.trim()
    ? visibleCategories.filter(cat => {
        const searchLower = globalCategorySearch.toLowerCase();
        const categoryNameMatches = cat.name.toLowerCase().includes(searchLower);
        const storeNameMatches = cat.companies.some(company =>
          company.name.toLowerCase().includes(searchLower) ||
          company.description?.toLowerCase().includes(searchLower)
        );
        return categoryNameMatches || storeNameMatches;
      })
    : visibleCategories;

  const orderedCategoryIds = user?.categoryOrder || searchFilteredCategories.map(c => c.id);
  const orderedCategories = orderedCategoryIds
    .map(id => searchFilteredCategories.find(c => c.id === id))
    .filter(Boolean) as Category[];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedCategoryIds.indexOf(active.id as string);
      const newIndex = orderedCategoryIds.indexOf(over.id as string);
      const newOrder = arrayMove(orderedCategoryIds, oldIndex, newIndex);
      onUpdateCategoryOrder(newOrder);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(orderedCategoryIds));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white px-6 py-6 border-b border-slate-200 sticky top-0 z-10 shadow-md space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h1 className="mb-2 text-2xl font-heading font-bold text-slate-900">Explore Categories</h1>
            <p className="text-sm font-body text-slate-600">
              Track brands by impact • Customize your limits in Profile
            </p>
          </div>
          <button
            onClick={onRequestShop}
            data-testid="button-request-shop"
            className="gradient-cta rounded-2xl px-4 py-2.5 font-heading text-xs uppercase tracking-wide shadow-card focus:outline-none focus:ring-2 focus:ring-teal-400 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" />
            Request
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search brands or categories"
            value={globalCategorySearch}
            onChange={(e) => setGlobalCategorySearch(e.target.value)}
            data-testid="input-global-category-search"
            className="pl-12 pr-10 h-12 rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500 font-body"
          />
          {globalCategorySearch && (
            <button
              onClick={() => setGlobalCategorySearch('')}
              data-testid="button-clear-global-category-search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-slate-100 text-slate-700 border border-slate-200 rounded-xl px-3 py-1 font-body text-xs">
              {searchFilteredCategories.length} categories
            </Badge>
          </div>
          {!globalCategorySearch && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={expandAll}
                data-testid="button-expand-all"
                className="text-xs h-8 font-body"
              >
                Expand All
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={collapseAll}
                data-testid="button-collapse-all"
                className="text-xs h-8 font-body"
              >
                Collapse All
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-8 space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={orderedCategoryIds}
            strategy={verticalListSortingStrategy}
          >
            {orderedCategories.map((category) => (
              <SortableCategoryCard
                key={category.id}
                category={category}
                user={user}
                onCompanySelect={onCompanySelect}
                onAddStore={onAddStore}
                onRemoveStore={onRemoveStore}
                isExpanded={expandedCategories.has(category.id)}
                onToggleExpand={() => toggleCategoryExpansion(category.id)}
                globalSearch={globalCategorySearch}
                onRefSet={(categoryId, node) => {
                  if (node) {
                    categoryRefs.current[categoryId] = node;
                  } else {
                    delete categoryRefs.current[categoryId];
                  }
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
