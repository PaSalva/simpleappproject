#
#variable "vpc" {
#  type        = string
#  description = "VPC cluster"
#}
#
#variable "subnetwork" {
#  type        = string
#  description = "Subnetwork from custom VPC"
#}
#
#variable "cluster_secondary_range_name" {
#  type = string
#  description = "Nombre del rango secundario de la subred del cluster"
#}
#
#variable "services_secondary_range_name" {
#  type = string
#  description = "Nombre del rango secundario de la subred del cluster"
#}

variable "region" {
  type        = string
  description = "region"
}

variable "project_id" {
  type        = string
  description = "ID del proyecto"
}

variable naming {
  type = string
  description = "General naming"
}
