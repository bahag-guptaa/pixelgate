resource "google_service_account" "github_actions" {
  account_id   = var.service_account_id
  display_name = "PixelGate GitHub Actions deployer"
}

# Broad permissions for managing Cloud Run, Cloud SQL, Artifact Registry, Storage, etc.
resource "google_project_iam_member" "editor" {
  project = var.project_id
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Required by Cloud Run deploy to impersonate the runtime service account
resource "google_project_iam_member" "service_account_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# Required by Terraform to manage google_project_iam_member resources
resource "google_project_iam_member" "project_iam_admin" {
  project = var.project_id
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
