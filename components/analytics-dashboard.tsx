"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Upload, BarChart3 } from "lucide-react"
import Link from "next/link"
import { BulkUpload } from "@/components/bulk-upload"

// Mock analytics data
const churnTrendData = [
  { month: "Apr", churnRate: 8.2, predicted: 7.5 },
  { month: "May", churnRate: 9.1, predicted: 8.8 },
  { month: "Jun", churnRate: 7.8, predicted: 8.2 },
  { month: "Jul", churnRate: 10.5, predicted: 9.9 },
  { month: "Aug", churnRate: 9.3, predicted: 9.1 },
  { month: "Sep", churnRate: 11.2, predicted: 10.8 },
  { month: "Oct", churnRate: 0, predicted: 12.5 },
]

const riskDistributionData = [
  { name: "Low Risk", value: 68, color: "#10b981" },
  { name: "Medium Risk", value: 22, color: "#f59e0b" },
  { name: "High Risk", value: 10, color: "#ef4444" },
]

const riskFactorData = [
  { factor: "Low Login Frequency", count: 45, impact: 85 },
  { factor: "Failed Payments", count: 28, impact: 120 },
  { factor: "High Inactivity", count: 38, impact: 75 },
  { factor: "Low Content Completion", count: 52, impact: 65 },
  { factor: "Monthly Contract", count: 61, impact: 65 },
]

const cohortData = [
  { cohort: "0-3 months", total: 45, highRisk: 18, churnRate: 15.2 },
  { cohort: "3-6 months", total: 62, highRisk: 12, churnRate: 9.8 },
  { cohort: "6-12 months", total: 88, highRisk: 8, churnRate: 6.5 },
  { cohort: "12+ months", total: 105, highRisk: 5, churnRate: 3.2 },
]

export function AnalyticsDashboard() {
  const [showBulkUpload, setShowBulkUpload] = useState(false)

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
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Customer Dashboard
              </Button>
            </Link>
            <Button variant="default" size="sm" onClick={() => setShowBulkUpload(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Track churn trends, analyze risk factors, and measure prediction accuracy
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Churn Rate</span>
              <TrendingUp className="w-4 h-4 text-destructive" />
            </div>
            <div className="text-3xl font-bold">11.2%</div>
            <p className="text-xs text-destructive mt-1">+1.9% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Predicted Next Month</span>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on current trends</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Model Accuracy</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">87.3%</div>
            <p className="text-xs text-primary mt-1">+2.1% improvement</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Customers Saved</span>
              <TrendingDown className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-bold">23</div>
            <p className="text-xs text-muted-foreground mt-1">This month via interventions</p>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">Churn Trends</TabsTrigger>
            <TabsTrigger value="factors">Risk Factors</TabsTrigger>
            <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Churn Rate Trends</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Actual vs predicted churn rates over the last 6 months
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={churnTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" label={{ value: "Churn Rate (%)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="churnRate" stroke="#ef4444" strokeWidth={2} name="Actual Churn" />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Churn"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="factors" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Risk Factors</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Most common factors contributing to churn risk across your customer base
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={riskFactorData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="factor" type="category" width={150} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Affected Customers" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="cohorts" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cohort Analysis</h3>
              <p className="text-sm text-muted-foreground mb-6">Churn risk and rates by customer tenure</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="cohort" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Customers" />
                  <Bar dataKey="highRisk" fill="#ef4444" name="High Risk" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Risk Level Distribution</h3>
              <p className="text-sm text-muted-foreground mb-6">Breakdown of customers by churn risk level</p>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {riskDistributionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.value}% of customers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUpload && <BulkUpload onClose={() => setShowBulkUpload(false)} />}
    </div>
  )
}
