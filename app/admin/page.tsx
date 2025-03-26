import { AdminDashboard } from "@/components/admin/admin-dashboard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard | StudentConnect",
  description: "Admin dashboard for StudentConnect",
}

export default function AdminPage() {
  return <AdminDashboard />
}

