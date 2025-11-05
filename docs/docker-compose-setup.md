# Docker Compose セットアップガイド

このドキュメントでは、Explainability プロジェクトを Docker Compose で実行するための設定と、発生したエラーの解決方法について説明します。

## 使用方法

### 基本的な実行

```bash
# イメージをビルドして実行
docker compose build

# バックグラウンドで実行
docker compose up -d

# 停止
docker compose down
```

### コンテナ内での作業

```bash
# コンテナ内でシェルを開く
docker compose exec explainability-app bash

# 直接コマンドを実行
docker compose run explainability-app python -m explanation.explaining_subgraphx

#コンテナを閉じる
exit
```

### 結果をコンテナから取り出す

```bash
#CSVファイル（統計結果）の取り出し
docker cp explainability-container:/app/statistics_readable.csv .

#Readable/Neutralの画像ファイル（可視化結果）の取り出し
docker cp explainability-container:/app/newResults/readable ./newResults

#Unreadableの画像ファイル（可視化結果）の取り出し
docker cp explainability-container:/app/newResults/unreadable ./newResults
```

## 発生したエラーと解決方法

### 1. torch-cluster の依存関係エラー

**エラー内容:**

```
ModuleNotFoundError: No module named 'torch'
```

**原因:**

- `torch-cluster`が`torch`に依存しているが、`requirements.txt`で`torch`より先にインストールされようとしていた
- PyTorch 関連のパッケージ（`torch-cluster`, `torch-scatter`, `torch-sparse`）は`torch`が先にインストールされている必要がある

**解決方法:**
Dockerfile を 3 段階に分けてインストール：

1. `torch==2.9.0`のみをインストール
2. PyTorch 関連パッケージをインストール
3. 残りの依存関係を`requirements.txt`からインストール

### 2. NumPy 2.x と RDKit の互換性エラー

**エラー内容:**

```
AttributeError: _ARRAY_API not found
A module that was compiled using NumPy 1.x cannot be run in NumPy 2.2.6
```

**原因:**

- `numpy==2.2.6`がインストールされている
- `rdkit-pypi==2022.9.5`は NumPy 1.x でコンパイルされている
- NumPy 2.x では`_ARRAY_API`が変更されたため、古い RDKit が動作しない

**解決方法:**
`requirements.txt`で NumPy を 1.x 系にダウングレード：

```
numpy<2.0.0
```

## トラブルシューティング

### コンテナが起動しない場合

```bash
# ログを確認
docker compose logs

# コンテナの状態を確認
docker compose ps
```

### 依存関係の問題

```bash
# コンテナ内でパッケージを確認
docker compose exec explainability-app pip list

# 特定のパッケージを再インストール
docker compose exec explainability-app pip install --force-reinstall <package-name>
```

### キャッシュの問題

```bash
# キャッシュなしで再ビルド
docker compose build --no-cache
docker compose up
```

## 注意事項

- 初回ビルドは時間がかかりますが、次回からはキャッシュが効くので高速になります
- PyTorch 関連のパッケージは依存関係の順序が重要です
- NumPy 2.x は多くのパッケージと互換性がないため、1.x 系を使用することを推奨します
