import { ChurnPredictionForm } from "@/components/churn-prediction-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-lg">Dechurner</span>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              CRM Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 pb-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Universal Churn Prediction
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Predict customer churn across any digital business
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              From SaaS to courses, memberships to newsletters. One calculator, infinite applications.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">SaaS & Apps</div>
              <div className="text-lg font-semibold">Micro-SaaS</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Education</div>
              <div className="text-lg font-semibold">Courses</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Community</div>
              <div className="text-lg font-semibold">Memberships</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Content</div>
              <div className="text-lg font-semibold">Newsletters</div>
            </div>
          </div>
        </div>

        <ChurnPredictionForm />
      </div>
    </main>
  )
}
