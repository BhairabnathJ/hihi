'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, AlertCircle } from 'lucide-react'
import type { Task } from './kanban-board'

interface KanbanCardProps {
  task: Task
  isDragging?: boolean
  onClick?: () => void
}

export function KanbanCard({ task, isDragging = false, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()
  const priorityClass = task.priority ? priorityColors[task.priority] || '' : ''

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={'p-3 cursor-pointer hover:shadow-md transition-shadow ' + (isDragging ? 'shadow-lg' : '')}
        onClick={onClick}
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
            {task.name}
          </h4>

          {task.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1">
            {task.priority && task.priority !== 'medium' && (
              <Badge variant="secondary" className={'text-xs ' + priorityClass}>
                {task.priority}
              </Badge>
            )}
            {task.due_date && (
              <Badge
                variant="outline"
                className={'text-xs flex items-center gap-1 ' + (isOverdue ? 'text-red-600 border-red-600' : '')}
              >
                <Calendar className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
