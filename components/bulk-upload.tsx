"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, X } from "lucide-react"
import { predictChurn, type CustomerData } from "@/lib/churn-model"

type UploadedCustomer = CustomerData & {
  name: string
  email: string
  id: string
}

type PredictionResult = UploadedCustomer & {
  prediction: ReturnType<typeof predictChurn>
}

export function BulkUpload({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<PredictionResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim())

      // Parse CSV and run predictions
      const predictions: PredictionResult[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const customer: any = {}

        headers.forEach((header, idx) => {
          customer[header] = values[idx]
        })

        // Convert to proper types
        const customerData: UploadedCustomer = {
          id: customer.id || `customer-${i}`,
          name: customer.name || "Unknown",
          email: customer.email || "",
          subscriptionAge: Number.parseFloat(customer.subscriptionAge) || 0,
          monthlyCharge: Number.parseFloat(customer.monthlyCharge) || 0,
          loginFrequency: Number.parseFloat(customer.loginFrequency) || 0,
          contentCompletion: Number.parseFloat(customer.contentCompletion) || 0,
          failedPayments: Number.parseFloat(customer.failedPayments) || 0,
          paymentMethod: customer.paymentMethod || "Credit card",
          supportTickets: Number.parseFloat(customer.supportTickets) || 0,
          contractType: customer.contractType || "Monthly",
          daysSinceLastActivity: Number.parseFloat(customer.daysSinceLastActivity) || 0,
        }

        const prediction = predictChurn(customerData)
        predictions.push({ ...customerData, prediction })
      }

      setResults(predictions)
    } catch (err) {
      setError("Error processing file. Please check the format and try again.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = `id,name,email,subscriptionAge,monthlyCharge,loginFrequency,contentCompletion,failedPayments,paymentMethod,supportTickets,contractType,daysSinceLastActivity
1,John Doe,john@example.com,6,79,12,75,0,Credit card,1,Monthly,3
2,Jane Smith,jane@example.com,2,49,3,20,1,PayPal,4,Monthly,15`

    const blob = new Blob([template], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "churn-prediction-template.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportResults = () => {
    if (results.length === 0) return

    const headers = [
      "id",
      "name",
      "email",
      "churnProbability",
      "riskLevel",
      "topRiskFactor1",
      "topRiskFactor2",
      "topRiskFactor3",
    ]
    const rows = results.map((r) => [
      r.id,
      r.name,
      r.email,
      (r.prediction.probability * 100).toFixed(1),
      r.prediction.riskLevel,
      r.prediction.riskFactors[0]?.feature || "",
      r.prediction.riskFactors[1]?.feature || "",
      r.prediction.riskFactors[2]?.feature || "",
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "churn-predictions-results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const highRiskCount = results.filter((r) => r.prediction.riskLevel === "High").length

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Bulk Churn Prediction
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with customer data to generate churn predictions for multiple customers at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          {results.length === 0 && (
            <>
              <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Upload Customer Data</h3>
                    <p className="text-sm text-muted-foreground">CSV file with customer information (max 10MB)</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    Select CSV File
                  </Button>
                  {file && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="font-medium">{file.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-6 w-6 p-0">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleDownloadTemplate}>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Template
                </Button>
                <Button onClick={handleProcess} disabled={!file || isProcessing}>
                  {isProcessing ? "Processing..." : "Generate Predictions"}
                </Button>
              </div>

              <Card className="p-4 bg-muted/50">
                <h4 className="font-medium text-sm mb-2">Required CSV Columns:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>• id, name, email</div>
                  <div>• subscriptionAge (months)</div>
                  <div>• monthlyCharge (dollars)</div>
                  <div>• loginFrequency (last 30 days)</div>
                  <div>• contentCompletion (percentage)</div>
                  <div>• failedPayments (count)</div>
                  <div>• paymentMethod</div>
                  <div>• supportTickets (last 90 days)</div>
                  <div>• contractType</div>
                  <div>• daysSinceLastActivity</div>
                </div>
              </Card>
            </>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Total Processed</div>
                  <div className="text-2xl font-bold">{results.length}</div>
                </Card>
                <Card className="p-4 border-destructive/20 bg-destructive/5">
                  <div className="text-sm text-muted-foreground mb-1">High Risk</div>
                  <div className="text-2xl font-bold text-destructive">{highRiskCount}</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Avg Churn Probability</div>
                  <div className="text-2xl font-bold">
                    {((results.reduce((sum, r) => sum + r.prediction.probability, 0) / results.length) * 100).toFixed(
                      1,
                    )}
                    %
                  </div>
                </Card>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card">
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Probability</TableHead>
                        <TableHead>Top Risk Factor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-xs text-muted-foreground">{result.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={result.prediction.riskLevel === "High" ? "destructive" : "secondary"}>
                              {result.prediction.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {(result.prediction.probability * 100).toFixed(0)}%
                              </div>
                              <Progress
                                value={result.prediction.probability * 100}
                                className="h-1.5 w-20"
                                indicatorClassName={
                                  result.prediction.riskLevel === "High" ? "bg-destructive" : "bg-primary"
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {result.prediction.riskFactors[0]?.feature || "None"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setResults([])}>
                  Upload Another File
                </Button>
                <Button onClick={handleExportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
