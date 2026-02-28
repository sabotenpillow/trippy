terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Artifact Registryリポジトリの作成
resource "google_artifact_registry_repository" "nextjs_repo" {
  location      = var.region
  repository_id = "nextjs-app"
  description   = "Docker repository for Next.js application"
  format        = "DOCKER"
}

# Cloud Runサービスの作成
resource "google_cloud_run_v2_service" "nextjs_app" {
  name     = var.service_name
  location = var.region
  
  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.nextjs_repo.repository_id}/nextjs-app:latest"
      
      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  depends_on = [google_artifact_registry_repository.nextjs_repo]
}

# Cloud Runサービスへのパブリックアクセスを許可
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  name     = google_cloud_run_v2_service.nextjs_app.name
  location = google_cloud_run_v2_service.nextjs_app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# 必要なAPIを有効化
resource "google_project_service" "cloud_run_api" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifact_registry_api" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_build_api" {
  service            = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}
