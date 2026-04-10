output "artifact_registry_repository_path" {
  description = "Artifact Registry repository path for Docker pushes."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${module.artifact_registry.repository_id}"
}

output "cloud_run_image_reference" {
  description = "Artifact Registry image reference configured on the Cloud Run service."
  value       = local.cloud_run_image
}

output "cloud_run_service_url" {
  description = "Public URL of the Cloud Run service."
  value       = module.cloud_run.url
}

output "github_actions_service_account_email" {
  description = "Service account email for GitHub Actions deployment auth."
  value       = module.iam.service_account_email
}

output "cloud_sql_public_ip_address" {
  description = "Public IPv4 address of the Cloud SQL instance."
  value       = module.cloud_sql.public_ip_address
}
