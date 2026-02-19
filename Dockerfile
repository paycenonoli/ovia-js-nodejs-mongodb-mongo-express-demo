# Use Node 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /usr/app

# Copy only package files first for faster rebuilds
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
