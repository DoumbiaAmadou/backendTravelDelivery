code
docker build -t w5 .
!important
docker run -it -p80:3000 --name rw5 --env-file .env w5 // lancer bash dans le contenaire.
docker start rw5
docker exec -it rw5 bash
// run docker -composer
docker-compose up
docker-compose down

//autres commands
docker container run -i --name runw5 -p 80:3000 -v .:vol w5

//note de dev!
Process.env.DB_CONNEXION n'est pas reconnu dans le contenair!
solution a setter dans le container.
DODD......
code
