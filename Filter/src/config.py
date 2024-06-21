import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')
    MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
    BROKER_ADDRESS = os.getenv('BROKER_ADDRESS')
    BROKER_PORT = int(os.getenv('BROKER_PORT'))
    MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'sensor/data')
    NATS_SERVER = os.getenv('NATS_SERVER', 'nats://localhost:4222')
    NATS_TOPIC = os.getenv('NATS_TOPIC', 'analytics.data')
    TIME_WINDOW_SIZE = int(os.getenv('TIME_WINDOW_SIZE', 60))

config = Config()

