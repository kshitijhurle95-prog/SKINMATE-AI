import asyncio
import edge_tts
import os

SCRIPT_TEXT = """Welcome to SKINMATE AI, an intelligent personal skincare intelligence and budget shopping platform built for the YouCam Skin AI Hackathon.

Skincare is notoriously confusing, filled with conflicting advice, expensive products, and hidden ingredient clashes. SKINMATE AI bridges clinical facial computer vision directly to affordable, personalized care.

Let us start by switching to our luxury obsidian dark mode. Notice how smoothly the interface transitions to pure black surfaces with crisp white typography and vibrant success green accents. Our spacious top navigation provides one-click access across the entire skincare journey.

Next, let us analyze our skin. We navigate to the AI Facial Skin Scan. Users can either use their live webcam with our auto-capture alignment oval, or upload a clear front-facing photograph. Let us upload our portrait. The YouCam Skin AI REST API asynchronously evaluates up to 16 visible cosmetic metrics from pores to barrier hydration.

Here in the Skin Intelligence Dashboard, our overall health index is calculated at 78 out of 100 with a combination skin profile. We can toggle the YouCam mask visualizer to view localized concern clusters like pores and surface texture right on the face, alongside comprehensive individual metric scores and cosmetic guidance.

Moving to My Routine, SKINMATE AI formulates an essential 3-step morning and evening regimen. Notice the Combinatorial Total Cost: 958 rupees, staying well within our 1,500 rupees budget cap. Our Smart Active Conflict Guard automatically verifies barrier synergy, ensuring no contraindicated actives like retinol and salicylic acid clash in the same step.

In the Smart Skincare Marketplace, we can dynamically filter through verified catalog formulations by budget ceiling or ingredient. Every product is scored deterministically against our diagnostic scan.

Finally, let us open the SKINMATE AI Skincare Concierge. Powered by Groq, our agent answers natural language questions with friendly text, emojis, and interactive action tools. Let us ask: recommend a routine under 1,500 rupees for oily skin. The agent reasons through verified formulations and returns actionable recommendations with 1-click routine approvals.

Understand your skin, shop smarter, and care better with SKINMATE AI. Thank you."""

VOICE = "en-US-AndrewMultilingualNeural"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "../assets/demo-video/voiceover.mp3")

async def main():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    communicate = edge_tts.Communicate(SCRIPT_TEXT, VOICE, rate="-4%")
    await communicate.save(OUTPUT_FILE)
    print(f"Voiceover successfully generated at: {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
