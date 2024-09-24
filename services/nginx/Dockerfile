# Use the official NGINX image as the base image
FROM nginx:latest

# Define build-time argument SSL_HOST
ARG DJANGO_HOST

# Install OpenSSL to generate the self-signed certificate
RUN apt-get update && apt-get install -y openssl

# Create a directory for the SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Generate a self-signed certificate using SSL_HOST as the Common Name
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key -out /etc/nginx/ssl/selfsigned.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=${DJANGO_HOST}"

# Copy your custom NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf.template

# Replace DJANGO_HOST in the nginx.conf template with the actual value and move it to the correct location
RUN envsubst '$DJANGO_HOST' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Expose ports 80 and 443 for HTTP and HTTPS traffic
EXPOSE 80 443
