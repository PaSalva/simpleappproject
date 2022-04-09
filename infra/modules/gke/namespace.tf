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

#### SA for each namespace
resource "google_service_account_key" "keys" {
  service_account_id = google_service_account.gke_service_account.id
}


resource "kubernetes_secret" "service_account" {
  for_each = toset(var.namespaces)
  metadata {
    name      = "sv-credentials"
    namespace = each.key
  }

  data = {
    //"account.json" = "${file("../../credentials/sa-cluster-${var.main_global_environment}.json")}"
    "service_account.json" = base64decode(google_service_account_key.keys.private_key)
  }

  type = "Opaque"


}
