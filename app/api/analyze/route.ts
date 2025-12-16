
import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

// Priority list of models to try
const MODELS_TO_TRY = [
  "gemini-flash-latest",
  "gemini-2.0-flash",
  "gemini-pro-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-pro"
];

export async function POST(req: NextRequest) {
  try {
    const { category, city, state, department, description } = await req.json();

    if (!description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `
      You are VoiceMyIssue, an expert AI Grievance Redressal Consultant.
      Your task is to analyze a consumer or civic grievance and provide structured, actionable advice.

      User Input:
      - Category: ${category}
      - Location: ${city}, ${state}
      - Department/Entity: ${department || "Not specified"}
      - Description: "${description}"

      **CRITICAL INSTRUCTION: LANGUAGE MATCHING**
      1. **DETECT the language** of the "Description" field (English, Hindi, or Hinglish).
      2. **GENERATE ALL OUTPUTS** (Analysis, Recommendations, Trade-offs, Drafts, etc.) **IN THAT EXACT SAME LANGUAGE**.
      3. **EXCEPTION**: The 'simplifiedExplanation' field must still provide all 3 versions (En, Hi, Hinglish) as requested below. All other fields must match the user's input language.
      4. If the input is Hinglish, the output must be natural, conversational Hinglish.
      5. If the input is Hindi, use clear, simple Hindi (avoid complex legal Sanskritized Hindi).

      Follow this EXACT 7-step pipeline:

      STEP 1: Understand the grievance
      - Detect the specific type of issue.
      - Extract key entities.
      - Identify intent (Refund, Resolution, Escalation, etc.).
      - **DETECT SEVERITY/URGENCY**: Classify as "Low", "Medium", or "High" based on safety risks, financial loss magnitude, or time sensitivity. Provide a brief reason.

      STEP 2: Generate Action Options (Minimum 3)
      - Provide at least 3 distinct, valid paths (e.g., Internal Complaint, Government Portal, Consumer Court, Social Media Escalation, Ombudsman).
      - For each, list Pros and Cons.

      STEP 3: Compare Options
      - Evaluate based on Efficiency, Authority, Effort, and Suitability.

      STEP 4: Best-Fit Recommendation, Confidence & Empathy
      - Select the SINGLE best option.
      - Explain WHY it is the best for this specific user/situation.
      - **TRADEOFF ANALYSIS**: Briefly explain why other valid options were NOT selected.
      - **CONFIDENCE SCORE**: Assign "Low", "Medium", or "High".
      - **EMPATHETIC PATH**: Write a short section titled "If I were in your situation...". Use first-person ("I would..."), supportive, non-authoritative language. No legal jargon. Focus on reducing anxiety.
      - **SIMPLIFIED EXPLANATION**: Rewrite the recommendation in very simple terms for a non-technical person (e.g. a parent). Provide 3 versions: "en" (English), "hi" (Hindi - Devanagari), "hinglish" (Hindi+English mix).

      STEP 5: Complaint Draft Generation
      - Generate a professional, formal complaint draft.

      STEP 6: Evidence Checklist
      - Generate a specific list of documents.

      STEP 7: Risk Flagging & Submission
      - Identify missing info.
      - Flag weak arguments.
      - Where to submit.

      Output strictly in this JSON format:
      {
        "analysis": {
          "issueType": "string",
          "intent": "string",
          "entities": ["string"],
          "urgency": {
            "level": "Low" | "Medium" | "High",
            "reason": "string"
          }
        },
        "actions": [
          {
            "id": "string",
            "title": "string",
            "description": "string",
            "pros": ["string"],
            "cons": ["string"]
          }
        ],
        "recommendation": {
          "actionId": "string",
          "reason": "string",
          "tradeoffAnalysis": "string",
          "confidence": {
            "level": "Low" | "Medium" | "High",
            "reason": "string"
          },
          "empatheticPath": "string", // "If I were in your situation..." text
          "simplifiedExplanation": {
             "en": "string",
             "hi": "string",
             "hinglish": "string"
          }
        },
        "evidenceChecklist": ["string"],
        "draft": {
          "subject": "string",
          "body": "string"
        },
        "risks": ["string"],
        "submissionGuide": {
          "authorityName": "string",
          "method": "string",
          "timeline": "string",
          "escalation": "string"
        }
      }
    `;

    // Try models in sequence until one works
    let lastError = null;
    let successfulResponse = null;

    for (const modelName of MODELS_TO_TRY) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        successfulResponse = result.response.text();
        console.log(`Success with model: ${modelName}`);
        break; // Stop if successful

      } catch (e: any) {
        console.warn(`Model ${modelName} failed:`, e.message);
        lastError = e;
        // Continue to next model
      }
    }

    if (!successfulResponse) {
      console.error("All models failed. Last error:", lastError);
      return NextResponse.json(
        { error: "AI Service Unavailable. Please check your API usage or region.", details: lastError?.message },
        { status: 503 }
      );
    }

    // Clean and parse
    const cleanText = successfulResponse.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const jsonResponse = JSON.parse(cleanText);
      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error("Failed to parse JSON", cleanText);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
