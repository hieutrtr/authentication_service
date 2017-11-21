# Authentication service of Smartlog ecosystem #

The below image describes how microservices of Smartlog's ecosystem interact with the authentication service.

![Smartlog microservices](images/microservices.png =300x150)

We will use [JWT](https://jwt.io/introduction/) to do the authentication. Because it does not require every user have a key pair. It will reduce the change of hacking and steal the privacy information.

Whenever a user requests to a specific service, if he is not authenticated by the system, he will be redirected to the login page of Authentication Service. Once user login, he will receive a response with a signature from Authentication service generated with private key. It will be used to sign for every further request to the service.

When a service receives request with embeded signature from user, it uses the public key of the system in database to decode the signature. If service can decode the signature, it will process the request. Otherwise, it responses with 404 Error code.