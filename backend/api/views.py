from pathlib import Path

import joblib
import pandas as pd
from rest_framework.response import Response
from rest_framework.views import APIView


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL = joblib.load(MODEL_DIR / "insurance_model.pkl")
SCALER = joblib.load(MODEL_DIR / "scaler.pkl")
MODEL_COLUMNS = joblib.load(MODEL_DIR / "model_columns.pkl")

NUMERIC_COLUMNS = ["age", "bmi", "children"]
CATEGORICAL_COLUMNS = ["sex", "smoker", "region"]
REQUIRED_FIELDS = NUMERIC_COLUMNS + CATEGORICAL_COLUMNS


def prepare_features(payload):
    df = pd.DataFrame([payload])
    df[NUMERIC_COLUMNS] = df[NUMERIC_COLUMNS].apply(pd.to_numeric, errors="coerce")
    scaled_numeric = pd.DataFrame(
        SCALER.transform(df[NUMERIC_COLUMNS]),
        columns=NUMERIC_COLUMNS,
        index=df.index,
    )

    categorical = pd.get_dummies(df[CATEGORICAL_COLUMNS], drop_first=False)
    features = pd.concat([scaled_numeric, categorical], axis=1)
    features = features.reindex(columns=MODEL_COLUMNS, fill_value=0)
    return features


class HealthView(APIView):
    def get(self, request):
        return Response({"status": "ok"})


class PredictView(APIView):
    def post(self, request):
        try:
            payload = request.data
            missing_fields = [field for field in REQUIRED_FIELDS if field not in payload]
            if missing_fields:
                return Response(
                    {"error": f"Missing required field(s): {', '.join(missing_fields)}"},
                    status=400,
                )

            features = prepare_features(payload)
            prediction = MODEL.predict(features)[0]
            return Response({"prediction": float(prediction)})
        except Exception as exc:
            return Response({"error": str(exc)}, status=400)
