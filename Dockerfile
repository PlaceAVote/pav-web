FROM node:0.10

EXPOSE 3000
ENV PORT 3000

WORKDIR /app

COPY . /app

CMD ["node", "app.js"]
