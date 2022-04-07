
output "vpc_principal" {
    description = "Name of the VPC"
    value = google_compute_network.vpc_network_custom.name
}


output "subred_vpc_principal" {
    description = "Name subred principal VPC"
    value = google_compute_subnetwork.subnet_eu_custom.name
}

output "secundary_range_name" {
    value = google_compute_subnetwork.subnet_eu_custom.secondary_ip_range.0.range_name
}

output "services_secondary_range_name" {
    value = google_compute_subnetwork.subnet_eu_custom.secondary_ip_range.1.range_name
}
