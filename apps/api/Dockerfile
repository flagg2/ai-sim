# Stage 1: Build dependencies
FROM python:3.11-slim as builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /build/wheels -r requirements.txt

# Stage 2: Final runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy wheels from builder stage
COPY --from=builder /build/wheels /wheels

# Install Python packages from wheels
RUN pip install --no-cache-dir /wheels/*

# Clean up wheels
RUN rm -rf /wheels

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]