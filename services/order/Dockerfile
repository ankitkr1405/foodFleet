FROM python:3.10-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "python initdb.py && uvicorn app:app --host 0.0.0.0 --port 8002"]
