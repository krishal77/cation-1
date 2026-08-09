import torch
import open_clip
from typing import Tuple, Any


def get_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")


def load_clip_model(
    model_name: str = "ViT-B-32",
    pretrained: str = "openai",
    device: torch.device = None
) -> Tuple[Any, Any, torch.device]:
    if device is None:
        device = get_device()

    print(f"Loading CLIP model '{model_name}' ({pretrained}) on device: {device}...")
    model, _, preprocess = open_clip.create_model_and_transforms(
        model_name,
        pretrained=pretrained
    )
    model = model.to(device)
    model.eval()

    return model, preprocess, device

