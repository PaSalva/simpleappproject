variable "apis" {
  default = [
    "cloudresourcemanager",
    "container"

  ]
}

resource "google_project_service" "apis" {
  for_each = toset(var.apis)
  project  = var.project_id
  service  = "${each.key}.googleapis.com"

  disable_on_destroy = false
}

resource "google_container_cluster" "main_cluster" {
  project  = var.project_id
  name     = "${var.naming}-cluster"
  location = var.region

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1

  depends_on = [
    google_project_service.apis
  ]
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  project    = var.project_id
  name       = "custom-node-pool"
  location   = var.region
  cluster    = google_container_cluster.main_cluster.name
  node_count = 1
  management {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    preemptible  = true
    machine_type = "n1-standard-1"

  }

  autoscaling {
    min_node_count = 1
    max_node_count = 2
  }
}
