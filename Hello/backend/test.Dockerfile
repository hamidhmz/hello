FROM node:12.13-alpine
WORKDIR /app
#COPY backend/package.json /app
#VOLUME ./:/app
#RUN npm install

# RUN cd Hello/backend 
# RUN npm install
#VOLUME .:/app
#CMD  ["sh","-c","cd backend && npm","start"]
# test for github branches from local
# test for github branches from remote
CMD ["sh","-c","ls && cd Hello/backend && npm install && npm run start_watch_inspect"]
#CMD "npm start"
