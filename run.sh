#!/usr/bin/env bash
# PAIMANA one-command launcher (Linux/macOS).
set -e
cd "$(dirname "$0")"

echo "== PAIMANA launcher =="

if [ ! -f data/paimana_panel.csv ]; then
  echo "[data] building panel from parsed source CSVs..."
  (cd data_pipeline && python3 build_dataset.py)
fi

if ! python3 -c "import fastapi, catboost, lifelines, shap" 2>/dev/null; then
  echo "[setup] installing backend dependencies..."
  pip install -q -r backend/requirements.txt
fi

# retrain if models are missing OR not loadable with the installed versions
if [ ! -f backend/artifacts/models.joblib ] || ! (cd backend && \
    python3 -c "import joblib; joblib.load('artifacts/models.joblib')" >/dev/null 2>&1); then
  echo "[ml] training pipeline (~1 min)..."
  (cd backend && python3 -m app.ml.pipeline)
fi

if [ ! -f backend/app/static/index.html ]; then
  echo "[frontend] building React app..."
  (cd frontend && npm install --no-audit --no-fund && npm run build)
fi

echo
echo "== PAIMANA ready: http://localhost:8000 =="
cd backend && python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
