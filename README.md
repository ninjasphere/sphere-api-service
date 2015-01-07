# sphere-api-service

Hosts all the external facing API end points.

# API

## Activation

The following set of end points are part of the activation section of the sphere REST API.

GET `https://api.sphere.ninja/rest/v1/node?access_token=TOKEN_HERE`

```json
{
   "type" : "list",
   "data" : [
      {
         "type" : "node",
         "node_id" : "NSDI123",
         "site_id" : "XXXX-XXXX-XXXX-XXXX-XXXX"
      },
      {
         "node_id" : "TLC123",
         "type" : "node",
         "site_id" : "XXXX-XXXX-XXXX-XXXX-XXXX"
      }
   ]
}
```

GET `https://api.sphere.ninja/rest/v1/activation/sites?access_token=TOKEN_HERE`

```json
{
   "type" : "list",
   "data" : [
      {
         "site_id" : "XXXX-XXXX-XXXX-XXXX-XXXX",
         "master_node_id" : "NSDI123",
         "user_id" : "UUUU-UUUU-UUUU-UUUU-UUUU",
         "updated" : "2014-12-10T06:01:52.000Z"
      }
   ]
}
```

GET `https://api.sphere.ninja/rest/v1/activation/sites/XXXX-XXXX-XXXX-XXXX-XXXX?access_token=TOKEN_HERE`

```json
{
   "data" : {
      "updated" : "2014-12-10T06:01:52.000Z",
      "site_id" : "XXXX-XXXX-XXXX-XXXX-XXXX",
      "master_node_id" : "NSDI60FF0D49C514",
      "user_id" : "UUUU-UUUU-UUUU-UUUU-UUUU"
   },
   "type" : "site"
}
```

POST `https://api.sphere.ninja/rest/v1/activation/sites/XXXX-XXXX-XXXX-XXXX-XXXX/promote/TLC123?access_token=TOKEN_HERE`

```json
{
   "type" : "list",
   "data" : [
      {
         "site_id" : "XXXX-XXXX-XXXX-XXXX-XXXX",
         "master_node_id" : "TLC123",
         "user_id" : "UUUU-UUUU-UUUU-UUUU-UUUU",
         "updated" : "2014-12-10T06:01:52.000Z"
      }
   ]
}
```

DELETE `https://api.sphere.ninja/rest/v1/node/TLC123?access_token=TOKEN_HERE`

```json
{
   "type" : "object",
   "data" : {
      "success" : true
   }
}
```

# docker

Deployment and local testing is done using docker.

To build an image.

```
make build
```

To test locally.

```
make local
```

To deploy 

```
make deploy
```

To point to a docker in a vm use.

```
export DOCKER_ARGS="-H crusty.local:5555"
```


