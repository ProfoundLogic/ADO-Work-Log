# Use an official Node.js runtime as the base image
FROM node:20-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container at /app
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install 

# Set the REACT_APP_CLIENTID environment variable to the value passed in from the build command
ARG REACT_APP_CLIENTID
ENV REACT_APP_CLIENTID $REACT_APP_CLIENTID

# Copy the rest of the application's code files into the container at /app
COPY . .

# Build the react application
RUN npm run build

# Make port 3000 available to the outside world
EXPOSE 3000

# Define the command to run the application
CMD [ "npx", "serve", "-s", "build"]