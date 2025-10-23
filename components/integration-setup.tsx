"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const PLATFORMS = [
  {
    id: "whop",
    name: "Whop",
    description: "Digital product marketplace",
    status: "recommended",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "ghl",
    name: "GoHighLevel",
    description: "CRM & marketing automation",
    status: "available",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "skool",
    name: "Skool",
    description: "Community & course platform",
    status: "available",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing",
    status: "available",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "teachable",
    name: "Teachable",
    description: "Online course platform",
    status: "coming-soon",
    color: "from-emerald-500 to-teal-500",
  },
]

export function IntegrationSetup() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate API connection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)
    // In production, save to database and redirect to dashboard
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-semibold text-lg">Dechurner</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            Setup Required
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Connect Your Platform</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Choose where your customer data lives. We'll sync automatically and predict churn for all your customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {PLATFORMS.map((platform) => (
            <Card
              key={platform.id}
              className={`p-6 cursor-pointer transition-all border-2 ${
                selectedPlatform === platform.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:border-muted-foreground"
              } ${platform.status === "coming-soon" ? "opacity-50" : ""}`}
              onClick={() => platform.status !== "coming-soon" && setSelectedPlatform(platform.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">{platform.name[0]}</span>
                </div>
                {platform.status === "recommended" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Recommended
                  </span>
                )}
                {platform.status === "coming-soon" && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </Card>
          ))}
        </div>

        {selectedPlatform && (
          <Card className="p-6 border-2 border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-lg mb-4">
              Connect {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">API Key</label>
                <Input
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Find your API key in your {PLATFORMS.find((p) => p.id === selectedPlatform)?.name} dashboard under
                  Settings → API
                </p>
              </div>
              <Button onClick={handleConnect} disabled={!apiKey || isConnecting} className="w-full" size="lg">
                {isConnecting ? "Connecting..." : "Connect & Sync Customers"}
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>We'll securely connect to your platform and sync customer data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Churn predictions will be calculated for all active customers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>You'll see a dashboard with risk scores and actionable insights</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Data syncs automatically every 24 hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
