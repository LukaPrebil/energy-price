variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "region" {
  description = "The region to deploy to"
  type        = string
}

variable "apis" {
  description = "The list of APIs to enable"
  type        = list(string)
}