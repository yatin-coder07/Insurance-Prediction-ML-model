# Insurance Cost Prediction

Minimal full-stack ML app for predicting medical insurance charges with an existing trained model.

## Project structure

```text
insurance-cost-prediction/
├── backend/
│   ├── manage.py
│   ├── insurance_backend/
│   ├── api/
│   ├── models/
│   │   ├── insurance_model.pkl
│   │   ├── scaler.pkl
│   │   └── model_columns.pkl
│   └── requirements.txt
└── frontend/
    └── Next.js app
```

## Backend setup

```bash
cd backend
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

Backend endpoints:

- `GET http://127.0.0.1:8000/api/health/`
- `POST http://127.0.0.1:8000/api/predict/`

Example request body:

```json
{
  "age": 30,
  "sex": "male",
  "bmi": 28.5,
  "children": 1,
  "smoker": "no",
  "region": "southwest"
}
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open the app at:

- `http://localhost:3000`

The frontend sends prediction requests to:

- `http://127.0.0.1:8000/api/predict/`

## Notes

- The app uses the saved files in `backend/models/`.
- No model retraining is needed.
- If the frontend and backend run on different ports, CORS is already enabled in Django for local development.
