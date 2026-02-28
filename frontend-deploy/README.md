# Frontend Deployment

このディレクトリには、Next.jsフロントエンドアプリケーションをGCP Cloud Runにデプロイするための全てのコードが含まれています。

## 📁 含まれるファイル

- **Terraform設定**: `main.tf`, `variables.tf`, `outputs.tf`
- **Docker設定**: `Dockerfile`, `.dockerignore`
- **デプロイスクリプト**: `deploy.sh`
- **詳細ガイド**: `README-DEPLOY.md`

## 🚀 クイックスタート

```bash
# 1. 設定ファイルを作成
cp terraform.tfvars.example terraform.tfvars
# terraform.tfvars を編集してGCPプロジェクトIDを設定

# 2. Terraformでインフラを構築
terraform init
terraform apply

# 3. アプリをビルド＆デプロイ
./deploy.sh YOUR_PROJECT_ID asia-northeast1 trippy-nextjs-app

# 4. デプロイURLを確認
terraform output service_url
```

詳細な手順は [README-DEPLOY.md](./README-DEPLOY.md) を参照してください。

## 🏗️ インフラ構成

- **Cloud Run**: Next.jsアプリケーションのホスティング
- **Artifact Registry**: Dockerイメージの保存
- **Cloud Build**: 自動ビルドパイプライン

## 📝 必要な権限

GCPプロジェクトで以下のAPIを有効化してください：
- Cloud Run API
- Artifact Registry API
- Cloud Build API
