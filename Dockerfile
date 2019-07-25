FROM node
WORKDIR /app
#COPY backend/package.json /app
#VOLUME ./:/app
#RUN npm install

#RUN cd backend
#VOLUME .:/app
#CMD  ["sh","-c","cd backend && npm","start"]
#this is a test for github
CMD ["sh","-c","ls && cd backend && npm install && npm start"]
#CMD "npm start"
