'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupPage() {
  const [organizationName, setOrganizationName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to create an organization')
        return
      }

      // Create organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          subdomain: subdomain || null,
          subscription_plan: 'free',
        })
        .select()
        .single()

      if (orgError) {
        setError(orgError.message)
        return
      }

      // Update user with organization_id and set role to admin
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          organization_id: orgData.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
          role: 'admin',
        })

      if (userError) {
        setError(userError.message)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to MissionPM!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Let's set up your organization
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Organization</CardTitle>
            <CardDescription>
              This will be your team's workspace for managing projects and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="organizationName">
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="organizationName"
                  type="text"
                  required
                  placeholder="e.g., Acme Nonprofit"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">
                  Subdomain (Optional)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    type="text"
                    placeholder="acme"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">.missionpm.app</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Create a custom URL for your organization
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !organizationName}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Organization'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>You'll be the admin of this organization</p>
          <p className="mt-1">You can invite team members later from settings</p>
        </div>
      </div>
    </div>
  )
}
