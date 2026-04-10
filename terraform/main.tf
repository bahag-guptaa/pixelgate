module "artifact_registry" {
  source = "./modules/artifact_registry"

  region        = var.region
  repository_id = var.artifact_registry_repository
  description   = "Docker images for PixelGate API"
}

module "iam" {
  source = "./modules/iam"

  project_id         = var.project_id
  service_account_id = var.github_actions_service_account_id
}

module "cloud_sql" {
  source = "./modules/cloud_sql"

  region              = var.region
  instance_name       = var.cloud_sql_instance_name
  database_version    = var.cloud_sql_database_version
  tier                = var.cloud_sql_tier
  disk_size_gb        = var.cloud_sql_disk_size_gb
  backup_enabled      = var.cloud_sql_backup_enabled
  ipv4_enabled        = var.cloud_sql_ipv4_enabled
  deletion_protection = var.cloud_sql_deletion_protection
  db_name             = var.db_name
  db_user             = var.db_user
  db_pass             = var.db_pass
}

module "cloud_run" {
  source = "./modules/cloud_run"

  depends_on = [
    module.artifact_registry,
    module.iam,
    module.cloud_sql,
  ]

  region           = var.region
  service_name     = var.cloud_run_service_name
  image            = local.bootstrap_image
  container_port   = var.cloud_run_container_port
  cpu              = var.cloud_run_cpu
  memory           = var.cloud_run_memory
  db_host          = module.cloud_sql.public_ip_address
  db_name          = var.db_name
  db_user          = var.db_user
  db_pass          = var.db_pass
  db_port          = var.db_port
  rawg_api_key     = var.rawg_api_key
  external_api_url = var.external_api_url
  jwt_secret       = var.jwt_secret
  node_env         = var.node_env
  db_sync_on_start = var.db_sync_on_start
}