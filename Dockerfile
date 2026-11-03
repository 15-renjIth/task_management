
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

EXPOSE 5173

# Start Vite and expose it outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
