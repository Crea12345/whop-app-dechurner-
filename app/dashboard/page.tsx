import { IntegrationSetup } from "@/components/integration-setup"
import { CustomerDashboard } from "@/components/customer-dashboard"

export default function DashboardPage() {
  // In production, check if user has connected Whop
  const hasIntegration = false // This would come from your database

  if (!hasIntegration) {
    return <IntegrationSetup />
  }

  return <CustomerDashboard />
}
