#!/bin/bash

# GCPへのデプロイスクリプト
# frontend-deployディレクトリ内で実行してください

set -e

# 変数
PROJECT_ID=${1:-"your-gcp-project-id"}
REGION=${2:-"asia-northeast1"}
SERVICE_NAME=${3:-"trippy-nextjs-app"}

echo "🚀 Starting deployment to GCP..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# GCPプロジェクトを設定
gcloud config set project $PROJECT_ID

# Dockerイメージをビルド（プロジェクトルートから）
echo "📦 Building Docker image..."
IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/nextjs-app/nextjs-app:latest"

# frontend-deployディレクトリから一つ上のディレクトリでビルド
cd "$(dirname "$0")/.."
gcloud builds submit --tag $IMAGE_NAME

echo "✅ Image built and pushed successfully!"
echo "📝 Image: $IMAGE_NAME"
echo ""
echo "To deploy with Terraform:"
echo "  cd frontend-deploy"
echo "  terraform apply"

