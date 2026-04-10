output "instance_name" {
  description = "Cloud SQL instance name."
  value       = google_sql_database_instance.this.name
}

output "public_ip_address" {
  description = "Public IPv4 address of the Cloud SQL instance."
  value       = google_sql_database_instance.this.public_ip_address
}
