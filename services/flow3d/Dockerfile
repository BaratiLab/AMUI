# Uses `ubi8:8.5` to allow for subscription manager to work inside container.
# https://serverfault.com/a/1115318/525986
# FROM redhat/ubi8:8.5

FROM redhat/ubi8:8.10

ARG DEVELOPMENT
ARG LICENSE_SERVER
ARG REDHAT_PASSWORD
ARG REDHAT_USERNAME

WORKDIR /home/flow3d-docker

# Copies flow3d installation file to docker container.
COPY . .

# Creates folder for unpacked flow_3d installer outsize of `flow3d` volume.
RUN mkdir ./installer

# Unzips download file for flow3d
RUN tar -xvf ./download/*.tar.gz --directory ./installer

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

# # Create Virutal Environment for python
RUN python3.12 -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt

RUN if ["$DEVELOPMENT" = "true"]; then \
        . venv/bin/activate && pip install -e ./githubs/Flow3D; \
    else \
        . venv/bin/activate && pip install flow3d; \
    fi

# # Installs `prepin_builder` package locally first.
# # RUN pip3 install -e .

# Changes directory to created `flow3d_installer`.
WORKDIR /home/flow3d-docker/installer

# Automatically provides reponses when installing flow3d.
# 1. Would you like to read the LICENSE AGREEMENT? - no
# 2. DO YOU ACCEPT ALL OF THE TERMS OF THE PRECEDING LICENSE AGREEMENT? - yes
# 3. Choose the type of installation - 2 (FLOW-3D v12.0 Update 2 Release 7 only)
# 4. Press 'ENTER' to install using the default directory - ENTER
# 5. Would you like to opt out of viewing the FLOW-3D RSS feed? - yes
# 6. Would you like to continue ?  (please respond with 'yes' or 'no') - yes
# 7. Please specify the name or IP address of the FLOW-3D License Server - LICENSE_SERVER
# 8. Please specify the name or IP address of the Samuserver - LICENSE_SERVER
# 9. Would you like to create desktop icons for root? ('yes' or 'no') - no
# 10. Would you like to create desktop icons for some users? (please respond with 'yes' or 'no') - no
RUN echo -e "no\nyes\n2\n\n\nyes\nyes\n${LICENSE_SERVER}\n${LICENSE_SERVER}\nno\nno\n" | ./FSJModuleinstaller.sh

# Copies flow3d script set environment variables automatically when shell opens.
RUN cp /opt/flow3d/v12_u2_fsj_module_3_0_r7/local/flow3dvars.sh /etc/profile.d/custom.sh

# Changes directory to base.
WORKDIR /home/flow3d-docker

# Removes unnessary folders.
RUN rm -rf download installer static

# Removes submodules folder.
RUN if ["$DEVELOPMENT" != "true"]; then rm -rf githubs; fi