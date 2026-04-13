import { useNavigate } from 'react-router-dom';
import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Pin,
  TrendingUp,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/ui-custom/StatsCard';
import { TaskCard } from '@/components/ui-custom/TaskCard';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useTaskStore } from '@/store/taskStore';
import { formatDate, getDueDateStatus } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    getTaskStats, 
    getRecentTasks, 
    getUpcomingTasks, 
    getPinnedTasks,
    getOverdueTasks,
    openAddModal 
  } = useTaskStore();

  const stats = getTaskStats();
  const recentTasks = getRecentTasks();
  const upcomingTasks = getUpcomingTasks();
  const pinnedTasks = getPinnedTasks();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's your task overview.
          </p>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700"
        >
          + Add Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={ListTodo}
          color="violet"
          onClick={() => navigate('/tasks')}
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
          onClick={() => navigate('/completed')}
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="blue"
          onClick={() => navigate('/pending')}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          color="amber"
          onClick={() => navigate('/tasks')}
        />
        <StatsCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          color="red"
          onClick={() => navigate('/tasks')}
        />
        <StatsCard
          title="Pinned"
          value={stats.pinned}
          icon={Pin}
          color="purple"
          onClick={() => navigate('/pinned')}
        />
      </div>

      {/* Progress Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Completion Progress
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {stats.completionPercentage}%
            </span>
          </div>
        </div>
        <Progress 
          value={stats.completionPercentage} 
          className="h-3"
        />
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pinned Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pin className="w-5 h-5 text-violet-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Pinned Tasks
              </h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/pinned')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {pinnedTasks.length > 0 ? (
            <div className="space-y-3">
              {pinnedTasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No pinned tasks yet
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate('/tasks')}
                className="text-violet-600"
              >
                Pin important tasks
              </Button>
            </div>
          )}
        </Card>

        {/* Upcoming Due Dates */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Due Dates
              </h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.slice(0, 3).map((task) => (
                <div 
                  key={task.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors cursor-pointer'
                  )}
                  onClick={() => navigate('/tasks')}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      task.priority === 'urgent' && 'bg-red-500',
                      task.priority === 'high' && 'bg-orange-500',
                      task.priority === 'medium' && 'bg-yellow-500',
                      task.priority === 'low' && 'bg-green-500',
                    )} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {task.dueDate && (
                      <>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(task.dueDate)}
                        </p>
                        <p className={cn(
                          'text-xs',
                          getDueDateStatus(task.dueDate, task.status).isOverdue 
                            ? 'text-red-500' 
                            : 'text-gray-500 dark:text-gray-400'
                        )}>
                          {getDueDateStatus(task.dueDate, task.status).label}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No upcoming due dates
              </p>
              <Button 
                variant="link" 
                onClick={openAddModal}
                className="text-violet-600"
              >
                Add a task with due date
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Tasks */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Tasks
              </h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/tasks')}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.slice(0, 6).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState type="all" />
          )}
        </Card>

        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <Card className="p-6 lg:col-span-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Overdue Tasks
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300">
                  You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {overdueTasks.slice(0, 4).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {task.title}
                  </span>
                  <span className="text-xs text-red-600 font-medium">
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
