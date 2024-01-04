resource "google_iam_workload_identity_pool" "github_actions_pool" {
  project                   = var.project
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "Github Provider Pool"
  description               = "Identity pool for Github pipelines"
}

resource "google_iam_workload_identity_pool_provider" "github_actions_provider" {
  project                            = var.project
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_actions_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-actions-provider"
  display_name                       = "Github Actions provider"
  description                        = "OIDC identity pool provider for automated pipeline"
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
  }
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_binding" "service_account_wif_binding" {
  for_each = toset(var.service_accounts)

  service_account_id = "projects/${var.project}/serviceAccounts/${each.key}"
  role               = "roles/iam.workloadIdentityUser"
  members            = formatlist("principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_actions_pool.name}/attribute.repository/LukaPrebil/%s", var.repos)
}