variable "iam_name" {
    type= string
    default = "gke-app-name"
}

variable "iam_service_account_iam_roles"{
    type = list(any)
 
    default = [
      "roles/logging.logWriter",
      "roles/storage.objectCreator",
      "roles/storage.objectViewer",
      "roles/storage.admin",
      "roles/monitoring.editor",
      "roles/artifactregistry.reader"
    ]
}

resource "google_service_account" "gke_service_account" {
  project      = var.project_id
  account_id   = var.iam_name
  display_name = var.iam_name
}

# Add roles to node service account
resource "google_project_iam_member" "gke_iam_member" {
  for_each = toset(var.iam_service_account_iam_roles)
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.gke_service_account.email}"
}
