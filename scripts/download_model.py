from pathlib import Path
from urllib.request import urlopen

MODEL_URL = "https://github.com/DhairyaChangela/AgriSmart-AI/releases/download/v1.0.0-model/best_model.pth"
EXPECTED_SHA256 = "67BF7F059095F9C6F86A6BE1FAB1BA6F1ECF913EE8F57AD8021187BEADEB5E41"

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = PROJECT_ROOT / "model" / "checkpoints"
MODEL_PATH = MODEL_DIR / "best_model.pth"


def calculate_sha256(path: Path) -> str:
    import hashlib

    sha256 = hashlib.sha256()

    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            sha256.update(chunk)

    return sha256.hexdigest().upper()


def download_model() -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    if MODEL_PATH.exists():
        print(f"Model already exists: {MODEL_PATH}")

        actual_hash = calculate_sha256(MODEL_PATH)

        if actual_hash == EXPECTED_SHA256:
            print("SHA-256 verification passed.")
            print("The existing model is already the expected checkpoint.")
            return

        print("Existing model has an unexpected SHA-256.")
        print("It will be replaced with the release checkpoint.")

    temp_path = MODEL_PATH.with_suffix(".pth.download")

    print("Downloading AgriSmart AI model...")
    print(f"Source: {MODEL_URL}")

    try:
        with urlopen(MODEL_URL) as response, temp_path.open("wb") as file:
            while True:
                chunk = response.read(1024 * 1024)

                if not chunk:
                    break

                file.write(chunk)

        print("Download complete.")
        print("Verifying SHA-256...")

        actual_hash = calculate_sha256(temp_path)

        if actual_hash != EXPECTED_SHA256:
            temp_path.unlink(missing_ok=True)
            raise RuntimeError(
                "SHA-256 verification failed.\n"
                f"Expected: {EXPECTED_SHA256}\n"
                f"Actual:   {actual_hash}"
            )

        temp_path.replace(MODEL_PATH)

        print("SHA-256 verification passed.")
        print(f"Model saved to: {MODEL_PATH}")

    except Exception:
        temp_path.unlink(missing_ok=True)
        raise


if __name__ == "__main__":
    download_model()
