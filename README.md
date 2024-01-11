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

## Contributing
1. Create new branch on GitHub for your feature off of the [`main`](https://github.com/BaratiLab/AMUI) branch.
    - Provide the new branch with a descriptive feature title like: `README-troubleshooting-updates`.

      ![image/new_branch.png](./images/new_branch.png)
2. Pull newly created branch locally.
    ```bash
    git pull
    ```
    - You see that new branch now

      ![image/new_branch_pull.png](./images/new_branch_pull.png)
