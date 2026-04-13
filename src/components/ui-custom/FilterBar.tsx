import { Filter, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/store/taskStore';
import type { TaskStatus, TaskPriority, TaskType, SortOption } from '@/types/task';
import { useI18n } from '@/lib/i18n';

export const FilterBar = () => {
  const { filter, setFilter, sortBy, setSortBy, resetFilters } = useTaskStore();
  const { t, labelTaskStatus, labelPriority, labelTaskType, labelCategory } = useI18n();

  const hasActiveFilters = 
    filter.status !== 'all' || 
    filter.priority !== 'all' || 
    filter.category !== '' || 
    filter.taskType !== 'all';

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select 
          value={filter.status} 
          onValueChange={(v) => setFilter({ status: v as TaskStatus | 'all' })}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t('nav.pending')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filter.allStatus')}</SelectItem>
            <SelectItem value="pending">{labelTaskStatus('pending')}</SelectItem>
            <SelectItem value="in-progress">{labelTaskStatus('in-progress')}</SelectItem>
            <SelectItem value="completed">{labelTaskStatus('completed')}</SelectItem>
            <SelectItem value="archived">{labelTaskStatus('archived')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <Select 
        value={filter.priority} 
        onValueChange={(v) => setFilter({ priority: v as TaskPriority | 'all' })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t('filter.priority')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filter.allPriority')}</SelectItem>
          <SelectItem value="low">{labelPriority('low')}</SelectItem>
          <SelectItem value="medium">{labelPriority('medium')}</SelectItem>
          <SelectItem value="high">{labelPriority('high')}</SelectItem>
          <SelectItem value="urgent">{labelPriority('urgent')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select 
        value={filter.category || 'all'} 
        onValueChange={(v) => setFilter({ category: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t('taskModal.category')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filter.allCategories')}</SelectItem>
          <SelectItem value="personal">{labelCategory('personal')}</SelectItem>
          <SelectItem value="work">{labelCategory('work')}</SelectItem>
          <SelectItem value="shopping">{labelCategory('shopping')}</SelectItem>
          <SelectItem value="health">{labelCategory('health')}</SelectItem>
          <SelectItem value="education">{labelCategory('education')}</SelectItem>
          <SelectItem value="finance">{labelCategory('finance')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Task Type Filter */}
      <Select 
        value={filter.taskType} 
        onValueChange={(v) => setFilter({ taskType: v as TaskType | 'all' })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t('taskModal.taskType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('filter.allTypes')}</SelectItem>
          <SelectItem value="basic">{labelTaskType('basic')}</SelectItem>
          <SelectItem value="checklist">{labelTaskType('checklist')}</SelectItem>
          <SelectItem value="dueDate">{labelTaskType('dueDate')}</SelectItem>
          <SelectItem value="recurring">{labelTaskType('recurring')}</SelectItem>
          <SelectItem value="note">{labelTaskType('note')}</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
        <Select 
          value={sortBy} 
          onValueChange={(v) => setSortBy(v as SortOption)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('common.viewAll')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filter.newestFirst')}</SelectItem>
            <SelectItem value="oldest">{t('filter.oldestFirst')}</SelectItem>
            <SelectItem value="dueDate">{t('filter.dueDate')}</SelectItem>
            <SelectItem value="priority">{t('filter.priority')}</SelectItem>
            <SelectItem value="alphabetical">{t('filter.alphabetical')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4 mr-1" />
          {t('common.clear')}
        </Button>
      )}
    </div>
  );
};
