
output "cluster_name" {
  description = "Name of the principal Cluster"
  value       = google_container_cluster.main_cluster.name
}


output "node_pool_principal" {
  description = "Name of ht node pool principal"
  value       = google_container_node_pool.primary_preemptible_nodes.name
}

output "cluster_enpoint" {
  description = "Endpoint del cluster"
  value       = google_container_cluster.main_cluster.endpoint
}
