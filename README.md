# ADO-Work-Log

This is a React single page application that displays work performed on Azure Dev Ops in the last week. This is designed to be deployed onto AWS Lightsail using Docker. 

- [ADO-Work-Log](#ado-work-log)
  - [Local Machine Requirements](#local-machine-requirements)
  - [Environment Vars](#environment-vars)
    - [AWS Credentials](#aws-credentials)
      - [config](#config)
      - [credentials](#credentials)
    - [Application Environment Vars](#application-environment-vars)
  - [Deploying an updated application to Lightsail](#deploying-an-updated-application-to-lightsail)
    - [Creating the Container Image](#creating-the-container-image)
    - [Testing the Container Image Locally](#testing-the-container-image-locally)
    - [Updating the service on Lightsail](#updating-the-service-on-lightsail)
  - [Updating the packages](#updating-the-packages)
  - [To-Dos](#to-dos)
  - [Knex Query Builder](#knex-query-builder)


## Local Machine Requirements
* node
* npm or yarn
* [Docker](https://docs.docker.com/engine/install/#installation)
* Valid AWS Credentials
* [AWS CLI and Lightsail Control Plugin](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-install-software)


## Environment Vars
### AWS Credentials
For the AWS CLI program to work properly, you will need the following credentials to be placed in the `\.aws\` directory of your user profile. For me, this is `C:\Users\WillMitchell\.aws\`

Create the following files:

#### config
```
[default]
region = us-east-2
```

#### credentials
You will need to reach out to the resource in charge of managing Profound's AWS containers. At the time of this writing, that is Matt Denninghoff. 

```
[default]
aws_access_key_id = <ACCESS KEY>
aws_secret_access_key = <SECRET KEY>
```

### Application Environment Vars

The react application also requires environmental variables that will be passed in when starting the Docker container

| Key       | Value                              |
|-----------|------------------------------------|
| REACT_APP_USERNAME  | Microsoft Azure Email Address      |
| REACT_APP_PASSWORD  | Azure DevOps Personal Access Token |
| REACT_APP_CLIENT_ID | Azure Tenant Application Client ID |

## Deploying an updated application to Lightsail
After making changes to the local application, it will need to be deployed to the Lightsail container service so that the rest of the team can access it. It is very important that these steps are followed exactly to avoid damaging other Profound container services.

### Creating the Container Image
To deploy the application to Lightsail, we first need to create a container image with Docker. A container image is a type of virutal machine. Image details can be tweaked in the Dockerfile in this repository.

It is very important that the environment variables are passed into the application this way, to prevent them from being included in the final Docker image and exposing our credentials.

Build the image with the following command

```
docker build --build-arg REACT_APP_USERNAME="<REACT_APP_USERNAME>" \
--build-arg REACT_APP_PASSWORD="<REACT_APP_PASSWORD>" \
--build-arg REACT_APP_CLIENT_ID="<REACT_APP_CLIENT_ID>" \
-t profoundlogicdevteam/ado-work-log .
```

### Testing the Container Image Locally

Before deploying the image, we need to test it first to ensure that the program is working.

```
docker compose up
```

Navigate to [http://localhost:3000/](http://localhost:3000/) and attempt to sign in. If successful, move on from here.

### Updating the service on Lightsail
After building the image with docker, it's now ready for deployment to the lightsail container.

1. Push the image to lightstail with this command
   
```
aws lightsail push-container-image --service-name services-work-review --label services-work-review --image profoundlogicdevteam/ado-work-log:latest
```

2. Deploy the newly pushed image to lightsail with this command

```
aws lightsail 
```

## Updating the packages

Occasionally the npm packages will need to be updated to ensure that the application is safe and secure. Update them with the following command:

`npm i`

## To-Dos
- [ ] Time Tracking Reports
- [ ] Putting a SQLite DB Behind this
- [ ] Provision a Service Account
- [ ] Fix the profile image in the header
- [ ] Backend server using: https://stackoverflow.com/questions/39557764/running-two-nodejs-apps-in-one-docker-image

## Knex Query Builder
