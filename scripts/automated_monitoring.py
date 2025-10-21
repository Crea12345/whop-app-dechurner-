"""
Automated Churn Monitoring
Run this script daily via cron job or scheduler to monitor churn risk
"""

import requests
import json
from datetime import datetime
import os

# Configuration
DECHURNER_API_URL = "https://your-dechurner-app.vercel.app/api/predict"
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL", "")
EMAIL_API_KEY = os.getenv("SENDGRID_API_KEY", "")

def send_slack_alert(high_risk_customers):
    """Send Slack notification for high-risk customers"""
    if not SLACK_WEBHOOK_URL:
        return
    
    message = {
        "text": f"⚠️ *Dechurner Alert*: {len(high_risk_customers)} high-risk customers detected",
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🚨 High Churn Risk Alert"
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*{len(high_risk_customers)} customers* are at high risk of churning:"
                }
            }
        ]
    }
    
    for customer in high_risk_customers[:5]:  # Show top 5
        message["blocks"].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"• *{customer['email']}*: {customer['churn_probability']}% risk"
            }
        })
    
    requests.post(SLACK_WEBHOOK_URL, json=message)

def generate_daily_report(results):
    """Generate daily churn report"""
    total = len(results)
    high_risk = len([r for r in results if r["risk_level"] == "High"])
    medium_risk = len([r for r in results if r["risk_level"] == "Medium"])
    low_risk = len([r for r in results if r["risk_level"] == "Low"])
    
    avg_churn = sum(r["churn_probability"] for r in results) / total if total > 0 else 0
    
    report = f"""
    ╔══════════════════════════════════════════════════════════╗
    ║           DECHURNER DAILY REPORT                         ║
    ║           {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}                        ║
    ╚══════════════════════════════════════════════════════════╝
    
    📊 OVERVIEW
    ─────────────────────────────────────────────────────────
    Total Customers Analyzed:     {total}
    Average Churn Probability:    {avg_churn:.1f}%
    
    🎯 RISK DISTRIBUTION
    ─────────────────────────────────────────────────────────
    🔴 High Risk (≥60%):          {high_risk} ({high_risk/total*100:.1f}%)
    🟡 Medium Risk (30-59%):      {medium_risk} ({medium_risk/total*100:.1f}%)
    🟢 Low Risk (<30%):           {low_risk} ({low_risk/total*100:.1f}%)
    
    ⚠️  ACTION REQUIRED
    ─────────────────────────────────────────────────────────
    """
    
    high_risk_customers = [r for r in results if r["risk_level"] == "High"]
    if high_risk_customers:
        report += f"\n    {len(high_risk_customers)} customers need immediate attention:\n"
        for customer in high_risk_customers[:10]:
            report += f"    • {customer['email']}: {customer['churn_probability']}%\n"
    else:
        report += "    ✓ No high-risk customers detected\n"
    
    return report

def main():
    """Main monitoring function"""
    print("🔄 Running automated churn monitoring...\n")
    
    # Import your integration script
    try:
        from whop_integration import process_whop_customers
        results = process_whop_customers()
    except ImportError:
        print("⚠️  No integration found. Using sample data.")
        results = []
    
    if not results:
        print("❌ No customer data available")
        return
    
    # Generate report
    report = generate_daily_report(results)
    print(report)
    
    # Send alerts for high-risk customers
    high_risk_customers = [r for r in results if r["risk_level"] == "High"]
    if high_risk_customers:
        send_slack_alert(high_risk_customers)
        print(f"\n📬 Slack alert sent for {len(high_risk_customers)} high-risk customers")
    
    # Save historical data
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    with open(f"reports/churn_report_{timestamp}.json", "w") as f:
        json.dump({
            "timestamp": timestamp,
            "results": results,
            "summary": {
                "total": len(results),
                "high_risk": len(high_risk_customers),
                "avg_churn": sum(r["churn_probability"] for r in results) / len(results)
            }
        }, f, indent=2)
    
    print(f"💾 Report saved to reports/churn_report_{timestamp}.json")

if __name__ == "__main__":
    main()
