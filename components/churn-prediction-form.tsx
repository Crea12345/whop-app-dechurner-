"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { predictChurn, type CustomerData, type PredictionResult } from "@/lib/churn-model"

export function ChurnPredictionForm() {
  const [formData, setFormData] = useState<CustomerData>({
    subscriptionAge: 6,
    monthlyCharge: 50,
    loginFrequency: 15,
    contentCompletion: 65,
    failedPayments: 0,
    paymentMethod: "Credit card",
    supportTickets: 1,
    contractType: "Monthly",
    daysSinceLastActivity: 3,
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handlePredict = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const result = predictChurn(formData)
      setPrediction(result)
      setIsCalculating(false)
    }, 600)
  }

  return (
    <div className="flex flex-col bg-background">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-8 shadow-xl border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-bold tracking-widest uppercase text-slate-300">Dechurner</div>
          <Sparkles className="w-4 h-4 text-slate-400" />
        </div>
        {prediction ? (
          <div className="space-y-5">
            <div className="flex items-end gap-3">
              <div className="text-7xl font-bold tabular-nums tracking-tighter leading-none">
                {(prediction.probability * 100).toFixed(0)}
              </div>
              <div className="text-3xl text-slate-300 pb-1.5">%</div>
            </div>
            <div className="flex items-center gap-2.5">
              {prediction.riskLevel === "High" ? (
                <>
                  <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-500/30">
                    <TrendingUp className="w-4 h-4 text-red-300" />
                    <span className="text-sm font-semibold text-red-200">High Risk</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-emerald-500/30">
                    <TrendingDown className="w-4 h-4 text-emerald-300" />
                    <span className="text-sm font-semibold text-emerald-200">Low Risk</span>
                  </div>
                </>
              )}
            </div>
            <div className="h-2.5 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${prediction.probability * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="py-10">
            <div className="text-7xl font-bold tabular-nums tracking-tighter leading-none text-slate-700">--</div>
            <div className="text-sm text-slate-400 mt-5">Enter customer data to calculate churn risk</div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32">
        {/* Engagement Metrics Group */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Engagement Metrics
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="loginFrequency" className="text-xs font-medium text-foreground/80">
                Logins (30d)
              </Label>
              <Input
                id="loginFrequency"
                type="number"
                min={0}
                max={100}
                value={formData.loginFrequency}
                onChange={(e) => setFormData({ ...formData, loginFrequency: Number.parseInt(e.target.value) || 0 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentCompletion" className="text-xs font-medium text-foreground/80">
                Completion %
              </Label>
              <Input
                id="contentCompletion"
                type="number"
                min={0}
                max={100}
                value={formData.contentCompletion}
                onChange={(e) => setFormData({ ...formData, contentCompletion: Number.parseInt(e.target.value) || 0 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="daysSinceLastActivity" className="text-xs font-medium text-foreground/80">
              Days Since Last Activity
            </Label>
            <Input
              id="daysSinceLastActivity"
              type="number"
              min={0}
              max={365}
              value={formData.daysSinceLastActivity}
              onChange={(e) =>
                setFormData({ ...formData, daysSinceLastActivity: Number.parseInt(e.target.value) || 0 })
              }
              className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* Subscription Details Group */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Subscription Details
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="subscriptionAge" className="text-xs font-medium text-foreground/80">
                Sub Age (mo)
              </Label>
              <Input
                id="subscriptionAge"
                type="number"
                min={0}
                max={120}
                value={formData.subscriptionAge}
                onChange={(e) => setFormData({ ...formData, subscriptionAge: Number.parseInt(e.target.value) || 0 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
              <p className="text-xs text-muted-foreground">How many months they've been a customer</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyCharge" className="text-xs font-medium text-foreground/80">
                Monthly $
              </Label>
              <Input
                id="monthlyCharge"
                type="number"
                min={5}
                max={500}
                step={0.01}
                value={formData.monthlyCharge}
                onChange={(e) => setFormData({ ...formData, monthlyCharge: Number.parseFloat(e.target.value) || 5 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType" className="text-xs font-medium text-foreground/80">
              Contract Type
            </Label>
            <Select
              value={formData.contractType}
              onValueChange={(value) => setFormData({ ...formData, contractType: value })}
            >
              <SelectTrigger
                id="contractType"
                className="h-12 text-base border-2 focus:border-slate-900 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment & Support Group */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Payment & Support
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="failedPayments" className="text-xs font-medium text-foreground/80">
                Failed Pays
              </Label>
              <Input
                id="failedPayments"
                type="number"
                min={0}
                max={10}
                value={formData.failedPayments}
                onChange={(e) => setFormData({ ...formData, failedPayments: Number.parseInt(e.target.value) || 0 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportTickets" className="text-xs font-medium text-foreground/80">
                Support Tix
              </Label>
              <Input
                id="supportTickets"
                type="number"
                min={0}
                max={50}
                value={formData.supportTickets}
                onChange={(e) => setFormData({ ...formData, supportTickets: Number.parseInt(e.target.value) || 0 })}
                className="h-12 text-base font-medium border-2 focus:border-slate-900 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod" className="text-xs font-medium text-foreground/80">
              Payment Method
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
            >
              <SelectTrigger
                id="paymentMethod"
                className="h-12 text-base border-2 focus:border-slate-900 transition-colors"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit card">Credit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Bank transfer">Bank Transfer</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {prediction && (
          <Card className="p-5 bg-slate-50 border-2 border-slate-200 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Top Risk Factors</div>
            </div>
            <div className="space-y-3">
              {prediction.riskFactors.slice(0, 3).map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{factor.feature}</span>
                  <span className="text-sm font-bold text-slate-900">+{factor.impact.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-5 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <Button
          onClick={handlePredict}
          className="w-full h-14 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] bg-slate-900 hover:bg-slate-800 pointer-events-auto"
          size="lg"
          disabled={isCalculating}
        >
          {isCalculating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              Calculating...
            </span>
          ) : (
            "Calculate Churn Risk"
          )}
        </Button>
      </div>
    </div>
  )
}
