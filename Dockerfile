FROM  node:14-slim
WORKDIR /app
COPY   package.json  /app 
RUN npm install 
COPY  . /app 
ENV PORT=3000 DB_CONNEXION=$DB_CONNEXION BASE_URL=$BASE_URL JWT_SECRET=$JWT_SECRET
EXPOSE 3000
CMD ["npm", "run", "start"]
