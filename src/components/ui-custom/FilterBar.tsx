import { Filter, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTaskStore } from '@/store/taskStore';
import type { TaskStatus, TaskPriority, TaskType, SortOption } from '@/types/task';

export const FilterBar = () => {
  const { filter, setFilter, sortBy, setSortBy, resetFilters } = useTaskStore();

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
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <Select 
        value={filter.priority} 
        onValueChange={(v) => setFilter({ priority: v as TaskPriority | 'all' })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select 
        value={filter.category || 'all'} 
        onValueChange={(v) => setFilter({ category: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
          <SelectItem value="work">Work</SelectItem>
          <SelectItem value="shopping">Shopping</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
        </SelectContent>
      </Select>

      {/* Task Type Filter */}
      <Select 
        value={filter.taskType} 
        onValueChange={(v) => setFilter({ taskType: v as TaskType | 'all' })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Task Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="checklist">Checklist</SelectItem>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="recurring">Recurring</SelectItem>
          <SelectItem value="note">Note</SelectItem>
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
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
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
          Clear
        </Button>
      )}
    </div>
  );
};
