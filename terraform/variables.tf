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

variable "repositories" {
  description = "The list of repositories to enable"
  type        = list(string)
}

variable "service_name" {
  type        = string
  description = "Name of the service"
}

variable "image_tag" {
  type        = string
  description = "Tag of the image"
  default     = "latest"
}