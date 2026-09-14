import argparse

from model.plant_gate import plant_gate


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--image",
        required=True,
        help="Path to image",
    )

    args = parser.parse_args()

    result = plant_gate.classify(args.image)

    print("=" * 60)
    print("AgriSmart AI - Plant Gate")
    print("=" * 60)

    for key, value in result.items():
        print(f"{key}: {value}")

    print("=" * 60)


if __name__ == "__main__":
    main()