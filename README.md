# Project Overview

This project consists of several microservices that work together to filter, process, and visualize data. Here's an overview of each component and how they interact:

## Microservices

1. **Filter Microservice (Python):**
   - Connects to an MQTT broker.
   - Listens to messages sent by the Python sensor microservice
   - Calculates the mean value from a specified time window
   - Sends the average value to a NATS topic

2. **Dashboard Microservice(Node.js):**
   - Listens to the NATS topic
   - Inserts the data into an InfluxDB database

3. **Ekuiper:**
   - Subscribed to the MQTT broker on the same topic as the filter microservice
   - Applies rules to detect relevant events
   - Sends messages to a new topic on MQTT based on these events

4. **Web Page Microservice (Pure JavaScript and HTML):**
   - Listens to events from the Ekuiper
   - Displays these events on a web page.

## Dependencies

- **MongoDB Cloud Database:** Stores data accessed by the Python sensor microservice.
- **InfluxDB:** Stores data processed by the dashboard microservice.
- **Grafana:** Visualizes data stored in InfluxDB.

## Running the Project

To run the entire project, use the provided `docker-compose.yaml` file. This file defines the configuration for all microservices and their dependencies. Simply run:

```bash
docker-compose up -d
