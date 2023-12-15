# Use an official Node.js runtime as the base image
FROM node:20-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container at /app
COPY package*.json ./

# Necessary for environment variable setup
COPY create-env-file.sh ./create-env-file.sh

# Install the application's dependencies inside the container
RUN npm install 

# Copy the rest of the application's code files into the container at /app
COPY . .

ARG REACT_APP_USERNAME
ARG REACT_APP_PASSWORD
ARG REACT_APP_CLIENT_ID

# Build the environments file
RUN sh create-env-file.sh REACT_APP_USERNAME=$REACT_APP_USERNAME REACT_APP_PASSWORD=$REACT_APP_PASSWORD REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID

# Build the react application
RUN npm run build

# Make port 3000 available to the outside world
EXPOSE 3000

# Define the command to run the application
CMD [ "npx", "serve", "-s", "build"]