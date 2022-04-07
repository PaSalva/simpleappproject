
provider "google" {}

terraform {
  backend "gcs" {
    bucket = "simpleproject-terraform-state"
    prefix = "terraform/infra"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.15.0"
    }
  }
}