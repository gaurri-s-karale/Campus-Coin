import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/primitives'
import { AdminConsole } from '@/components/admin/admin-console'

export const metadata: Metadata = { title: 'Admin Console' }

export default function AdminPage() {
  return (
    <>
      <PageIntro
        title="Admin Console"
        description="Monitor CampusCoin supply, distribute rewards and manage the campus vendor registry."
      />
      <AdminConsole />
    </>
  )
}
