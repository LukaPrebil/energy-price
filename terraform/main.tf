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
