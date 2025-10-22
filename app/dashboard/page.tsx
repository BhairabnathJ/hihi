import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Dashboard
          </h1>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to MissionPM!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You're logged in as: {user.email}
            </p>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              This is the beginning of your nonprofit project management platform.
              More features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
