"""
Minimal RAG-based Autonomous Compliance Agent

This script demonstrates a simple RAG (Retrieval-Augmented Generation) approach
for compliance monitoring using Google Gemini API.

No FastAPI, no database, no vector database, no async - just console output.
"""

import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from app.knowledge import load_company_profile, load_compliance_knowledge

# Load environment variables
load_dotenv()

# Retrieval rules for keyword-based obligation matching
RETRIEVAL_RULES = {
    "breach": "DPDP-004",
    "notify": "DPDP-004",
    "notification": "DPDP-004",
    "consent": "DPDP-001",
    "retention": "DPDP-006",
    "delete": "DPDP-006",
    "deletion": "DPDP-006",
    "erasure": "DPDP-006",
    "access": "DPDP-002",
    "correction": "DPDP-002",
    "rights": "DPDP-002",
    "security": "DPDP-003",
    "safeguard": "DPDP-003",
    "transfer": "DPDP-005",
    "cross-border": "DPDP-005",
}


def retrieve_relevant_obligation(update_text: str, compliance_knowledge: dict) -> dict:
    """
    Simple keyword-based retrieval to find the most relevant obligation.
    
    Args:
        update_text: The regulatory update text
        compliance_knowledge: Loaded compliance knowledge base
        
    Returns:
        The most relevant obligation dictionary
    """
    update_lower = update_text.lower()
    obligations = compliance_knowledge.get("obligations", [])
    
    # Count keyword matches for each obligation
    matches = {}
    for obligation in obligations:
        obligation_id = obligation.get("id")
        match_count = 0
        
        # Check retrieval rules
        for keyword, rule_id in RETRIEVAL_RULES.items():
            if keyword in update_lower and rule_id == obligation_id:
                match_count += 3  # Higher weight for rule matches
        
        # Check obligation title and description
        title = obligation.get("title", "").lower()
        description = obligation.get("description", "").lower()
        category = obligation.get("category", "").lower()
        
        if any(word in update_lower for word in title.split()):
            match_count += 2
        if any(word in update_lower for word in description.split()):
            match_count += 1
        if category in update_lower:
            match_count += 2
        
        if match_count > 0:
            matches[obligation_id] = match_count
    
    # Return obligation with highest match count
    if matches:
        best_match_id = max(matches, key=matches.get)
        for obligation in obligations:
            if obligation.get("id") == best_match_id:
                return obligation
    
    # Default to first obligation if no matches
    return obligations[0] if obligations else {}


def construct_prompt(company_profile: dict, update_text: str, obligation: dict) -> str:
    """
    Construct a structured prompt for Gemini API.
    
    Args:
        company_profile: Company profile data
        update_text: Regulatory update text
        obligation: Retrieved obligation
        
    Returns:
        Formatted prompt string
    """
    prompt = f"""You are an autonomous compliance agent for Indian DPDP regulatory monitoring. Return valid JSON only.

COMPANY PROFILE:
{json.dumps(company_profile, indent=2)}

REGULATORY UPDATE:
{update_text}

RETRIEVED OBLIGATION:
{json.dumps(obligation, indent=2)}

INSTRUCTIONS:
1. Determine if this update is applicable to the company (true/false)
2. Assess risk level: Low, Medium, High, or Critical
3. Generate 2-4 actionable tasks with priorities
4. Assign realistic deadlines in days (Critical=3, High=7, Medium=14, Low=30)
5. Provide short reasoning steps

OUTPUT SCHEMA (JSON only, no markdown, no explanations):
{{
  "applicable": boolean,
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "affected_obligation_id": "{obligation.get('id', '')}",
  "summary": "Brief summary of impact",
  "tasks": [
    {{
      "title": "Task description",
      "priority": "Low" | "Medium" | "High",
      "deadline_days": integer
    }}
  ],
  "reasoning_steps": [
    "Step 1: ...",
    "Step 2: ..."
  ]
}}

Return ONLY the JSON object. No markdown formatting. No additional text."""
    
    return prompt


def call_gemini_api(prompt: str) -> dict:
    """
    Call Google Gemini API with the constructed prompt.
    
    Args:
        prompt: The formatted prompt
        
    Returns:
        Parsed JSON response or raw text if parsing fails
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment variables")
        print("Please set GEMINI_API_KEY in your .env file")
        return {"error": "API key not found"}
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate response
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0,
            )
        )
        
        # Extract text from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        # Parse JSON
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            print("⚠️  Warning: Could not parse JSON response")
            print("Raw response:")
            print(response_text)
            return {"raw_response": response_text}
            
    except Exception as e:
        print(f"❌ Error calling Gemini API: {e}")
        return {"error": str(e)}


def print_separator():
    """Print a visual separator."""
    print("\n" + "=" * 80 + "\n")


def main():
    """Main execution function."""
    print("🤖 RAG-based Autonomous Compliance Agent")
    print_separator()
    
    # Step 1: Load knowledge base
    print("📚 Loading knowledge base...")
    company_profile = load_company_profile()
    compliance_knowledge = load_compliance_knowledge()
    
    if not company_profile or not compliance_knowledge:
        print("❌ Failed to load knowledge base")
        return
    
    print(f"✓ Loaded company profile: {company_profile.get('company_name')}")
    print(f"✓ Loaded {len(compliance_knowledge.get('obligations', []))} obligations")
    print_separator()
    
    # Example regulatory update
    update_text = """
    The Ministry has revised breach reporting timelines. Organizations must now 
    notify authorities within 72 hours of discovering a personal data breach. 
    This replaces the previous 48-hour requirement and applies to all Data 
    Fiduciaries processing personal data of Indian citizens.
    """
    
    print("📰 Regulatory Update:")
    print(update_text.strip())
    print_separator()
    
    # Step 2: Retrieve relevant obligation
    print("🔍 Retrieving relevant obligation...")
    obligation = retrieve_relevant_obligation(update_text, compliance_knowledge)
    
    print("Retrieved Obligation:")
    print(json.dumps(obligation, indent=2))
    print_separator()
    
    # Step 3: Construct prompt
    print("📝 Constructing prompt for Gemini...")
    prompt = construct_prompt(company_profile, update_text, obligation)
    print("✓ Prompt constructed")
    print_separator()
    
    # Step 4: Call Gemini API
    print("🤖 Calling Gemini API...")
    result = call_gemini_api(prompt)
    
    print("Agent Result:")
    print(json.dumps(result, indent=2))
    print_separator()
    
    # Summary
    if "error" not in result and "raw_response" not in result:
        print("✅ Analysis Complete!")
        print(f"   Applicable: {result.get('applicable')}")
        print(f"   Risk Level: {result.get('risk_level')}")
        print(f"   Tasks: {len(result.get('tasks', []))}")
    else:
        print("⚠️  Analysis completed with warnings")
    
    print_separator()


if __name__ == "__main__":
    main()
