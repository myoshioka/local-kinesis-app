# Kinesis sample app

-  Local Development with [kinesalite](https://github.com/mhart/kinesalite).

## Start kinesis process

```shell
export AWS_CBOR_DISABLE=1
node start-kinesis.js ./node_modules/.bin/dynalite --port 4568
```

## Start consumer process

- properties file

```propertie
## add 
kinesisEndpoint = http://localhost:4567
executableName = node consumer_sample.js
```

```shell
./node_modules/aws-kcl/bin/kcl-bootstrap --java /usr/bin/java --properties sample.properties -e
```

## start producer process

```shell
node producer/producer_sample.js
```

