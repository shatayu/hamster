FROM node:18-alpine

WORKDIR /home/shatayu/Desktop/hamster

COPY package*.json ./

# If you are building your code for production
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]