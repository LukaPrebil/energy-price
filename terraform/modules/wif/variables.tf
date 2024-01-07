variable "project" {
  type        = string
  description = "Project ID"
}

variable "service_accounts" {
  type        = list(string)
  description = "List of service accounts emails that can be impersonated using the provider"
  default     = []
}

variable "repos" {
  type        = list(string)
  description = "List of Github repositoriesIngka that are authorized to use the provider"
  default     = []
}
