# Module
Folder for creating services for machine learning models.

## Getting Started
1. Copy the `example` folder under here and name it your module.
    * Replace instances of `example` with your module name for:
        * `README.md`
        * `.devcontainer.json`
        * `Dockerfile`
2. Edit the `Dockerfile` to fit your needs:
    * Update this line to your specific Python version:
        ```Dockerfile
        FROM python:3.11
        ```
3. Copy and replace `requirements.txt` with your own file.
4. Navigate to the `docker-compose.yml` file to copy and adapt the following for your module.
    ```yml
    module-example:
      container_name: amui-module-example
      build:
        context: ./module/example
        dockerfile: Dockerfile
      tty: true
    ```
