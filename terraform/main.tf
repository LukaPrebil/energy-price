terraform {
  backend "gcs" {
    prefix = "tf-state"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.10.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "project-apis" {
  for_each                   = toset(var.apis)
  service                    = each.value
  disable_dependent_services = true
}

