# Uses `ubi8:8.5` to allow for subscription manager to work inside container.
# https://serverfault.com/a/1115318/525986
# FROM redhat/ubi8:8.5

##########################
# Red Hat Initialization #
##########################

FROM redhat/ubi8:8.10

ARG REDHAT_PASSWORD
ARG REDHAT_USERNAME

WORKDIR /home/flow3d-docker

# Copies all files including flow3d installation file to docker container.
COPY ./setup ./setup

# Creates folder for unpacked flow_3d installer outsize of `flow3d` volume.
RUN mkdir ./installer

# Unzips setup file for flow3d
RUN tar -xvf ./setup/*.tar.gz --directory ./installer

# Registers container to download `redhat-lsb`.
RUN subscription-manager register --username ${REDHAT_USERNAME} --password ${REDHAT_PASSWORD}

# Install python
RUN yum groupinstall -y "Development Tools"
RUN yum install -y python3.12 python3-pip python3-devel

# Installs `redhat-lsb` along with other required packages.
# Note: `redhat-lsb` does not exist on future releases such as RedHat 9.
RUN yum install -y redhat-lsb libglvnd-opengl xcb-util mesa-libGL-devel openmpi

# Comment out if not working (check network outage https://www.fedorastatus.org/)
# Install other helpful packages.
RUN dnf update -y
RUN dnf install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
RUN dnf install -y screen

#################################
# FLOW-3D Software Installation #
#################################

ARG FLOW_3D_LICENSE_SERVER

# Changes directory to created `flow3d_installer`.
WORKDIR /home/flow3d-docker/installer

# Automatically provides reponses when installing flow3d.
# 1. Would you like to read the LICENSE AGREEMENT? - no
# 2. DO YOU ACCEPT ALL OF THE TERMS OF THE PRECEDING LICENSE AGREEMENT? - yes
# 3. Choose the type of installation - 2 (FLOW-3D v12.0 Update 2 Release 7 only)
# 4. Press 'ENTER' to install using the default directory - ENTER
# 5. Would you like to opt out of viewing the FLOW-3D RSS feed? - yes
# 6. Would you like to continue ?  (please respond with 'yes' or 'no') - yes
# 7. Please specify the name or IP address of the FLOW-3D License Server - FLOW_3D_LICENSE_SERVER
# 8. Please specify the name or IP address of the Samuserver - FLOW_3D_LICENSE_SERVER
# 9. Would you like to create desktop icons for root? ('yes' or 'no') - no
# 10. Would you like to create desktop icons for some users? (please respond with 'yes' or 'no') - no
RUN echo -e "no\nyes\n2\n\n\nyes\nyes\n${FLOW_3D_LICENSE_SERVER}\n${FLOW_3D_LICENSE_SERVER}\nno\nno\n" | ./FSJModuleinstaller.sh

# Copies flow3d script set environment variables automatically when shell opens.
RUN cp /opt/flow3d/v12_u2_fsj_module_3_0_r7/local/flow3dvars.sh /etc/profile.d/custom.sh

# Changes directory to base.
WORKDIR /home/flow3d-docker

# Removes unnessary folders.
RUN rm -rf installer

################################
# Python `venv` Initialization #
################################

ARG DEVELOPMENT

# Copy python requirements over (allows caching of previous commands)
COPY ./requirements.txt .

# Create Virutal Environment for python
RUN python3.12 -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt

# Copy over Flow3D python package
COPY ./githubs ./githubs

# Needs spaces around brackets to run properly.
RUN if [ "$DEVELOPMENT" = "true" ]; then \
        echo "Installing editable Flow3D source"; \
        . venv/bin/activate && pip install -e ./githubs/Flow3D; \
    else \
        echo "Installing published Flow3D package"; \
        . venv/bin/activate && pip install flow3d; \
    fi

# Copy over outputs from FLOW-3D Runs.
# Need to do this since its marked as a volume
COPY ./out ./out

#################
# Celery Worker #
#################

COPY ./entrypoint.sh .
COPY ./worker ./worker

# Runs 'entrypoint.sh' script.
# https://stackoverflow.com/a/50276037/10521456
RUN sed -i 's/\r//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
