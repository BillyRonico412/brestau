FROM node:22-alpine3.21
WORKDIR /app
COPY . .
RUN npm install
RUN npm install
RUN npx prisma generate
CMD ["npm", "run", "start"]
