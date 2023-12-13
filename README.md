# ADO-Work-Log

This is a React single page application that displays work performed on Azure Dev Ops in the last week. This is designed to be deployed onto Docker. 

## Rebuilding the Image

`docker build -t profoundlogicdevteam/ado-work-log .`

## Environment Vars

This requires a .env file containing the following keys:

| Key       | Value                              |
|-----------|------------------------------------|
| Username  | Microsoft Azure Email Address      |
| Password  | Azure DevOps Personal Access Token |
| CLIENT_ID | Azure Tenant Application Client ID |
