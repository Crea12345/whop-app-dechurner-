"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, TrendingUp, Users, DollarSign, Search, Download, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { predictChurn } from "@/lib/churn-model"

// Mock customer data - in production, this would come from your API
const mockCustomers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    subscriptionAge: 2,
    monthlyCharge: 49,
    loginFrequency: 2,
    contentCompletion: 15,
    failedPayments: 1,
    paymentMethod: "Credit card",
    supportTickets: 2,
    contractType: "Monthly",
    daysSinceLastActivity: 18,
    joinDate: "2025-08-15",
    mrr: 49,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    subscriptionAge: 8,
    monthlyCharge: 99,
    loginFrequency: 15,
    contentCompletion: 85,
    failedPayments: 0,
    paymentMethod: "Credit card",
    supportTickets: 1,
    contractType: "Annual",
    daysSinceLastActivity: 2,
    joinDate: "2024-02-10",
    mrr: 99,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    subscriptionAge: 5,
    monthlyCharge: 79,
    loginFrequency: 8,
    contentCompletion: 60,
    failedPayments: 0,
    paymentMethod: "PayPal",
    supportTickets: 0,
    contractType: "Quarterly",
    daysSinceLastActivity: 5,
    joinDate: "2024-05-20",
    mrr: 79,
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.k@example.com",
    subscriptionAge: 1,
    monthlyCharge: 149,
    loginFrequency: 3,
    contentCompletion: 25,
    failedPayments: 2,
    paymentMethod: "Invoice",
    supportTickets: 5,
    contractType: "Monthly",
    daysSinceLastActivity: 22,
    joinDate: "2025-09-01",
    mrr: 149,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    subscriptionAge: 12,
    monthlyCharge: 59,
    loginFrequency: 20,
    contentCompletion: 95,
    failedPayments: 0,
    paymentMethod: "Credit card",
    supportTickets: 0,
    contractType: "Annual",
    daysSinceLastActivity: 1,
    joinDate: "2023-10-15",
    mrr: 59,
  },
]

type CustomerWithPrediction = (typeof mockCustomers)[0] & {
  prediction: ReturnType<typeof predictChurn>
}

export function CustomerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<"all" | "high" | "low">("all")

  // Calculate predictions for all customers
  const customersWithPredictions: CustomerWithPrediction[] = mockCustomers.map((customer) => ({
    ...customer,
    prediction: predictChurn({
      subscriptionAge: customer.subscriptionAge,
      monthlyCharge: customer.monthlyCharge,
      loginFrequency: customer.loginFrequency,
      contentCompletion: customer.contentCompletion,
      failedPayments: customer.failedPayments,
      paymentMethod: customer.paymentMethod,
      supportTickets: customer.supportTickets,
      contractType: customer.contractType,
      daysSinceLastActivity: customer.daysSinceLastActivity,
    }),
  }))

  // Filter customers
  const filteredCustomers = customersWithPredictions.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRisk =
      riskFilter === "all" ||
      (riskFilter === "high" && customer.prediction.riskLevel === "High") ||
      (riskFilter === "low" && customer.prediction.riskLevel === "Low")
    return matchesSearch && matchesRisk
  })

  // Calculate summary stats
  const highRiskCount = customersWithPredictions.filter((c) => c.prediction.riskLevel === "High").length
  const totalMRR = customersWithPredictions.reduce((sum, c) => sum + c.mrr, 0)
  const atRiskMRR = customersWithPredictions
    .filter((c) => c.prediction.riskLevel === "High")
    .reduce((sum, c) => sum + c.mrr, 0)
  const avgChurnProb =
    customersWithPredictions.reduce((sum, c) => sum + c.prediction.probability, 0) / customersWithPredictions.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">Dechurner</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/analytics">
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Customers</span>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{customersWithPredictions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
          </Card>

          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">High Risk</span>
              <AlertCircle className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-3xl font-bold text-destructive">{highRiskCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((highRiskCount / customersWithPredictions.length) * 100).toFixed(0)}% of customers
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total MRR</span>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">${totalMRR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly recurring revenue</p>
          </Card>

          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">At-Risk MRR</span>
              <TrendingUp className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-3xl font-bold text-destructive">${atRiskMRR.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((atRiskMRR / totalMRR) * 100).toFixed(0)}% of total MRR
            </p>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={(value: any) => setRiskFilter(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="high">High Risk Only</SelectItem>
                <SelectItem value="low">Low Risk Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Customer Table */}
        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Customer Churn Predictions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {filteredCustomers.length} of {customersWithPredictions.length} customers
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Churn Probability</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Top Risk Factors</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.prediction.riskLevel === "High" ? "destructive" : "secondary"}>
                        {customer.prediction.riskLevel} Risk
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {(customer.prediction.probability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={customer.prediction.probability * 100}
                          className="h-2"
                          indicatorClassName={
                            customer.prediction.riskLevel === "High" ? "bg-destructive" : "bg-primary"
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${customer.mrr}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{customer.contractType}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 max-w-xs">
                        {customer.prediction.riskFactors.slice(0, 2).map((factor, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground">
                            • {factor.feature}
                          </div>
                        ))}
                        {customer.prediction.riskFactors.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{customer.prediction.riskFactors.length - 2} more
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
