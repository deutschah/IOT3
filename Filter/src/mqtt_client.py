import asyncio
import logging
import paho.mqtt.client as mqtt
from queue import Empty, Queue



class MQTTClient:
    def __init__(self, broker_address, broker_port, topic,message_queue):
        self.broker_address = "my-mqtt-broker"
        self.broker_port = broker_port
        self.topic = topic
        self.client = None
        self.message_queue = message_queue

    def connect_to_mqtt_broker(self):
        try:
            self.client = mqtt.Client()
            self.client.on_connect = self.on_connect
            self.client.on_message = self.on_message
            self.client.connect(self.broker_address, self.broker_port, 60)
            print("connected to mqtt")
        except ConnectionRefusedError as e:
            logging.error(f"Error connecting to MQTT broker: {e}")
            raise

    def on_connect(self,a,ab, client, rc):
        if rc == 0:
            logging.info("Connected to MQTT broker successfully")
            self.client.subscribe(self.topic)
        else:
            logging.error(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, msg):
        logging.info(f"Message received on topic {msg.topic}: {msg.payload.decode()}")
        print("Message received " , msg)
        self.message_queue.put(msg.payload.decode())

    def start(self):
        if self.client is None:
            self.connect_to_mqtt_broker()
        self.client.loop_start()

    def stop(self):
        if self.client is not None:
            self.client.loop_stop()
            #self.client.disconnect()
