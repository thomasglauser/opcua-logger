<div align="center">

[![CodeQL](https://github.com/thomasglauser/opcua-logger/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/thomasglauser/opcua-logger/actions/workflows/codeql-analysis.yml)
[![Publish Docker image](https://github.com/thomasglauser/opcua-logger/actions/workflows/docker-image.yml/badge.svg)](https://github.com/thomasglauser/opcua-logger/actions/workflows/docker-image.yml)
![GitHub](https://img.shields.io/github/license/thomasglauser/opcua-logger)
![GitHub issues](https://img.shields.io/github/issues-raw/thomasglauser/opcua-logger)

  <h1 align="center">OPCUA logger</h1>

  <h3 align="center">
    Log OPC UA data to InfluxDB v2 with Docker
    <br />
    <br />
    <br />
  </h3>
</div>

### Features

-   Easy deployment with docker-compose
-   Cross platform compatibility
-   Logs numbers, booleans and strings

### Built With

-   [Node.js](https://nodejs.org)
-   [InfluxDB v2](https://influxdata.com/products/influxdb)
-   [Docker](https://docker.com/)
-   [NodeOPCUA](https://node-opcua.github.io)

## Deployment with docker-compose

1. Clone the repo.

    ```sh
    git clone https://github.com/thomasglauser/opcua-logger.git
    ```

2. Create an .env file and define all required variables as specified in the example.env file.

    ```sh
    touch .env
    ```

3. Create an config.json file and configure your OPC UA server interface as specified in the example.config.json file.

    ```sh
    touch config.json
    ```

4. Start the services.

    ```sh
    docker-compose up -d
    ```

5. Log in to the InfluxDB web interface and complete the initial setup. You need to create a new authentication token and add it to the .env file as "INFLUX_TOKEN".
6. Restart the services. opcua-logger can now authenticate with the token.

    ```sh
     docker-compose restart
    ```

## Credits

This is a Fork of [
node-opcua-logger
](https://github.com/coussej/node-opcua-logger)

Thanks to:

-   Jeroen Coussement - [@coussej](https://twitter.com/coussej) - [coussej.github.io](http://coussej.github.io) - [factry.io](https://www.factry.io)
-   Etienne Rossignon - [@gadz_er](https://twitter.com/gadz_er) - for creating the fantastic [node-opcua](https://github.com/node-opcua/node-opcua) library.

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.
