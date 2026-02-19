FROM node:22-slim
WORKDIR /app
COPY package* /app
RUN npm install
COPY . .
CMD ["node", "server.js"]
