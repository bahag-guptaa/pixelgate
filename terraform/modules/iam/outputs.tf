output "service_account_email" {
  description = "Email of the GitHub Actions deployer service account."
  value       = google_service_account.github_actions.email
}
