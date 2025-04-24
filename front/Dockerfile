FROM node:22-alpine3.21 as builder
WORKDIR /app
COPY .. /app
RUN npm install
WORKDIR /app/back
RUN npx prisma generate
WORKDIR /app/front
RUN npm run build

FROM node:22-alpine3.21
WORKDIR /app/front
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]