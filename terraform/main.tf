terraform {
  backend "gcs" {
    prefix = "tf-state"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.10.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.10.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "project-apis" {
  for_each                   = toset(var.apis)
  service                    = each.value
  disable_dependent_services = true
}

module "wif_service_accounts" {
  source  = "terraform-google-modules/service-accounts/google"
  version = "~> 4.2"

  project_id   = var.project_id
  names        = ["terraform"]
  display_name = "Service Account for WIF"

  project_roles = [
    "${var.project_id}=>roles/editor",
  ]
}

module "wif_provider" {
  source = "./modules/wif"

  project          = var.project_id
  service_accounts = module.wif_service_accounts.emails_list
  repos            = var.repositories
}

resource "google_artifact_registry_repository" "docker_repository" {
  provider = google-beta

  location      = var.region
  repository_id = "cloud-run"
  description   = "Docker repository for Cloud Run service images"
  format        = "DOCKER"

  cleanup_policies {
    id     = "keep-minimum-versions"
    action = "KEEP"
    most_recent_versions {
      keep_count = 3
    }
  }
}

module "cloud_run" {
  source  = "GoogleCloudPlatform/cloud-run/google"
  version = "~> 0.10.0"

  project_id   = var.project_id
  location     = var.region
  image        = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repository.name}/${var.service_name}"
  service_name = var.service_name
  service_annotations = {
    "run.googleapis.com/ingress" : "internal-and-cloud-load-balancing"
  }
}
