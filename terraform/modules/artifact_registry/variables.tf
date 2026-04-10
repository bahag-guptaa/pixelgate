variable "region" {
  description = "GCP region for the Artifact Registry repository."
  type        = string
}

variable "repository_id" {
  description = "Artifact Registry repository name."
  type        = string
}

variable "description" {
  description = "Human-readable description of the repository."
  type        = string
  default     = "Docker images"
}
