variable "project_id" {
  description = "GCP project ID where Terraform will create resources."
  type        = string
}

variable "region" {
  description = "Primary GCP region for Artifact Registry, Cloud SQL, and Cloud Run."
  type        = string
  default     = "europe-west1"
}

variable "artifact_registry_repository" {
  description = "Artifact Registry repository name for Docker images."
  type        = string
  default     = "pixelgate-api"
}

variable "image_name" {
  description = "Docker image name stored inside the Artifact Registry repository."
  type        = string
  default     = "pixelgate-api"
}

variable "image_tag" {
  description = "Docker image tag Cloud Run should use from Artifact Registry."
  type        = string
  default     = "latest"
}

variable "github_actions_service_account_id" {
  description = "Service account ID used by GitHub Actions for pushing images and deploying Cloud Run."
  type        = string
  default     = "pixelgate-github-actions"
}

variable "cloud_run_service_name" {
  description = "Cloud Run service name for the backend API."
  type        = string
  default     = "pixelgate-api-ayan"
}

variable "cloud_run_container_port" {
  description = "Port exposed by the Node.js container."
  type        = number
  default     = 3000
}

variable "cloud_run_cpu" {
  description = "CPU allocated to the Cloud Run container."
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Memory allocated to the Cloud Run container."
  type        = string
  default     = "512Mi"
}

variable "cloud_sql_instance_name" {
  description = "Cloud SQL instance name for the managed Postgres database."
  type        = string
  default     = "pixelgate-db"
}

variable "cloud_sql_database_version" {
  description = "Postgres version for the Cloud SQL instance."
  type        = string
  default     = "POSTGRES_16"
}

variable "cloud_sql_tier" {
  description = "Machine tier for the Cloud SQL instance."
  type        = string
  default     = "db-f1-micro"
}

variable "cloud_sql_disk_size_gb" {
  description = "Disk size in GB for the Cloud SQL instance."
  type        = number
  default     = 20
}

variable "cloud_sql_backup_enabled" {
  description = "Whether automated backups are enabled for Cloud SQL."
  type        = bool
  default     = true
}

variable "cloud_sql_deletion_protection" {
  description = "Whether the Cloud SQL instance is protected from accidental deletion."
  type        = bool
  default     = true
}

variable "cloud_sql_ipv4_enabled" {
  description = "Whether the Cloud SQL instance should expose a public IPv4 address."
  type        = bool
  default     = true
}

variable "node_env" {
  description = "NODE_ENV value passed to the application container."
  type        = string
  default     = "production"
}

variable "db_sync_on_start" {
  description = "Whether the app should run sequelize.sync() during startup."
  type        = bool
  default     = true
}

variable "external_api_url" {
  description = "Base URL for the RAWG external API."
  type        = string
  default     = "https://api.rawg.io/api"
}

variable "rawg_api_key" {
  description = "RAWG API key used by the backend."
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Application database name to create and connect to."
  type        = string
  sensitive   = true
}

variable "db_user" {
  description = "Application database user to create and use."
  type        = string
  sensitive   = true
}

variable "db_pass" {
  description = "Password for the application database user."
  type        = string
  sensitive   = true
}

variable "db_port" {
  description = "Database port used by the application."
  type        = number
  default     = 5432
}

variable "jwt_secret" {
  description = "JWT signing secret used by the backend."
  type        = string
  sensitive   = true
}