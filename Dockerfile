#  Create a new image from the base nodejs 7 image.
FROM node:8.6 as node
# Set the created directory as the working directory
WORKDIR /app
# Copy the package.json inside the working directory
COPY package.json /app/
# Install required dependencies
RUN npm install

COPY ./ /app/

ARG env=prod

RUN npm run build -- --prod --environment $env

FROM nginx:1.13

COPY --from=node /app/dist/ /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
