
resource "google_compute_network" "vpc_network_custom" {
  project                 = var.project_id
  name                    = "vpc-custom"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_subnetwork" "subnet_eu_custom" {
  name          = "subnet-custom-eu"
  ip_cidr_range = "10.109.131.32/27"
  region        = var.region
  network       = google_compute_network.vpc_network_custom.id
  secondary_ip_range {
    range_name    = "tf-secondary-range-service"
    ip_cidr_range = "10.136.0.0/14"
  }

  secondary_ip_range {
    range_name    = "tf-secondary-range-pod"
    ip_cidr_range = "10.141.0.0/20"
  }
}
