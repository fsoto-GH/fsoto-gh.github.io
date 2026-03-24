"""
gpx_to_entry.py — Generate an ACTIVITIES_DATA entry from a GPX file.

Usage:
    python gpx_to_entry.py <path_to_gpx> [--all-points]

Arguments:
    path_to_gpx     Path to your .gpx file
    --all-points    Use all points for every tier (good for small files or
                    routes with large geographic span). Omit to auto-sample
                    into overview (~50), mid (~200), and full (~800) tiers.

Output:
    Prints the JS entry to stdout so you can copy-paste into activities-data.js.
    Also prints a summary of point counts to stderr.

Examples:
    python gpx_to_entry.py ~/Downloads/Mishigami.gpx
    python gpx_to_entry.py ~/Downloads/Everest.gpx --all-points
"""

import re
import sys
import os

gpx_path = r"S:\Downloads\First_Everest_ (1).gpx"
use_all_points = True

if not os.path.exists(gpx_path):
    print(f"Error: file not found: {gpx_path}", file=sys.stderr)
    sys.exit(1)

# ── Parse GPX ─────────────────────────────────────────────────────────────

with open(gpx_path, "r", encoding="utf-8") as f:
    content = f.read()

# Try standard format (lat/lon attributes in order lat then lon)
points = re.findall(r'trkpt lat="([^"]+)" lon="([^"]+)"', content)

# Fall back to Garmin format (lon before lat)
if not points:
    raw = re.findall(r'trkpt lon="([^"]+)" lat="([^"]+)"', content)
    points = [(p[1], p[0]) for p in raw]

if not points:
    print("Error: no track points found in GPX file.", file=sys.stderr)
    sys.exit(1)

full = [[float(p[0]), float(p[1])] for p in points]
total = len(full)

# ── Generate tiers ─────────────────────────────────────────────────────────

if use_all_points:
    t_overview = full
    t_mid = full
    t_full = full
    print(f"Using all {total} points for all tiers.", file=sys.stderr)
else:
    step_overview = max(1, total // 50)
    step_mid = max(1, total // 200)
    step_full = max(1, total // 800)
    t_overview = full[::step_overview]
    t_mid = full[::step_mid]
    t_full = full[::step_full]
    print(f"Sampled — overview: {len(t_overview)}, mid: {len(t_mid)}, full: {len(t_full)} (from {total} total)",
          file=sys.stderr)


def fmt(arr):
    return "[" + ",".join(f"[{p[0]},{p[1]}]" for p in arr) + "]"


# ── Derive a default ID from the filename ──────────────────────────────────

basename = os.path.splitext(os.path.basename(gpx_path))[0]
# lowercase, replace spaces/underscores/hyphens with single hyphen
activity_id = re.sub(r"[\s_]+", "-", basename.lower())
activity_id = re.sub(r"-+", "-", activity_id).strip("-")

# ── Print entry ────────────────────────────────────────────────────────────

entry = f"""  "{activity_id}": {{
    name: "YOUR NAME",
    stravaUrl: "https://www.strava.com/activities/YOUR_ACTIVITY_ID",
    tags: [
      // cls options: accomplishment-tag-cycling | accomplishment-tag-run | accomplishment-tag-race
      {{ label: "cycling", cls: "accomplishment-tag-cycling" }},
    ],
    color: "#1D9E75",       // teal=cycling, blue=#378ADD running, red=#A32D2D race
    mapBg: "#0b2e22",       // dark teal=cycling, #0a1a2a=running, #0d0a0a=race
    startColor: "#5DCAA5",  // teal=cycling, #60a5fa=running, #FC4C02=race
    actStats: [
      {{ val: "YOUR VAL", label: "distance"     }},
      {{ val: "YOUR VAL", label: "elapsed time" }},
      {{ val: "YOUR VAL", label: "avg pace"     }},
    ],
    points: {{
      overview: {fmt(t_overview)},
      mid:      {fmt(t_mid)},
      full:     {fmt(t_full)},
    }},
  }},"""

print(entry)
