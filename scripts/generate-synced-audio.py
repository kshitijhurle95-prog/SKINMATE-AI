import asyncio
import edge_tts
import os
import json
import subprocess

SECTIONS = [
    {
        "id": "1_login",
        "text": "Welcome to SKINMATE AI, an intelligent personal skincare intelligence and budget shopping platform built for the YouCam Skin AI Hackathon. First, let us sign in to our personalized skincare space.",
    },
    {
        "id": "2_darkmode",
        "text": "Skincare is confusing, filled with conflicting advice and expensive products. Let us switch to our luxury obsidian dark mode. Notice how smoothly the interface transitions to pure black surfaces with crisp white typography and vibrant success green accents.",
    },
    {
        "id": "3_scan",
        "text": "Next, let us analyze our skin with the AI Facial Skin Scan. Users can use their webcam or upload a clear front-facing photograph. Let us upload our portrait. The YouCam Skin AI REST API asynchronously evaluates up to 16 visible cosmetic metrics from pores to barrier hydration.",
    },
    {
        "id": "4_dashboard",
        "text": "Here in the Skin Intelligence Dashboard, our overall health index is calculated at 78 out of 100. We can toggle the YouCam mask visualizer to view localized concern clusters like visible pores and surface texture directly on the face, alongside cosmetic next steps.",
    },
    {
        "id": "5_routine",
        "text": "Moving to My Routine, SKINMATE AI formulates an essential 3-step morning and evening regimen. Notice the Combinatorial Total Cost: 958 rupees, staying well within our 1,500 rupees budget cap. Our Smart Active Conflict Guard automatically verifies barrier synergy.",
    },
    {
        "id": "6_marketplace",
        "text": "In the Smart Skincare Marketplace, we can dynamically filter through verified catalog formulations by budget ceiling or category. Every product is scored deterministically against our diagnostic scan to prevent wasted spending.",
    },
    {
        "id": "7_chatbot",
        "text": "Finally, let us open the SKINMATE AI Skincare Concierge. Powered by Groq, our agent answers natural language questions with friendly text, emojis, and interactive action tools. Let us ask for a routine under 1,500 rupees. The agent reasons through verified formulations and proposes 1-click routine updates.",
    },
    {
        "id": "8_outro",
        "text": "Understand your skin, shop smarter, and care better with SKINMATE AI. Built with precision for the YouCam Skin AI Hackathon. Thank you.",
    },
]

VOICE = "en-US-AndrewMultilingualNeural"
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "../assets/demo-video/audio_sections")

async def generate():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    timing_data = {}
    file_list = []

    for sec in SECTIONS:
        filename = f"{sec['id']}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)
        communicate = edge_tts.Communicate(sec["text"], VOICE, rate="-2%")
        await communicate.save(filepath)
        
        # Get duration using ffprobe
        cmd = [
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", filepath
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True)
        duration_sec = float(res.stdout.strip())
        timing_data[sec["id"]] = {
            "durationSec": duration_sec,
            "durationMs": int(duration_sec * 1000)
        }
        file_list.append(filepath)
        print(f"Generated {sec['id']}: {duration_sec:.2f}s")

    # Concatenate all into full voiceover
    concat_list_file = os.path.join(AUDIO_DIR, "concat.txt")
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for fp in file_list:
            f.write(f"file '{os.path.abspath(fp).replace(os.sep, '/')}'\n")

    full_audio = os.path.join(os.path.dirname(__file__), "../assets/demo-video/voiceover-synced.mp3")
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_file, "-c", "copy", full_audio
    ]
    subprocess.run(concat_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"Full synchronized voiceover saved to: {full_audio}")

    json_path = os.path.join(os.path.dirname(__file__), "../assets/demo-video/timings.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(timing_data, f, indent=2)
    print(f"Timings saved to: {json_path}")

if __name__ == "__main__":
    asyncio.run(generate())
