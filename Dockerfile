FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/src ./src
COPY server/tsconfig.json .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/index.js"]
