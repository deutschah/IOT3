import asyncio
import logging
from queue import Empty
import nats
import json 

class NATSClient:
    def __init__(self, nats_server, nats_topic, processed_queue):
        self.nats_server = nats_server
        self.nats_topic = nats_topic
        self.processed_queue = processed_queue
        self.nc = None

    async def connect_to_nats(self):
        self.nc = await nats.connect(self.nats_server)
        logging.info("Connected to NATS server")

    async def process_and_send_data(self):
        await self.connect_to_nats()
        while True:
            try:
                message = self.processed_queue.get_nowait()
                logging.info(f"Sending message to NATS: {message}")
                json_message = json.dumps(message)
                await self.nc.publish(self.nats_topic, json_message.encode('utf-8'))
                #await self.nc.publish(self.nats_topic, str(message).encode())
            except Empty:
                await asyncio.sleep(1)  
            except Exception as e:
                logging.error(f"Error sending message to NATS: {e}")

    def start(self):
        asyncio.run(self.process_and_send_data())
