data "google_client_config" "cluster" {}
provider "kubernetes" {
  host                   = "https://${google_container_cluster.main_cluster.endpoint}"
  cluster_ca_certificate = base64decode(google_container_cluster.main_cluster.master_auth.0.cluster_ca_certificate)
  token                  = data.google_client_config.cluster.access_token
}


variable "namespaces" {
  default = [
    "dev", "pre", "pro"
  ]
}

resource "kubernetes_namespace" "namespace" {
  for_each = toset(var.namespaces)

  metadata {
    name = each.key
  }

  depends_on = [
    google_container_cluster.main_cluster,
    google_container_node_pool.primary_preemptible_nodes
  ]
}

