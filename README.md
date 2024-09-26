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

## Contributing
Perform these commands inside a terminal not attached to Docker container.

1. Create new branch on GitHub for your feature off of the [`main`](https://github.com/BaratiLab/AMUI) branch.
    - Provide the new branch with a descriptive feature title like: `README-troubleshooting-updates`.
<img src="./images/new_branch.png" width="250px">
2. Pull newly created branch locally.
    ```bash
    git pull
    ```
    - You see that new branch now

      ![image/new_branch_pull.png](./images/new_branch_pull.png)
3. Change to this local branch.
    ```bash
    git checkout <REPLACE-WITH-BRANCH-NAME> 
    ```
4. Make your changes and stage them for commit.
    ```bash
    git add .
    ```
    - This will add all changes.
    - Make sure to follow additional instructions for [`api`](./api/README.md) or [`web`](./web/README.md)
    - `git status` will show your staged changes in green.

      ![image/git_add_git_status](./images/git_add_git_status.png)
5. Commit your changes with a descriptive commit message.
    ```bash
    git commit -m "Your 80 character maximum commit message goes here"
    ```

    ![image/git_commit](./images/git_commit.png)
6. Push your changes to GitHub.
    ```bash
    git push
    ```

    ![image/git_push](./images/git_push.png)
7. Go back to repository on GitHub and create a Pull Request
    - You should see a banner notification about your latest change.
    - Click on the "Compare & pull request" button to create a Pull Request

      ![image/banner](./images/my_new_feature_update_notification.png)
    
    - Add @ppak10 as reviewer and fill in other the necessary details.

      ![image/make_pull_request](./images/make_pull_request.gif)

8. Delete feature branch once pull request is merged
    ![image/delete_branch](./images/delete_branch.png)
9. Pull and Checkout `main` branch locally
    ```bash
    git pull
    git checkout main
    ```

## Notes
- [PGAdmin](localhost:5050)
    - Host name/address: `amui-sql`
    - Username: `postgres`
    - Password: check `POSTGRES_PASSWORD` in `.env`
- Docker
  - [Delete Docker Images](https://stackoverflow.com/a/44785784/10521456): `docker rmi -f $(docker images -aq)`
  - [Enter Docker Container](https://stackoverflow.com/a/26496854/10521456): `docker exec -it [container-id] bash`

## Troubleshooting
- [Need `sudo` on Docker in Ubuntu](https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo)

