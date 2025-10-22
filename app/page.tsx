import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
              MissionPM
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Integrated Project Management & CRM System for Nonprofits
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Streamline operations, maximize impact, and focus on what matters most—serving your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Project Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kanban boards, Gantt charts, and task tracking designed for nonprofit workflows
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  CRM & Donors
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage donors, volunteers, grants, and partnerships all in one place
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Time & HR
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track time, manage schedules, and streamline HR for your team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
