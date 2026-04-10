resource "google_cloud_run_v2_service" "this" {
  name     = var.service_name
  location = var.region

  template {
    containers {
      image = var.image

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      env {
        name  = "RAWG_API_KEY"
        value = var.rawg_api_key
      }

      env {
        name  = "DB_NAME"
        value = var.db_name
      }

      env {
        name  = "DB_HOST"
        value = var.db_host
      }

      env {
        name  = "DB_USER"
        value = var.db_user
      }

      env {
        name  = "DB_PASS"
        value = var.db_pass
      }

      env {
        name  = "DB_PORT"
        value = tostring(var.db_port)
      }

      env {
        name  = "EXTERNAL_API_URL"
        value = var.external_api_url
      }

      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }

      env {
        name  = "NODE_ENV"
        value = var.node_env
      }

      env {
        name  = "DB_SYNC_ON_START"
        value = tostring(var.db_sync_on_start)
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
    ]
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  name     = google_cloud_run_v2_service.this.name
  location = google_cloud_run_v2_service.this.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
