locals {
  cloud_run_image  = "${var.region}-docker.pkg.dev/${var.project_id}/${var.artifact_registry_repository}/${var.image_name}:${var.image_tag}"
  bootstrap_image  = "us-docker.pkg.dev/cloudrun/container/hello"
}
