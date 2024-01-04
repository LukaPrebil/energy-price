FROM node:21-alpine AS development

WORKDIR /usr/src/app
COPY package*.json config.json ./
RUN npm ci --ignore-scripts --audit=false && npm cache clean --force

COPY src src
EXPOSE 8080
ENTRYPOINT ["npm", "start"]

# ----------- Mid-stage to remove unnecessary files in prod image
FROM node:21-alpine AS preprod-clean
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json config.json ./
COPY --from=development /usr/src/app/src ./src
COPY --from=development /usr/src/app/node_modules ./node_modules
RUN npm prune --production

# ---------- Use the prepared and cleaned image to setup for prod
FROM node:21-alpine

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json config.json ./
COPY --from=preprod-clean /usr/src/app/src ./src
COPY --from=preprod-clean /usr/src/app/node_modules ./node_modules

EXPOSE 8080
ENTRYPOINT ["node", "./src/index.js"]