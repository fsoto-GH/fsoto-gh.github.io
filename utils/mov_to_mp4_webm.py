"""Convert .mov files to .mp4 and .webm using ffmpeg.

Examples:
    python utils/mov_to_mp4_webm.py ./videos
    python utils/mov_to_mp4_webm.py clip.mov --strip-audio
    python utils/mov_to_mp4_webm.py ./raw --recursive --mp4-crf 20 --webm-crf 30
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Iterable, List


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert .mov files to .mp4 and .webm with ffmpeg.",
    )
    parser.add_argument(
        "sources",
        nargs="+",
        help="One or more .mov files and/or directories containing .mov files.",
    )
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Search directories recursively for .mov files.",
    )
    parser.add_argument(
        "--strip-audio",
        action="store_true",
        help="Remove audio from both MP4 and WebM outputs.",
    )
    parser.add_argument(
        "--strip-audio-mp4",
        action="store_true",
        help="Remove audio from MP4 output only.",
    )
    parser.add_argument(
        "--strip-audio-webm",
        action="store_true",
        help="Remove audio from WebM output only.",
    )
    parser.add_argument(
        "--no-mp4",
        action="store_true",
        help="Skip MP4 output generation.",
    )
    parser.add_argument(
        "--no-webm",
        action="store_true",
        help="Skip WebM output generation.",
    )
    parser.add_argument(
        "--mp4-crf",
        type=int,
        default=23,
        help="CRF for H.264 MP4 (lower = better quality, larger file). Default: 23.",
    )
    parser.add_argument(
        "--webm-crf",
        type=int,
        default=32,
        help="CRF for VP9 WebM (lower = better quality, larger file). Default: 32.",
    )
    parser.add_argument(
        "--preset",
        default="medium",
        choices=[
            "ultrafast",
            "superfast",
            "veryfast",
            "faster",
            "fast",
            "medium",
            "slow",
            "slower",
            "veryslow",
        ],
        help="x264 preset used for MP4. Default: medium.",
    )
    parser.add_argument(
        "--webm-cpu-used",
        type=int,
        default=2,
        choices=range(0, 9),
        metavar="0-8",
        help="VP9 speed/quality tradeoff (0 slowest/best, 8 fastest). Default: 2.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing output files.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print commands without running ffmpeg.",
    )
    return parser.parse_args()


def iter_mov_files(sources: Iterable[str], recursive: bool) -> List[Path]:
    files: list[Path] = []
    for src in sources:
        path = Path(src)
        if path.is_file():
            if path.suffix.lower() == ".mov":
                files.append(path)
            continue
        if path.is_dir():
            pattern = "**/*.mov" if recursive else "*.mov"
            files.extend(path.glob(pattern))
    # Remove duplicates while preserving order.
    seen: set[Path] = set()
    deduped: list[Path] = []
    for f in files:
        resolved = f.resolve()
        if resolved not in seen:
            seen.add(resolved)
            deduped.append(f)
    return deduped


def run_command(cmd: list[str], dry_run: bool) -> int:
    print(" ".join(f'"{c}"' if " " in c else c for c in cmd))
    if dry_run:
        return 0
    proc = subprocess.run(cmd, check=False)
    return proc.returncode


def mp4_command(
    src: Path,
    dst: Path,
    overwrite: bool,
    strip_audio: bool,
    crf: int,
    preset: str,
) -> list[str]:
    cmd = [
        "ffmpeg",
        "-y" if overwrite else "-n",
        "-i",
        str(src),
        "-c:v",
        "libx264",
        "-preset",
        preset,
        "-crf",
        str(crf),
        "-movflags",
        "+faststart",
    ]
    if strip_audio:
        cmd.append("-an")
    else:
        cmd.extend(["-c:a", "aac", "-b:a", "160k"])
    cmd.append(str(dst))
    return cmd


def webm_command(
    src: Path,
    dst: Path,
    overwrite: bool,
    strip_audio: bool,
    crf: int,
    cpu_used: int,
) -> list[str]:
    cmd = [
        "ffmpeg",
        "-y" if overwrite else "-n",
        "-i",
        str(src),
        "-c:v",
        "libvpx-vp9",
        "-b:v",
        "0",
        "-crf",
        str(crf),
        "-row-mt",
        "1",
        "-cpu-used",
        str(cpu_used),
        "-deadline",
        "good",
    ]
    if strip_audio:
        cmd.append("-an")
    else:
        cmd.extend(["-c:a", "libopus", "-b:a", "128k"])
    cmd.append(str(dst))
    return cmd


def main() -> int:
    args = parse_args()

    if args.no_mp4 and args.no_webm:
        print("Error: both --no-mp4 and --no-webm were set; nothing to do.", file=sys.stderr)
        return 2

    if shutil.which("ffmpeg") is None:
        print("Error: ffmpeg was not found in PATH.", file=sys.stderr)
        return 127

    mov_files = iter_mov_files(args.sources, args.recursive)
    if not mov_files:
        print("No .mov files found in the provided sources.")
        return 1

    strip_mp4 = args.strip_audio or args.strip_audio_mp4
    strip_webm = args.strip_audio or args.strip_audio_webm

    total = len(mov_files)
    failures = 0
    print(f"Found {total} .mov file(s).")

    for idx, src in enumerate(mov_files, start=1):
        print(f"\n[{idx}/{total}] Processing: {src}")
        stem = src.with_suffix("")

        if not args.no_mp4:
            out_mp4 = stem.with_suffix(".mp4")
            cmd = mp4_command(
                src=src,
                dst=out_mp4,
                overwrite=args.overwrite,
                strip_audio=strip_mp4,
                crf=args.mp4_crf,
                preset=args.preset,
            )
            rc = run_command(cmd, args.dry_run)
            if rc != 0:
                print(f"MP4 conversion failed: {src}", file=sys.stderr)
                failures += 1

        if not args.no_webm:
            out_webm = stem.with_suffix(".webm")
            cmd = webm_command(
                src=src,
                dst=out_webm,
                overwrite=args.overwrite,
                strip_audio=strip_webm,
                crf=args.webm_crf,
                cpu_used=args.webm_cpu_used,
            )
            rc = run_command(cmd, args.dry_run)
            if rc != 0:
                print(f"WebM conversion failed: {src}", file=sys.stderr)
                failures += 1

    if failures:
        print(f"\nCompleted with {failures} failed conversion step(s).", file=sys.stderr)
        return 1

    print("\nConversion complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())