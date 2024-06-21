import asyncio
import logging
from config import config
import paho.mqtt.client as mqtt
from messageProcessor import MessageProcessor
from mqqt_client import MQTTClient
from queue import Queue

from nats_client import NATSClient

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    
    messageQueue=Queue()
    processed_queue = Queue()
    mqtt_client = MQTTClient(
        broker_address=config.BROKER_ADDRESS,
        broker_port=config.BROKER_PORT,
        topic=config.MQTT_TOPIC,
        message_queue=messageQueue
    )

    message_processor = MessageProcessor(
        message_queue=messageQueue,
        processed_queue=processed_queue,
        interval=15  
    )
    nats_client = NATSClient(
        nats_server='nats://localhost:4222',
        nats_topic='analytics.data',
        processed_queue=processed_queue
    )

  
    try:
        message_processor.start()
        mqtt_client.start()
        asyncio.run(nats_client.process_and_send_data())
        while True:
            pass
    except KeyboardInterrupt:
        logging.info("Disconnecting from MQTT broker and everything")
        mqtt_client.stop()
