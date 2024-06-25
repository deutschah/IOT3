import json
from threading import Thread
import time

class MessageProcessor:
    def __init__(self, message_queue, processed_queue, interval):
        self.message_queue = message_queue
        self.processed_queue = processed_queue
        self.interval = interval
        self.running = False
        self.processing_thread = Thread(target=self.process_messages)

    def start(self):
        self.running = True
        self.processing_thread.start()

    def stop(self):
        self.running = False
        self.processing_thread.join()

    def process_messages(self):
        while self.running:
            start_time = time.time()
            messages_to_process = []

            with self.message_queue.mutex:
                current_queue_contents = list(self.message_queue.queue)
            print("Current queue contents:", current_queue_contents)

            while not self.message_queue.empty():
                message = self.message_queue.get()
                messages_to_process.append(message)

            if messages_to_process:
                processed_data = self.process_data(messages_to_process)
                self.processed_queue.put(processed_data)

            elapsed_time = time.time() - start_time
            if elapsed_time < self.interval:
                time.sleep(self.interval - elapsed_time)

    def process_data(self, data):
        try:
            data_objects = [json.loads(msg) for msg in data]

            dc_power_values = [obj.get('DC_POWER', 0) for obj in data_objects]
            ac_power_values = [obj.get('AC_POWER', 0) for obj in data_objects]
            total_yield_values = [obj.get('TOTAL_YIELD', 0) for obj in data_objects]
            total_daily_yield_values = [obj.get('DAILY_YIELD', 0) for obj in data_objects]
            timestamps = [obj.get('DATE_TIME') for obj in data_objects]

            avg_dc_power = sum(dc_power_values) / len(dc_power_values) if dc_power_values else 0
            avg_ac_power = sum(ac_power_values) / len(ac_power_values) if ac_power_values else 0
            avg_total_yield = sum(total_yield_values) / len(total_yield_values) if total_yield_values else 0
            avg_daily_yield = sum(total_daily_yield_values) / len(total_daily_yield_values) if total_daily_yield_values else 0
            latest_timestamp = max(timestamps) if timestamps else None
            
            average_object = {
                'DC_POWER': avg_dc_power,
                'AC_POWER': avg_ac_power,
                'TOTAL_YIELD': avg_total_yield,
                'DAILY_YIELD': avg_daily_yield,
                'TIME_STAMP': latest_timestamp

            }

            return average_object
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return None
        except ZeroDivisionError as e:
            print("Error: Division by zero.")
            return None
        
        
    

