"""
Whop Integration for Dechurner
Fetches customer data from Whop and runs churn predictions
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
WHOP_API_KEY = "your_whop_api_key_here"  # Get from https://whop.com/apps
WHOP_BASE_URL = "https://api.whop.com/api/v2"

def get_whop_customers():
    """Fetch all active customers from Whop"""
    headers = {
        "Authorization": f"Bearer {WHOP_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(
        f"{WHOP_BASE_URL}/memberships",
        headers=headers,
        params={"status": "active"}
    )
    
    if response.status_code == 200:
        return response.json()["data"]
    else:
        print(f"Error fetching customers: {response.status_code}")
        return []

def calculate_engagement_metrics(membership):
    """Calculate engagement metrics from Whop membership data"""
    # Parse dates
    created_at = datetime.fromisoformat(membership["created_at"].replace("Z", "+00:00"))
    last_access = datetime.fromisoformat(membership.get("last_access_at", membership["created_at"]).replace("Z", "+00:00"))
    
    # Calculate metrics
    subscription_age = (datetime.now(created_at.tzinfo) - created_at).days / 30  # months
    days_since_last_activity = (datetime.now(last_access.tzinfo) - last_access).days
    
    # Estimate login frequency (you'd track this separately in production)
    login_frequency = max(0, 30 - days_since_last_activity)  # Rough estimate
    
    return {
        "subscription_age": round(subscription_age, 1),
        "days_since_last_activity": days_since_last_activity,
        "login_frequency": login_frequency
    }

def predict_churn(customer_data):
    """
    Dechurner prediction logic (simplified version)
    In production, this would call your Next.js API endpoint
    """
    # Risk factors with weights
    risk_score = 0
    
    # Engagement risks
    if customer_data["login_frequency"] < 5:
        risk_score += 0.3
    if customer_data["days_since_last_activity"] > 14:
        risk_score += 0.25
    if customer_data["content_completion"] < 30:
        risk_score += 0.2
    
    # Payment risks
    if customer_data["failed_payments"] > 0:
        risk_score += 0.4
    if customer_data["payment_method"] == "Bank transfer":
        risk_score += 0.15
    
    # Subscription risks
    if customer_data["subscription_age"] < 2:
        risk_score += 0.1
    if customer_data["contract_type"] == "Monthly":
        risk_score += 0.15
    
    # Support risks
    if customer_data["support_tickets"] > 2:
        risk_score += 0.2
    
    return min(risk_score, 1.0)  # Cap at 100%

def process_whop_customers():
    """Main function to process all Whop customers"""
    customers = get_whop_customers()
    results = []
    
    for membership in customers:
        # Extract customer data
        engagement = calculate_engagement_metrics(membership)
        
        customer_data = {
            "customer_id": membership["id"],
            "email": membership["user"]["email"],
            "subscription_age": engagement["subscription_age"],
            "monthly_charge": membership["plan"]["price"] / 100,  # Convert cents to dollars
            "login_frequency": engagement["login_frequency"],
            "content_completion": 50,  # You'd track this separately
            "failed_payments": membership.get("failed_payment_count", 0),
            "payment_method": membership["payment_processor"],
            "support_tickets": 0,  # You'd track this separately
            "contract_type": "Monthly" if membership["plan"]["billing_period"] == "month" else "Annual",
            "days_since_last_activity": engagement["days_since_last_activity"]
        }
        
        # Calculate churn probability
        churn_probability = predict_churn(customer_data)
        
        results.append({
            "customer_id": customer_data["customer_id"],
            "email": customer_data["email"],
            "churn_probability": round(churn_probability * 100, 1),
            "risk_level": "High" if churn_probability >= 0.6 else "Medium" if churn_probability >= 0.3 else "Low"
        })
    
    return results

# Run the integration
if __name__ == "__main__":
    print("🔄 Fetching customers from Whop...")
    results = process_whop_customers()
    
    print(f"\n✅ Analyzed {len(results)} customers\n")
    print("=" * 60)
    
    # Display high-risk customers
    high_risk = [r for r in results if r["risk_level"] == "High"]
    if high_risk:
        print(f"\n⚠️  HIGH RISK CUSTOMERS ({len(high_risk)}):")
        for customer in high_risk:
            print(f"  • {customer['email']}: {customer['churn_probability']}% churn risk")
    
    # Save results to JSON
    with open("churn_predictions.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to churn_predictions.json")
