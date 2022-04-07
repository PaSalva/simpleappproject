sh:
	docker run -i -t --rm -w /app -v `pwd`:/app --env-file .env --entrypoint=sh hashicorp/terraform:1.1.2 
