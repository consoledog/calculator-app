FROM node:18-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npx tsc
ENV PORT=3000
EXPOSE 3000
CMD ["node","dist/server.js"]
