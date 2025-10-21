# Dechurner Integration Guide

This guide shows you how to automate churn predictions by connecting Dechurner to your platforms.

## 🚀 Quick Start

### 1. Install Dependencies

\`\`\`bash
pip install requests pandas numpy
\`\`\`

### 2. Configure API Keys

Create a `.env` file:

\`\`\`env
WHOP_API_KEY=your_whop_api_key
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id
SLACK_WEBHOOK_URL=your_slack_webhook
\`\`\`

### 3. Run Integration Scripts

**Whop Integration:**
\`\`\`bash
python scripts/whop_integration.py
\`\`\`

**GoHighLevel Integration:**
\`\`\`bash
python scripts/ghl_integration.py
\`\`\`

**Automated Monitoring:**
\`\`\`bash
python scripts/automated_monitoring.py
\`\`\`

## 📋 Required Custom Fields

### For GoHighLevel

Add these custom fields to your GHL contacts:

- `subscription_start_date` (Date)
- `monthly_charge` (Number)
- `login_frequency_30d` (Number)
- `content_completion_rate` (Number)
- `failed_payments` (Number)
- `payment_method` (Text)
- `support_tickets_90d` (Number)
- `contract_type` (Dropdown: Monthly/Annual)

### For Whop

Whop provides most data automatically. You may want to track separately:
- Content completion rates
- Support ticket counts
- Custom engagement metrics

## 🔄 Automation Options

### Option 1: Cron Job (Linux/Mac)

\`\`\`bash
# Run daily at 9 AM
0 9 * * * cd /path/to/dechurner && python scripts/automated_monitoring.py
\`\`\`

### Option 2: GitHub Actions

Create `.github/workflows/churn-monitoring.yml`:

\`\`\`yaml
name: Daily Churn Monitoring
on:
  schedule:
    - cron: '0 9 * * *'  # 9 AM daily
jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run monitoring
        run: python scripts/automated_monitoring.py
\`\`\`

### Option 3: Vercel Cron Jobs

Add to `vercel.json`:

\`\`\`json
{
  "crons": [{
    "path": "/api/monitor-churn",
    "schedule": "0 9 * * *"
  }]
}
\`\`\`

## 🎯 Automated Actions

When high-risk customers are detected, you can:

1. **Tag in CRM** - Automatically tag customers with risk level
2. **Trigger Workflows** - Start retention campaigns in GHL
3. **Send Alerts** - Notify team via Slack/email
4. **Create Tasks** - Assign manual outreach to team members
5. **Offer Incentives** - Automatically send discount codes

## 📊 Dashboard Integration

To display predictions in your Next.js app, create an API endpoint:

\`\`\`typescript
// app/api/customers/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // Fetch predictions from your database
  const predictions = await fetchChurnPredictions()
  return NextResponse.json(predictions)
}
\`\`\`

## 🔐 Security Best Practices

- Store API keys in environment variables
- Use read-only API keys when possible
- Rotate keys regularly
- Log all API calls for audit trails
- Implement rate limiting

## 📈 Next Steps

1. Test with a small subset of customers first
2. Validate predictions against actual churn
3. Adjust risk thresholds based on your business
4. Build custom retention workflows
5. Track ROI of retention efforts

## 🆘 Support

For issues or questions:
- Check API documentation (Whop, GHL)
- Review error logs in script output
- Test API keys with curl/Postman first
