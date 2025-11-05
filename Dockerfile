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
RUN pip install --no-cache-dir torch==1.13.1

# PyTorch関連のパッケージをインストール
RUN pip install --no-cache-dir torch-scatter==2.1.0 torch-sparse==0.6.16 torch-cluster==1.6.0 torch-geometric==2.2.0

# 残りの依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー
COPY . .

# デフォルトでbashを起動
CMD ["bash"]
