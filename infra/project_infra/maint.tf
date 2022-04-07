module "gke" {
  source = "./../modules/gke"

  project_id = var.project_id
  region     = var.region
  naming     = var.naming

}


module "cloudbuild_1" {
  source = "./../modules/cloudbuild"

  project_id = var.project_id
  name = "sample-one-cloudbuild"
  repository_owner = "PaSalva"
  repository_name = "simpleappproject"
  regex_branchs = "main"
  cloudbuild_yml = "infra/cloudbuild_yaml/sample_one.yaml"
}
