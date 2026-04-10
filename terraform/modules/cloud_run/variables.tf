variable "region" {
  description = "GCP region for the Cloud Run service."
  type        = string
}

variable "service_name" {
  description = "Cloud Run service name."
  type        = string
}

variable "image" {
  description = "Full Artifact Registry image reference including tag."
  type        = string
}

variable "container_port" {
  description = "Port exposed by the container."
  type        = number
  default     = 3000
}

variable "cpu" {
  description = "CPU limit for the container."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memory limit for the container."
  type        = string
  default     = "512Mi"
}

variable "db_host" {
  description = "Database host (public IP of Cloud SQL instance)."
  type        = string
}

variable "db_name" {
  description = "Database name."
  type        = string
  sensitive   = true
}

variable "db_user" {
  description = "Database user."
  type        = string
  sensitive   = true
}

variable "db_pass" {
  description = "Database password."
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Database port."
  type        = number
  default     = 5432
}

variable "rawg_api_key" {
  description = "RAWG API key."
  type        = string
  sensitive   = true
}

variable "external_api_url" {
  description = "Base URL for the RAWG external API."
  type        = string
  default     = "https://api.rawg.io/api"
}

variable "jwt_secret" {
  description = "JWT signing secret."
  type        = string
  sensitive   = true
}

variable "node_env" {
  description = "NODE_ENV value."
  type        = string
  default     = "production"
}

variable "db_sync_on_start" {
  description = "Whether the app runs sequelize.sync() on startup."
  type        = bool
  default     = true
}
