#!/usr/bin/env python3
"""
Create Embeddings Script

Scans data/images/ subdirectories for site reference images, extracts CLIP feature vectors,
averages vectors per site, and saves the vector database into database/embeddings.pkl.
"""

import sys
import pickle
import argparse
from pathlib import Path

# Add project root directory to python path for imports
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from core.clip_model import load_clip_model
from core.embedding import scan_and_embed_dataset


def main():
    parser = argparse.ArgumentParser(
        description="Generate vector embedding database for heritage sites."
    )
    parser.add_argument(
        "--data-dir",
        type=str,
        default=str(ROOT_DIR / "data" / "images"),
        help="Path to images directory (default: data/images)"
    )
    parser.add_argument(
        "--output-file",
        type=str,
        default=str(ROOT_DIR / "database" / "embeddings.pkl"),
        help="Path to save output embeddings.pkl (default: database/embeddings.pkl)"
    )
    parser.add_argument(
        "--model-name",
        type=str,
        default="ViT-B-32",
        help="CLIP model architecture (default: ViT-B-32)"
    )
    parser.add_argument(
        "--pretrained",
        type=str,
        default="openai",
        help="Pretrained weights name (default: openai)"
    )

    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    output_path = Path(args.output_file)

    if not data_dir.exists():
        print(f"Error: Images directory '{data_dir}' does not exist.")
        sys.exit(1)

    print("==================================================")
    print("      Culture Guide AI - Embedding Generator     ")
    print("==================================================")
    print(f"Data directory: {data_dir}")
    print(f"Output target:  {output_path}\n")

    # 1. Load CLIP Model
    model, preprocess, device = load_clip_model(
        model_name=args.model_name,
        pretrained=args.pretrained
    )

    # 2. Scan and embed dataset
    print("\nScanning dataset folders...")
    database = scan_and_embed_dataset(
        data_dir=data_dir,
        model=model,
        preprocess=preprocess,
        device=device
    )

    if not database:
        print("\nError: No valid site embeddings could be created. Check image directory.")
        sys.exit(1)

    # 3. Save database
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        pickle.dump(database, f)

    print("\n==================================================")
    print(" Embedding Database successfully created!")
    print("==================================================")
    print(f"Saved {len(database)} site profile(s) to: {output_path}")
    for site in database.keys():
        print(f"  • {site}")


if __name__ == "__main__":
    main()
