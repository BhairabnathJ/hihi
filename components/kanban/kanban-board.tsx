'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanList } from './kanban-list'
import { KanbanCard } from './kanban-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export interface Task {
  id: string
  name: string
  description: string | null
  status: string
  priority: string | null
  assignee_id: string | null
  due_date: string | null
  position: number
  project_id: string
}

export interface List {
  name: string
  position: number
}

interface KanbanBoardProps {
  lists: List[]
  tasks: Task[]
  projectId: string
  onTaskMove: (taskId: string, newStatus: string, newPosition: number) => Promise<void>
  onTaskCreate: (listName: string) => void
  onTaskClick: (task: Task) => void
}

export function KanbanBoard({
  lists,
  tasks,
  projectId,
  onTaskMove,
  onTaskCreate,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position)
  }

  const findTaskById = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over if needed
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      return
    }

    const activeTask = findTaskById(active.id as string)
    if (!activeTask) {
      setActiveId(null)
      return
    }

    // Determine the new status from the over container
    const overData = over.data.current
    const newStatus = overData?.sortable?.containerId || activeTask.status

    const tasksInNewStatus = getTasksByStatus(newStatus)
    const oldIndex = tasksInNewStatus.findIndex((t) => t.id === activeTask.id)
    const newIndex = over.id === newStatus ? tasksInNewStatus.length : tasksInNewStatus.findIndex((t) => t.id === over.id)

    let newPosition = 0
    if (newIndex === 0) {
      newPosition = tasksInNewStatus[0]?.position ? tasksInNewStatus[0].position / 2 : 1000
    } else if (newIndex === tasksInNewStatus.length - 1) {
      newPosition = tasksInNewStatus[newIndex]?.position ? tasksInNewStatus[newIndex].position + 1000 : (newIndex + 1) * 1000
    } else {
      const prevPosition = tasksInNewStatus[newIndex - 1]?.position || 0
      const nextPosition = tasksInNewStatus[newIndex]?.position || (newIndex + 2) * 1000
      newPosition = (prevPosition + nextPosition) / 2
    }

    await onTaskMove(activeTask.id, newStatus, newPosition)
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const activeTask = activeId ? findTaskById(activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <KanbanList
            key={list.name}
            list={list}
            tasks={getTasksByStatus(list.name)}
            onTaskClick={onTaskClick}
            onAddTask={() => onTaskCreate(list.name)}
          />
        ))}
        
        {/* Add List button */}
        <div className="flex-shrink-0 w-80">
          <Button variant="outline" className="w-full" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add List (Coming Soon)
          </Button>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-90">
            <KanbanCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
