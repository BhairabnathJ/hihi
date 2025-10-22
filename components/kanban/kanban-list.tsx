'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './kanban-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Task, List } from './kanban-board'

interface KanbanListProps {
  list: List
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: () => void
}

export function KanbanList({ list, tasks, onTaskClick, onAddTask }: KanbanListProps) {
  const { setNodeRef } = useDroppable({
    id: list.name,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        {/* List Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {list.name}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {tasks.length}
            </span>
          </h3>
        </div>

        {/* Tasks */}
        <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Card Button */}
        <Button
          variant="ghost"
          className="w-full mt-2 justify-start text-gray-600 dark:text-gray-400"
          onClick={onAddTask}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </div>
  )
}
