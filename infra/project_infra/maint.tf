module "gke" {
  source = "./../modules/gke"

  project_id = var.project_id
  region     = var.region
  naming     = var.naming

}
