from pathlib import Path

import torch
from PIL import Image

try:
    from transformers import CLIPModel, CLIPProcessor

    _TRANSFORMERS_AVAILABLE = True
except ImportError:
    CLIPModel = None
    CLIPProcessor = None
    _TRANSFORMERS_AVAILABLE = False


MODEL_NAME = "openai/clip-vit-base-patch32"

PLANT_PROMPTS = [
    "a clear photograph of a crop plant or leaf",
    "a close-up photograph of a crop leaf",
    "a photograph of an agricultural plant",
]

NON_PLANT_PROMPTS = [
    "a photograph of a human person",
    "a photograph of an animal",
    "a photograph of a building or room",
    "a photograph of a vehicle or machine",
    "a photograph of an object",
    "a photograph of a document or screenshot",
    "a photograph of a landscape or scenery",
]

ALL_PROMPTS = PLANT_PROMPTS + NON_PLANT_PROMPTS


class PlantGate:
    """
    Zero-shot plant/non-plant image gate.

    This is an input safety layer.
    It does NOT diagnose crop diseases.
    """

    MIN_PLANT_SCORE = 0.45
    MIN_MARGIN = 0.10

    def __init__(self):
        if not _TRANSFORMERS_AVAILABLE:
            raise RuntimeError(
                "transformers is not installed; the plant gate cannot run. "
                "Install it with: pip install transformers"
            )

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        print(f"Loading Plant Gate on {self.device}...")

        self.processor = CLIPProcessor.from_pretrained(MODEL_NAME)

        self.model = CLIPModel.from_pretrained(MODEL_NAME)
        self.model.to(self.device)
        self.model.eval()

        print("Plant Gate loaded.")

    def classify(self, image_path: Path):
        if not _TRANSFORMERS_AVAILABLE:
            raise RuntimeError(
                "transformers is not installed; the plant gate cannot run."
            )

        image = Image.open(image_path).convert("RGB")

        inputs = self.processor(
            text=ALL_PROMPTS,
            images=image,
            return_tensors="pt",
            padding=True,
        )

        inputs = {
            key: value.to(self.device)
            for key, value in inputs.items()
        }

        with torch.inference_mode():
            outputs = self.model(**inputs)

            probabilities = torch.softmax(
                outputs.logits_per_image[0],
                dim=0,
            )

        plant_score = float(
            probabilities[:len(PLANT_PROMPTS)].sum().item()
        )

        non_plant_score = float(
            probabilities[len(PLANT_PROMPTS):].sum().item()
        )

        top_index = int(torch.argmax(probabilities).item())
        top_prompt = ALL_PROMPTS[top_index]
        top_score = float(probabilities[top_index].item())

        margin = plant_score - non_plant_score

        accepted = (
            plant_score >= self.MIN_PLANT_SCORE
            and margin >= self.MIN_MARGIN
        )

        return {
            "is_plant": accepted,
            "plant_score": round(plant_score, 4),
            "plant_score_percent": round(plant_score * 100, 2),
            "non_plant_score": round(non_plant_score, 4),
            "non_plant_score_percent": round(
                non_plant_score * 100,
                2,
            ),
            "margin": round(margin, 4),
            "top_category": top_prompt,
            "top_category_score": round(top_score, 4),
        }


_plant_gate = None
_plant_gate_error = None


def get_plant_gate():
    global _plant_gate, _plant_gate_error

    if _plant_gate is None and _plant_gate_error is None:
        try:
            _plant_gate = PlantGate()
        except Exception as exc:
            _plant_gate_error = exc

    if _plant_gate_error is not None:
        return None

    return _plant_gate