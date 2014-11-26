PROJECT ?= sphere-api-service
EB_BUCKET ?= ninjablocks-sphere-api-service

APP_NAME ?= sphere-api-service
APP_ENV ?= sphere-api-service-staging

DOCKER_ARGS ?= "-H dockerhost:5555"
SHA1 := $(shell git rev-parse HEAD | tr -d "\n")

DOCKERRUN_FILE := ${SHA1}-Dockerrun.aws.json

all: build deploy

build:
	docker ${DOCKER_ARGS} build -t "docker-registry.ninjablocks.co/ninjablocks/${PROJECT}:${SHA1}" .

deploy:
	docker ${DOCKER_ARGS} push "docker-registry.ninjablocks.co/ninjablocks/${PROJECT}:${SHA1}"
	sed "s/<TAG>/${SHA1}/" < Dockerrun.aws.json.template > ${DOCKERRUN_FILE}

	aws s3 cp ${DOCKERRUN_FILE} s3://${EB_BUCKET}/${DOCKERRUN_FILE}

	aws elasticbeanstalk create-application-version --application-name ${APP_NAME} \
	  --version-label ${SHA1} --source-bundle S3Bucket=${EB_BUCKET},S3Key=${DOCKERRUN_FILE}

	# Update Elastic Beanstalk environment to new version
	aws elasticbeanstalk update-environment --environment-name ${APP_ENV} \
	    --version-label ${SHA1}

.PHONY: all build deploy