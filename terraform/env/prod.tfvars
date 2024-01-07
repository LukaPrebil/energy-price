region       = "europe-west1"
project_id   = "energy-price-api"
service_name = "energy-price-api"

apis = [
  "artifactregistry.googleapis.com",
  "cloudapis.googleapis.com",
  "run.googleapis.com",
  "iam.googleapis.com",
  "logging.googleapis.com",
  "secretmanager.googleapis.com",
  "storage-component.googleapis.com",
  "apigateway.googleapis.com",
  "servicecontrol.googleapis.com",
]

repositories = [
  "energy-price"
]
