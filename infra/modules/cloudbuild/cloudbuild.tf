###############
## Variables ##
###############
variable "name" {}
variable "repository_owner" {}
variable "project_id" {}
variable "repository_name" {}
variable "regex_branchs" {}
variable "cloudbuild_yml" {}
variable substitutions {
    default = {}
}

###############
##    APIS   ##
###############

variable "apis" {
  default = [
    "cloudbuild"
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
resource "google_cloudbuild_trigger" "trigger" {
  name    = var.name
  project = var.project_id  
  github {
    owner = var.repository_owner
    name  = var.repository_name
    push {
      branch = var.regex_branchs
    }
  }
  substitutions = var.substitutions
  filename = var.cloudbuild_yml

  depends_on = [
    google_project_service.apis
  ]
}
