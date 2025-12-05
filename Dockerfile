FROM python:3.13-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Install PyTorch
RUN pip install --default-timeout=0 --no-cache-dir "torch>=2.9.0" --index-url https://download.pytorch.org/whl/cpu

# Install PyTorch Geometric and dependencies
RUN pip install --default-timeout=0 --no-cache-dir --no-build-isolation \
    torch-scatter \
    torch-sparse \
    torch-cluster \
    torch-geometric

# Install remaining dependencies
COPY requirements.txt .
RUN pip install --default-timeout=0 --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Default command
CMD ["bash"]