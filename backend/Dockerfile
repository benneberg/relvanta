FROM python:3.12.10 AS builder

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN python -m venv .venv
COPY requirements.txt ./
RUN .venv/bin/pip install --no-cache-dir -r requirements.txt

FROM python:3.12.10-slim

WORKDIR /app

ENV PORT=8000
ENV PATH="/app/.venv/bin:$PATH"

# Add CA certificates for Mongo TLS
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*


COPY --from=builder /app/.venv /app/.venv
COPY . .

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
