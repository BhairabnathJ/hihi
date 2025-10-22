import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProjectBoard } from './project-board'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !project) {
    redirect('/dashboard')
  }

  // Get tasks for this project
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', params.id)
    .order('position', { ascending: true })

  // Get lists from project settings or use defaults
  const lists = project.settings?.lists || [
    { name: 'To Do', position: 0 },
    { name: 'In Progress', position: 1 },
    { name: 'Done', position: 2 },
  ]

  return <ProjectBoard project={project} tasks={tasks || []} lists={lists} />
}
