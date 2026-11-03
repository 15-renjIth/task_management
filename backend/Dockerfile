
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy backend source
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
