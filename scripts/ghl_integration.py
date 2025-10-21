"""
GoHighLevel (GHL) Integration for Dechurner
Fetches contact data from GHL and runs churn predictions
"""

import requests
import json
from datetime import datetime, timedelta

# Configuration
GHL_API_KEY = "your_ghl_api_key_here"  # Get from GHL Settings > API
GHL_LOCATION_ID = "your_location_id_here"
GHL_BASE_URL = "https://rest.gohighlevel.com/v1"

def get_ghl_contacts():
    """Fetch all contacts from GoHighLevel"""
    headers = {
        "Authorization": f"Bearer {GHL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(
        f"{GHL_BASE_URL}/contacts",
        headers=headers,
        params={"locationId": GHL_LOCATION_ID}
    )
    
    if response.status_code == 200:
        return response.json()["contacts"]
    else:
        print(f"Error fetching contacts: {response.status_code}")
        return []

def update_ghl_contact_tags(contact_id, churn_risk):
    """Add churn risk tags to GHL contact"""
    headers = {
        "Authorization": f"Bearer {GHL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Remove old churn tags
    old_tags = ["churn-risk-low", "churn-risk-medium", "churn-risk-high"]
    new_tag = f"churn-risk-{churn_risk.lower()}"
    
    response = requests.put(
        f"{GHL_BASE_URL}/contacts/{contact_id}",
        headers=headers,
        json={
            "tags": [new_tag],
            "customFields": [
                {
                    "key": "churn_probability",
                    "value": str(churn_risk)
                }
            ]
        }
    )
    
    return response.status_code == 200

def extract_customer_metrics(contact):
    """Extract Dechurner metrics from GHL contact data"""
    custom_fields = {cf["key"]: cf["value"] for cf in contact.get("customField", [])}
    
    # Parse subscription date
    subscription_date = custom_fields.get("subscription_start_date")
    if subscription_date:
        sub_date = datetime.fromisoformat(subscription_date)
        subscription_age = (datetime.now() - sub_date).days / 30
    else:
        subscription_age = 1  # Default
    
    # Parse last activity
    last_activity = contact.get("lastActivity")
    if last_activity:
        last_act_date = datetime.fromisoformat(last_activity)
        days_since_last_activity = (datetime.now() - last_act_date).days
    else:
        days_since_last_activity = 30  # Default
    
    return {
        "subscription_age": round(subscription_age, 1),
        "monthly_charge": float(custom_fields.get("monthly_charge", 50)),
        "login_frequency": int(custom_fields.get("login_frequency_30d", 10)),
        "content_completion": float(custom_fields.get("content_completion_rate", 50)),
        "failed_payments": int(custom_fields.get("failed_payments", 0)),
        "payment_method": custom_fields.get("payment_method", "Credit card"),
        "support_tickets": int(custom_fields.get("support_tickets_90d", 0)),
        "contract_type": custom_fields.get("contract_type", "Monthly"),
        "days_since_last_activity": days_since_last_activity
    }

def predict_churn(customer_data):
    """Dechurner prediction logic"""
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
    
    return min(risk_score, 1.0)

def trigger_retention_workflow(contact_id, churn_probability):
    """Trigger GHL workflow for high-risk customers"""
    if churn_probability >= 0.6:
        headers = {
            "Authorization": f"Bearer {GHL_API_KEY}",
            "Content-Type": "application/json"
        }
        
        # Add to retention campaign workflow
        response = requests.post(
            f"{GHL_BASE_URL}/workflows/trigger",
            headers=headers,
            json={
                "workflowId": "your_retention_workflow_id",
                "contactId": contact_id
            }
        )
        
        return response.status_code == 200
    return False

def process_ghl_contacts():
    """Main function to process all GHL contacts"""
    contacts = get_ghl_contacts()
    results = []
    
    for contact in contacts:
        # Skip contacts without active subscriptions
        if not contact.get("tags") or "active-subscriber" not in contact.get("tags", []):
            continue
        
        # Extract customer data
        customer_data = extract_customer_metrics(contact)
        customer_data["customer_id"] = contact["id"]
        customer_data["email"] = contact["email"]
        
        # Calculate churn probability
        churn_probability = predict_churn(customer_data)
        risk_level = "High" if churn_probability >= 0.6 else "Medium" if churn_probability >= 0.3 else "Low"
        
        # Update GHL with churn risk
        update_ghl_contact_tags(contact["id"], risk_level)
        
        # Trigger retention workflow for high-risk customers
        if churn_probability >= 0.6:
            trigger_retention_workflow(contact["id"], churn_probability)
        
        results.append({
            "customer_id": customer_data["customer_id"],
            "email": customer_data["email"],
            "churn_probability": round(churn_probability * 100, 1),
            "risk_level": risk_level,
            "retention_triggered": churn_probability >= 0.6
        })
    
    return results

# Run the integration
if __name__ == "__main__":
    print("🔄 Fetching contacts from GoHighLevel...")
    results = process_ghl_contacts()
    
    print(f"\n✅ Analyzed {len(results)} active subscribers\n")
    print("=" * 60)
    
    # Display high-risk customers
    high_risk = [r for r in results if r["risk_level"] == "High"]
    if high_risk:
        print(f"\n⚠️  HIGH RISK CUSTOMERS ({len(high_risk)}):")
        for customer in high_risk:
            workflow_status = "✓ Retention workflow triggered" if customer["retention_triggered"] else ""
            print(f"  • {customer['email']}: {customer['churn_probability']}% {workflow_status}")
    
    # Save results
    with open("ghl_churn_predictions.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to ghl_churn_predictions.json")
    print(f"🏷️  Tags updated in GoHighLevel")
    print(f"🔔 Retention workflows triggered for {len(high_risk)} high-risk customers")
