FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "start:dev"]