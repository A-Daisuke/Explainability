FROM python:3.10-slim

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# まずPyTorchをインストール
RUN pip install --default-timeout=0 --no-cache-dir torch==2.0.1 --index-url https://download.pytorch.org/whl/cpu

# PyTorch関連のパッケージをインストール
RUN pip install --default-timeout=0 --no-cache-dir \
    torch-scatter \
    torch-sparse \
    torch-cluster \
    torch-geometric \
    -f https://data.pyg.org/whl/torch-2.1.0+cpu.html

# 残りの依存関係をインストール
COPY requirements.txt .
RUN pip install --default-timeout=0 --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー
COPY . .

# デフォルトでbashを起動
CMD ["bash"]
