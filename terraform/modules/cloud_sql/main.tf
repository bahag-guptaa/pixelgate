resource "google_sql_database_instance" "this" {
  name                = var.instance_name
  region              = var.region
  database_version    = var.database_version
  deletion_protection = var.deletion_protection

  settings {
    tier      = var.tier
    disk_size = var.disk_size_gb
    edition   = "ENTERPRISE"

    backup_configuration {
      enabled = var.backup_enabled
    }

    ip_configuration {
      authorized_networks {
        value = "0.0.0.0/0"
        name  = "all"
      }
      ipv4_enabled = var.ipv4_enabled
      ssl_mode     = "ENCRYPTED_ONLY"
    }
  }
}

resource "google_sql_database" "this" {
  name     = var.db_name
  instance = google_sql_database_instance.this.name
}

resource "google_sql_user" "this" {
  name     = var.db_user
  instance = google_sql_database_instance.this.name
  password = var.db_pass
}
