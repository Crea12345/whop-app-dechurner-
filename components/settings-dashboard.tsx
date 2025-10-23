"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  LinkIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trash2,
  Plus,
  AlertCircle,
  Bell,
  Database,
  Zap,
} from "lucide-react"
import Link from "next/link"

type Platform = {
  id: string
  name: string
  description: string
  status: "connected" | "disconnected" | "error"
  color: string
  icon: string
  apiKey?: string
  lastSync?: string
  customerCount?: number
  features: string[]
}

const PLATFORMS: Platform[] = [
  {
    id: "whop",
    name: "Whop",
    description: "Digital product marketplace",
    status: "connected",
    color: "from-purple-500 to-pink-500",
    icon: "W",
    apiKey: "whop_••••••••••••3x9k",
    lastSync: "2 minutes ago",
    customerCount: 342,
    features: ["Customer sync", "Payment data", "Subscription tracking"],
  },
  {
    id: "ghl",
    name: "GoHighLevel",
    description: "CRM & marketing automation",
    status: "disconnected",
    color: "from-blue-500 to-cyan-500",
    icon: "G",
    features: ["Contact sync", "Custom fields", "Workflow triggers"],
  },
  {
    id: "skool",
    name: "Skool",
    description: "Community & course platform",
    status: "disconnected",
    color: "from-orange-500 to-red-500",
    icon: "S",
    features: ["Member data", "Engagement metrics", "Course completion", "Community activity"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing",
    status: "connected",
    color: "from-indigo-500 to-purple-500",
    icon: "S",
    apiKey: "sk_live_••••••••••••7Kp2",
    lastSync: "15 minutes ago",
    customerCount: 428,
    features: ["Payment data", "Subscription events", "Customer metadata"],
  },
  {
    id: "teachable",
    name: "Teachable",
    description: "Online course platform",
    status: "disconnected",
    color: "from-emerald-500 to-teal-500",
    icon: "T",
    features: ["Student data", "Course completion", "Engagement metrics"],
  },
]

export function SettingsDashboard() {
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS)
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("24")
  const [notifications, setNotifications] = useState({
    highRisk: true,
    syncErrors: true,
    weeklyReport: false,
  })

  const handleConnect = (platformId: string) => {
    if (!apiKeyInput) return

    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: "connected" as const,
              apiKey: apiKeyInput.substring(0, 20) + "••••",
              lastSync: "Just now",
              customerCount: Math.floor(Math.random() * 500) + 100,
            }
          : p,
      ),
    )
    setEditingPlatform(null)
    setApiKeyInput("")
  }

  const handleDisconnect = (platformId: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              status: "disconnected" as const,
              apiKey: undefined,
              lastSync: undefined,
              customerCount: undefined,
            }
          : p,
      ),
    )
  }

  const handleSync = (platformId: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, lastSync: "Just now" } : p)))
  }

  const connectedCount = platforms.filter((p) => p.status === "connected").length

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
                Dashboard
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="outline" size="sm">
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your platform connections, sync settings, and notification preferences
          </p>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="integrations">
              <LinkIcon className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="sync">
              <Database className="w-4 h-4 mr-2" />
              Data Sync
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Platform Connections</h2>
                  <p className="text-sm text-muted-foreground">
                    {connectedCount} of {platforms.length} platforms connected
                  </p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {connectedCount} Active
                </Badge>
              </div>

              <div className="space-y-4">
                {platforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`p-6 border-2 ${
                      platform.status === "connected" ? "border-primary/20 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-white font-bold text-lg">{platform.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{platform.name}</h3>
                            {platform.status === "connected" && (
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            {platform.status === "disconnected" && (
                              <Badge variant="secondary">
                                <XCircle className="w-3 h-3 mr-1" />
                                Not Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{platform.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {platform.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {platform.status === "connected" && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">API Key:</span>
                            <span className="ml-2 font-mono">{platform.apiKey}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span className="ml-2">{platform.lastSync}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Customers:</span>
                            <span className="ml-2 font-semibold">{platform.customerCount}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSync(platform.id)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingPlatform(platform.id)}>
                            Update API Key
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(platform.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    )}

                    {(platform.status === "disconnected" || editingPlatform === platform.id) && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-border">
                        <div>
                          <Label htmlFor={`api-key-${platform.id}`} className="text-sm font-medium">
                            API Key
                          </Label>
                          <Input
                            id={`api-key-${platform.id}`}
                            type="password"
                            placeholder="Enter your API key"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            className="mt-2 font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            Find your API key in your {platform.name} dashboard under Settings → API
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleConnect(platform.id)} disabled={!apiKeyInput} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            {editingPlatform === platform.id ? "Update Connection" : "Connect"}
                          </Button>
                          {editingPlatform === platform.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingPlatform(null)
                                setApiKeyInput("")
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Data Sync Tab */}
          <TabsContent value="sync" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Automatic Data Sync</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="auto-sync" className="text-base font-medium">
                      Enable Automatic Sync
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync customer data from connected platforms
                    </p>
                  </div>
                  <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label htmlFor="sync-frequency" className="text-base font-medium">
                    Sync Frequency
                  </Label>
                  <p className="text-sm text-muted-foreground">How often should we sync data from your platforms?</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["6", "12", "24", "48"].map((hours) => (
                      <Button
                        key={hours}
                        variant={syncFrequency === hours ? "default" : "outline"}
                        onClick={() => setSyncFrequency(hours)}
                        disabled={!autoSync}
                      >
                        Every {hours}h
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base font-medium">Sync Status</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {platforms
                      .filter((p) => p.status === "connected")
                      .map((platform) => (
                        <Card key={platform.id} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                              >
                                <span className="text-white font-bold text-sm">{platform.icon}</span>
                              </div>
                              <span className="font-medium">{platform.name}</span>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">Last synced: {platform.lastSync}</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 bg-transparent"
                            onClick={() => handleSync(platform.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sync Now
                          </Button>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50 border-primary/20">
              <div className="flex gap-3">
                <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Real-time Webhooks</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get instant churn predictions when customer data changes. Available for Stripe and Whop.
                  </p>
                  <Button variant="outline" size="sm">
                    Configure Webhooks
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="high-risk" className="text-base font-medium">
                      High Risk Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground">Get notified when customers enter high churn risk</p>
                  </div>
                  <Switch
                    id="high-risk"
                    checked={notifications.highRisk}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, highRisk: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sync-errors" className="text-base font-medium">
                      Sync Error Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Alert me when data sync fails or encounters errors</p>
                  </div>
                  <Switch
                    id="sync-errors"
                    checked={notifications.syncErrors}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, syncErrors: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-report" className="text-base font-medium">
                      Weekly Summary Report
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly email with churn trends and insights
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={notifications.weeklyReport}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyReport: checked }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50 border-primary/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Notification Channels</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure where you want to receive notifications: Email, Slack, or SMS
                  </p>
                  <Button variant="outline" size="sm">
                    Configure Channels
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
