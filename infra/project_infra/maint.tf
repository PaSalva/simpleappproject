module "gke" {
  source = "./../modules/gke"

  project_id = var.project_id
  region     = var.region
  naming     = var.naming

}


module "cloudbuild_1" {
  source = "./../modules/cloudbuild"

  project_id       = var.project_id
  name             = "sample-one-cloudbuild"
  repository_owner = "PaSalva"
  repository_name  = "simpleappproject"
  regex_branchs    = "main"
  cloudbuild_yml   = "infra/cloudbuild_yaml/sample_one.yaml"
}


module "registry" {
  source = "./../modules/registry"

  project_id      = var.project_id
  region          = var.region
  repository_name = "gcloud-deploy-lab"

}

module "cloudbuild_gcloud_deploy" {
  source = "./../modules/cloudbuild"

  project_id       = var.project_id
  name             = "gcloud-deploy-cloudbuild"
  repository_owner = "PaSalva"
  repository_name  = "simpleappproject"
  regex_branchs    = "prod"
  cloudbuild_yml   = "infra/cloudbuild_yaml/gcloud_deploy_sample.yaml"
  substitutions = {
    _PROJECT_ID = var.project_id
    _IMAGE_NAME = module.registry.image
  }

  depends_on = [
    module.registry
  ]
}

