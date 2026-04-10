variable "region" {
  description = "GCP region for the Cloud SQL instance."
  type        = string
}

variable "instance_name" {
  description = "Cloud SQL instance name."
  type        = string
}

variable "database_version" {
  description = "Postgres version."
  type        = string
  default     = "POSTGRES_16"
}

variable "tier" {
  description = "Machine tier for the Cloud SQL instance."
  type        = string
  default     = "db-f1-micro"
}

variable "disk_size_gb" {
  description = "Disk size in GB."
  type        = number
  default     = 20
}

variable "backup_enabled" {
  description = "Whether automated backups are enabled."
  type        = bool
  default     = true
}

variable "ipv4_enabled" {
  description = "Whether to expose a public IPv4 address."
  type        = bool
  default     = true
}

variable "deletion_protection" {
  description = "Whether the instance is protected from deletion."
  type        = bool
  default     = true
}

variable "db_name" {
  description = "Database name to create."
  type        = string
  sensitive   = true
}

variable "db_user" {
  description = "Database user to create."
  type        = string
  sensitive   = true
}

variable "db_pass" {
  description = "Database user password."
  type        = string
  sensitive   = true
}
