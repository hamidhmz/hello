FROM node
WORKDIR /app
COPY backend/package.json /app
RUN npm install
#VOLUME .:/app
#CMD  ["sh","-c","cd backend && npm","start"]
CMD ["sh","-c","cd backend && npm start"]
