# Super-Secure Library - DevFest Project

Welcome to the Super-Secure Library project, a vulnerable web application developed specifically for GDSC's 2023 DevFest!
This web application features 3 main web vulnerabilities that were presented during the workshop "All The Ways Your Web App Can Get Hacked, And How To Fix Them"; XSS, SQL Injection, and OS Command Injection.

## Prerequisites
- Docker should be installed on your machine. If not installed, follow the instructions in the [Docker installation documentation](https://docs.docker.com/get-docker/).

## Getting Started
To bring up the web app:

```bash
make up
```

This command will start the application using Docker containers. It will be accessible at http://localhost:8080/

## Shutting Down the App
To stop the application and shut down the Docker containers, use the following command:

```bash
make down
```

## Viewing Docker Logs
If you need to check the logs from the Docker containers, use the following command:

```bash
make logs
```

The fixes to the security bugs in this web app are presented in the source code as comments, with the text "FIX HERE".
