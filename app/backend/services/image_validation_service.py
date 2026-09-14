from pathlib import Path

from PIL import Image, ImageStat

from model.plant_gate import plant_gate


class ImageValidationService:
    """
    Multi-stage image validation before disease classification.

    Checks:
    1. File/image integrity
    2. Reasonable image dimensions
    3. Basic image quality
    4. Plant/non-plant classification
    """

    ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

    MIN_WIDTH = 100
    MIN_HEIGHT = 100

    def validate_file(self, image_path: Path):
        if not image_path.exists():
            return self._reject(
                "image_not_found",
                "The uploaded image could not be found.",
            )

        if image_path.suffix.lower() not in self.ALLOWED_EXTENSIONS:
            return self._reject(
                "unsupported_format",
                "Please upload a JPG, JPEG, PNG, or WEBP image.",
            )

        try:
            with Image.open(image_path) as image:
                image.verify()

            with Image.open(image_path) as image:
                image = image.convert("RGB")

                width, height = image.size

                if width < self.MIN_WIDTH or height < self.MIN_HEIGHT:
                    return self._reject(
                        "image_too_small",
                        "Please upload a clearer, higher-resolution crop or leaf image.",
                    )

                if self._is_extremely_dark_or_bright(image):
                    return self._reject(
                        "poor_image_quality",
                        "The image is too dark or too bright. Please upload a clearer crop or leaf photo.",
                    )

                # --------------------------------------------------
                # Plant / Non-Plant Gate
                # --------------------------------------------------

                gate_result = plant_gate.classify(image_path)

                if not gate_result["is_plant"]:
                    return self._reject(
                        "not_crop",
                        "Please upload a clear image of a crop, plant, or leaf.",
                        details={
                            "plant_score_percent": gate_result[
                                "plant_score_percent"
                            ],
                            "non_plant_score_percent": gate_result[
                                "non_plant_score_percent"
                            ],
                        },
                    )

                return self._accept()

        except Exception as exc:
            print(f"Image validation error: {exc}")

            return self._reject(
                "invalid_image",
                "The uploaded file is not a valid readable image.",
            )

    @staticmethod
    def _is_extremely_dark_or_bright(image: Image.Image) -> bool:
        stat = ImageStat.Stat(image)
        brightness = sum(stat.mean) / 3

        return brightness < 8 or brightness > 248

    @staticmethod
    def _accept():
        return {
            "valid": True,
            "status": "accepted",
        }

    @staticmethod
    def _reject(reason, message, details=None):
        result = {
            "valid": False,
            "status": "rejected",
            "reason": reason,
            "message": message,
        }

        if details:
            result["details"] = details

        return result


image_validation_service = ImageValidationService()