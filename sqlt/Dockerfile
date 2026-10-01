# Use official Python image
FROM python:3.11

# Set working directory
WORKDIR /app

# Copy FastAPI app
COPY main.py .

# Install dependencies
RUN pip install fastapi uvicorn

# Expose port
EXPOSE 8000

# Start FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
