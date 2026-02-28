# GCP デプロイガイド

このディレクトリには、Next.jsアプリケーションをGCP Cloud Runにデプロイするための全てのファイルが含まれています。

## ディレクトリ構成

```
frontend-deploy/
├── main.tf                    # Terraformメイン設定
├── variables.tf               # Terraform変数定義
├── outputs.tf                 # Terraform出力定義
├── terraform.tfvars.example   # 環境変数のサンプル
├── Dockerfile                 # Next.jsアプリのDockerイメージ設定
├── .dockerignore             # Docker除外ファイル
├── deploy.sh                  # デプロイ自動化スクリプト
└── README-DEPLOY.md          # このファイル
```

## 前提条件

- GCPアカウントとプロジェクト
- Google Cloud SDK (gcloud) がインストール済み
- Terraform がインストール済み（v1.0以上）
- Docker がインストール済み

## セットアップ手順

### 1. GCPプロジェクトの準備

```bash
# GCP CLIにログイン
gcloud auth login

# アプリケーションのデフォルト認証情報を設定
gcloud auth application-default login

# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID
```

### 2. Next.js設定の更新（既に完了済み）

`frontend/next.config.ts` に `output: 'standalone'` が設定済みです。

### 3. Terraformでインフラをデプロイ

```bash
cd frontend-deploy

# terraform.tfvarsファイルを作成
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvarsを編集してプロジェクトIDを設定

# Terraformを初期化
terraform init

# プランを確認
terraform plan

# インフラをデプロイ
terraform apply
```

### 4. Dockerイメージをビルド＆プッシュ

```bash
# frontend-deployディレクトリ内で

# Dockerイメージをビルドしてプッシュ
gcloud builds submit --config=cloudbuild.yaml ..

# または、deploy.shスクリプトを使用
./deploy.sh YOUR_PROJECT_ID asia-northeast1 trippy-nextjs-app
```

### 5. デプロイを確認

```bash
# frontend-deployディレクトリ内で
terraform output service_url
```

出力されたURLにアクセスして、アプリケーションが正常に動作していることを確認します。

## コマンドリファレンス

### Terraformコマンド

```bash
# インフラの作成・更新
terraform apply

# インフラの削除
terraform destroy

# 現在の状態を確認
terraform show

# 出力変数を表示
terraform output
```

### 手動デプロイ（Terraform不使用の場合）

```bash
# イメージをビルド
docker build -t nextjs-app .

# GCPにプッシュ
docker tag nextjs-app asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-app/nextjs-app:latest
docker push asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-app/nextjs-app:latest

# Cloud Runにデプロイ
gcloud run deploy trippy-nextjs-app \
  --image asia-northeast1-docker.pkg.dev/YOUR_PROJECT_ID/nextjs-app/nextjs-app:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 3000
```

## トラブルシューティング

### APIが有効化されていない

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 認証エラー

```bash
gcloud auth application-default login
```

### ログの確認

```bash
# Cloud Runのログを確認
gcloud run services logs read trippy-nextjs-app --region=asia-northeast1
```

## コスト最適化

- Cloud Runは使用した分だけ課金される
- `min_instance_count = 0` でコールドスタートを許可し、コストを削減
- 必要に応じて `max_instance_count` を調整

## セキュリティ

現在の設定では `allUsers` にアクセスを許可しています。本番環境では以下を検討してください：

1. Cloud Armor で DDoS 保護
2. Identity-Aware Proxy (IAP) で認証
3. カスタムドメインとSSL証明書
4. 環境変数にシークレットを使用する場合は Secret Manager を利用
