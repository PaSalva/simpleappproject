variable "region" {}
variable "project_id" {}
variable "repository_name" {}
variable "format" {
  default = "DOCKER"
}
variable "description" {
  default = ""
}


###############
##    APIS   ##
###############

variable "apis" {
  default = [
    "artifactregistry"
  ]
}

resource "google_project_service" "apis" {
  for_each = toset(var.apis)
  project  = var.project_id
  service  = "${each.key}.googleapis.com"

  disable_on_destroy = false
}

###############
## Resources ##
###############

resource "google_artifact_registry_repository" "my_repo" {
  provider = google-beta

  project       = var.project_id
  location      = var.region
  repository_id = var.repository_name
  description   = var.description
  format        = var.format
}

output "image" {
  value = google_artifact_registry_repository.my_repo.name
}
