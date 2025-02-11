# AMUI
Additive Manufacturing User Interface (AMUI)

## Quickstart
1. Clone the [repository]("https://github.com/BaratiLab/AMUI.git") with your prefered method.
    ```bash
    git clone git@github.com:BaratiLab/AMUI.git
    ```
2. Follow the instructions for downloading and installing [Docker Desktop]("https://www.docker.com/products/docker-desktop/")
    - Make sure the docker compose works here, you'll need it for this project.
    - Creating an account is optional here.
3. Open `AMUI` project in VSCode
4. Duplicate `.env.example` file and rename to `.env`.
    - Fill in the following empty fields (ask @ppak10 if you need help).
5. Open terminal and (under `AMUI` directory) start containers.
    ```bash
    docker-compose up -d
    ```
6. Follow further instructions for either [`api`](./api/README.md) or [`web`](./web/README.md)
