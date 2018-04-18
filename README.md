# Authentication service of Smartlog ecosystem #

The below image describes how microservices of Smartlog's ecosystem interact with the authentication service.

![Smartlog microservices](images/microservices.png =300x150)

We will use [JWT](https://jwt.io/introduction/) to do the authentication. Because it does not require every user have a key pair. It will reduce the change of hacking and steal the privacy information.

Whenever a user requests to a specific service, if he is not authenticated by the system, he will be redirected to the login page of Authentication Service. Once user login, he will receive a response with a signature from Authentication service generated with private key. It will be used to sign for every further request to the service.

When a service receives request with embeded signature from user, it uses the public key of the system in database to decode the signature. If service can decode the signature, it will process the request. Otherwise, it responses with 404 Error code.
### TODO
* optimize connection pool
* correct sequenlize define
* add essential middleware

### Quick Start
MySQL
```bash
docker run --name=mysql1 -p 3306:3306 -p 33060:33060 -d mysql/mysql-server:5.7

docker logs mysql1 # to get GENERATED ROOT PASSWORD

docker exec -it mysql1 mysql -uroot -p # enter password
```
Redis
```bash
docker run --name redis -p 6379:6379  -d redis redis-server --appendonly yes
```
Use environment variables for configuration of ORM database (MySQL).
```bash
export DB_HOST=localhost DB_NAME=smlauth DB_USER=hieu DB_PASSWORD=123456
```
Use environment variables for configuration of JWT + Redis.
```bash
export REDIS_PORT=6379 REDIS_HOST=localhost JWT_KEY=sml#uthen
```
Start service
```bash
npm i
npm start
```
Build production
```bash
npm i
bash build.js
node main.js # Entrypoint
```
Test service
```bash
npm test
```
Run docker
```bash
docker run --name smartlog-auth-service -p 3000:3000 \
--link mysql1 --link redis \
-e DB_HOST=mysql1 \
-e DB_NAME=smlauth \
-e DB_USER=hieu \
-e DB_PASSWORD=123456 \
-e REDIS_PORT=6379 \
-e REDIS_HOST=redis \
-e JWT_KEY=sml#uthen \
 -d smartlog-auth-service
```
