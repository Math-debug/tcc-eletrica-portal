FROM node:latest as build-stage

COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm run build

# production stage
FROM nginx:latest as production-stage

RUN mkdir /app
COPY --from=0 /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf