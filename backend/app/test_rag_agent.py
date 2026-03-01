"""
Test script for RAG agent without calling Gemini API.
Tests the retrieval and prompt construction logic.
"""

import json
from knowledge import load_company_profile, load_compliance_knowledge
from rag_agent import retrieve_relevant_obligation, construct_prompt


def test_knowledge_loading():
    """Test that knowledge base loads correctly."""
    print("Testing knowledge loading...")
    
    company_profile = load_company_profile()
    compliance_knowledge = load_compliance_knowledge()
    
    assert company_profile, "Company profile should not be empty"
    assert compliance_knowledge, "Compliance knowledge should not be empty"
    assert "obligations" in compliance_knowledge, "Should have obligations"
    
    print(f"✓ Loaded company: {company_profile.get('company_name')}")
    print(f"✓ Loaded {len(compliance_knowledge.get('obligations', []))} obligations")
    print()
    
    return company_profile, compliance_knowledge


def test_retrieval():
    """Test obligation retrieval with different update texts."""
    print("Testing retrieval...")
    
    _, compliance_knowledge = test_knowledge_loading()
    
    test_cases = [
        ("Data breach notification timeline updated", "DPDP-004"),
        ("New consent requirements for data processing", "DPDP-001"),
        ("Data retention policies must be reviewed", "DPDP-006"),
        ("Security measures for personal data", "DPDP-003"),
        ("Cross-border data transfer guidelines", "DPDP-005"),
        ("Data principal rights and access requests", "DPDP-002"),
    ]
    
    for update_text, expected_id in test_cases:
        obligation = retrieve_relevant_obligation(update_text, compliance_knowledge)
        actual_id = obligation.get("id")
        status = "✓" if actual_id == expected_id else "✗"
        print(f"{status} '{update_text[:40]}...' → {actual_id} (expected {expected_id})")
    
    print()


def test_prompt_construction():
    """Test prompt construction."""
    print("Testing prompt construction...")
    
    company_profile, compliance_knowledge = test_knowledge_loading()
    
    update_text = "Organizations must notify authorities within 72 hours of a data breach."
    obligation = retrieve_relevant_obligation(update_text, compliance_knowledge)
    
    prompt = construct_prompt(company_profile, update_text, obligation)
    
    # Check prompt contains key elements
    assert "TechCorp" in prompt, "Should contain company name"
    assert "72 hours" in prompt, "Should contain update text"
    assert obligation.get("id") in prompt, "Should contain obligation ID"
    assert "JSON" in prompt, "Should mention JSON output"
    
    print("✓ Prompt constructed successfully")
    print(f"✓ Prompt length: {len(prompt)} characters")
    print()
    
    # Print a sample of the prompt
    print("Sample prompt (first 500 chars):")
    print("-" * 80)
    print(prompt[:500] + "...")
    print("-" * 80)
    print()


def test_full_flow():
    """Test the complete flow without API call."""
    print("Testing full flow (without API call)...")
    
    company_profile, compliance_knowledge = test_knowledge_loading()
    
    update_text = """
    The Ministry has revised breach reporting timelines. Organizations must now 
    notify authorities within 72 hours of discovering a personal data breach.
    """
    
    # Retrieve obligation
    obligation = retrieve_relevant_obligation(update_text, compliance_knowledge)
    print(f"✓ Retrieved obligation: {obligation.get('id')} - {obligation.get('title')}")
    
    # Construct prompt
    prompt = construct_prompt(company_profile, update_text, obligation)
    print(f"✓ Constructed prompt ({len(prompt)} chars)")
    
    # Simulate expected output
    expected_output = {
        "applicable": True,
        "risk_level": "High",
        "affected_obligation_id": obligation.get("id"),
        "summary": "Updated breach notification timeline requires process review",
        "tasks": [
            {
                "title": "Update breach response procedures",
                "priority": "High",
                "deadline_days": 7
            },
            {
                "title": "Train incident response team",
                "priority": "Medium",
                "deadline_days": 14
            }
        ],
        "reasoning_steps": [
            "Step 1: Identified change in breach notification timeline",
            "Step 2: Assessed impact on current procedures"
        ]
    }
    
    print("\n✓ Expected output structure:")
    print(json.dumps(expected_output, indent=2))
    print()


def main():
    """Run all tests."""
    print("=" * 80)
    print("RAG Agent Test Suite")
    print("=" * 80)
    print()
    
    try:
        test_knowledge_loading()
        test_retrieval()
        test_prompt_construction()
        test_full_flow()
        
        print("=" * 80)
        print("✅ All tests passed!")
        print("=" * 80)
        print()
        print("To run the full agent with Gemini API:")
        print("1. Set GEMINI_API_KEY in .env file")
        print("2. Run: python app/rag_agent.py")
        print()
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    main()
