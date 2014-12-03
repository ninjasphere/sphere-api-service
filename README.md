# sphere-api-service

Hosts all the external facing API end points.

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


