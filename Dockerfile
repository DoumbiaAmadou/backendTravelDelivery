FROM  node:14-slim
WORKDIR /app
COPY   package.json  /app 
RUN npm install 
COPY  . /app 
VOLUME [ "/data" ]
ENV PORT=3000 DB_CONNECTION=$DB_CONNECTION BASE_URL=$BASE_URL JWT_SECRET=$JWT_SECRET
EXPOSE 3000
CMD ["npm", "run", "start:dev"]


