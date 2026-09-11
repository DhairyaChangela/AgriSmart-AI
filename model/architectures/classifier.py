import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights


class PlantDiseaseClassifier(nn.Module):
    def __init__(self, num_classes: int, pretrained: bool = True):
        super().__init__()

        weights = EfficientNet_B0_Weights.DEFAULT if pretrained else None

        self.model = efficientnet_b0(weights=weights)

        # Replace the original classifier
        input_features = self.model.classifier[1].in_features

        self.model.classifier[1] = nn.Linear(
            input_features,
            num_classes
        )

    def forward(self, x):
        return self.model(x)


def create_model(num_classes: int, pretrained: bool = True):
    return PlantDiseaseClassifier(
        num_classes=num_classes,
        pretrained=pretrained
    )
