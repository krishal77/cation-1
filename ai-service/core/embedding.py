"""
Embedding Module for AI Service
"""

import os
from pathlib import Path
from io import BytesIO
import torch
from PIL import Image
from typing import Dict, List, Union, Any


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}


def embed_image(
    model: torch.nn.Module,
    preprocess: Any,
    image_input: Union[str, Path, Image.Image, bytes],
    device: torch.device
) -> torch.Tensor:
    """
    Extracts L2-normalized CLIP feature vector for a given image.

    Args:
        model: Loaded CLIP model
        preprocess: Image transform pipeline
        image_input: Path to image file, PIL Image instance, or image bytes
        device: Torch device

    Returns:
        L2-normalized feature Tensor of shape (1, D)
    """
    if isinstance(image_input, (str, Path)):
        image_path = Path(image_input)
        if not image_path.exists():
            raise FileNotFoundError(f"Image not found at path: {image_path}")
        try:
            image = Image.open(image_path).convert("RGB")
        except Exception as e:
            raise ValueError(f"Failed to load image at {image_path}: {e}")
    elif isinstance(image_input, bytes):
        try:
            image = Image.open(BytesIO(image_input)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Failed to decode image bytes: {e}")
    elif isinstance(image_input, Image.Image):
        image = image_input.convert("RGB")
    else:
        raise TypeError("image_input must be a file path, Path, bytes, or PIL Image instance")

    image_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        features = model.encode_image(image_tensor)
        features = features / features.norm(dim=-1, keepdim=True)

    return features


def create_site_embedding(
    model: torch.nn.Module,
    preprocess: Any,
    image_paths: List[Union[str, Path]],
    device: torch.device
) -> torch.Tensor:
    """
    Generates an averaged and re-normalized embedding vector for multiple reference images of a single site.
    """
    if not image_paths:
        raise ValueError("Cannot create site embedding from empty image list.")

    vectors = []
    for path in image_paths:
        try:
            vec = embed_image(model, preprocess, path, device)
            vectors.append(vec)
        except Exception as err:
            print(f"  [Warning] Skipping image {path}: {err}")

    if not vectors:
        raise RuntimeError("No valid images could be processed for site embedding.")

    stacked = torch.cat(vectors, dim=0)
    averaged = stacked.mean(dim=0, keepdim=True)
    averaged = averaged / averaged.norm(dim=-1, keepdim=True)

    return averaged


def scan_and_embed_dataset(
    data_dir: Union[str, Path],
    model: torch.nn.Module,
    preprocess: Any,
    device: torch.device
) -> Dict[str, torch.Tensor]:
    """
    Scans data directory where each subfolder corresponds to a site name.
    """
    base_path = Path(data_dir)
    if not base_path.exists() or not base_path.is_dir():
        raise FileNotFoundError(f"Data directory '{data_dir}' does not exist or is not a directory.")

    database: Dict[str, torch.Tensor] = {}

    subdirs = [d for d in base_path.iterdir() if d.is_dir()]
    if not subdirs:
        print(f"[Warning] No site subdirectories found under {base_path}")
        return database

    for site_folder in sorted(subdirs):
        raw_name = site_folder.name
        display_name = raw_name.replace("_", " ").strip()

        image_files = [
            p for p in site_folder.iterdir()
            if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
        ]

        if not image_files:
            print(f"Skipping '{display_name}': No supported images found.")
            continue

        print(f"Processing '{display_name}' ({len(image_files)} image(s))...")
        try:
            site_vector = create_site_embedding(model, preprocess, image_files, device)
            database[display_name] = site_vector
        except Exception as e:
            print(f"Error creating embedding for '{display_name}': {e}")

    return database
