# How to use 
Terraform no tiene incorporado (todavía) el servicio de Google Deploy. 
Para poder utilizar el servicio y desplegar una release debe existir el registro previamente. 

Para ello, modifica el fichero clouddeploy.yaml.schema y ejecuta el comando:

```
    gcloud deploy apply --file clouddeploy.yaml --region=europe-west1
```
