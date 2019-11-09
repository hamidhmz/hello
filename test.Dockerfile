FROM node:12.13-alpine
RUN apk add --no-cache git
WORKDIR /app
CMD ["sh","-c"," npm install jest -g && cd backend && npm install && jest --watchAll"]