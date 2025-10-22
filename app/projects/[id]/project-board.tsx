'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { KanbanBoard, type Task, type List } from '@/components/kanban/kanban-board'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'

interface ProjectBoardProps {
  project: any
  tasks: Task[]
  lists: List[]
}

export function ProjectBoard({ project, tasks: initialTasks, lists }: ProjectBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createListName, setCreateListName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const router = useRouter()
  const supabase = createClient()

  const handleTaskMove = async (taskId: string, newStatus: string, newPosition: number) => {
    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, position: newPosition } : task
      )
    )

    // Update in database
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, position: newPosition })
      .eq('id', taskId)

    if (error) {
      console.error('Failed to update task:', error)
      // Revert on error
      setTasks(initialTasks)
    } else {
      router.refresh()
    }
  }

  const handleTaskCreate = async (listName: string) => {
    setCreateListName(listName)
    setIsCreateDialogOpen(true)
  }

  const handleCreateTask = async () => {
    if (!newTaskName.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Calculate position (add to end of list)
    const tasksInList = tasks.filter((t) => t.status === createListName)
    const maxPosition = tasksInList.length > 0 
      ? Math.max(...tasksInList.map((t) => t.position))
      : 0

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        project_id: project.id,
        name: newTaskName,
        description: newTaskDescription || null,
        status: createListName,
        priority: newTaskPriority,
        position: maxPosition + 1000,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create task:', error)
      return
    }

    // Add to local state
    setTasks([...tasks, data])
    
    // Reset form
    setNewTaskName('')
    setNewTaskDescription('')
    setNewTaskPriority('medium')
    setIsCreateDialogOpen(false)
    router.refresh()
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          lists={lists}
          tasks={tasks}
          projectId={project.id}
          onTaskMove={handleTaskMove}
          onTaskCreate={handleTaskCreate}
          onTaskClick={handleTaskClick}
        />

        {/* Create Task Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Task in {createListName}</DialogTitle>
              <DialogDescription>
                Add a new task to your project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-name">Task Name *</Label>
                <Input
                  id="task-name"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add more details..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <select
                  id="task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={!newTaskName.trim()}>
                Create Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Task Detail Dialog (simplified for MVP) */}
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTask?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedTask?.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedTask.description}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <p className="text-sm mt-1 capitalize">{selectedTask?.status}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <p className="text-sm mt-1 capitalize">{selectedTask?.priority || 'Not set'}</p>
                </div>
              </div>
              {selectedTask?.due_date && (
                <div>
                  <Label>Due Date</Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedTask.due_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
