import RPi.GPIO as GPIO
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time

# Distance for the door
distance_door = 2

# Set the GPIO output chanel no.
channel = 7

#set GPIO Pins
GPIO_TRIGGER = 18
GPIO_ECHO = 24

# GPIO setup
GPIO.setmode(GPIO.BCM)  # Define which layout we used for this program
GPIO.setup(channel, GPIO.OUT)   # Define the chanel variable act as a output or input

#set GPIO direction (IN / OUT) For Distance
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

# Connect firebase database
credentials = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(credentials)

# Fetch data from firebase database
db = firestore.client()
status_ref = db.collection(u'LEDStatus').document(u'rycUkHyKsUl0NnS0Ocxi') # Update document id with your own firestore docment id

# Motor Off Method
def motor_off(pin):
    GPIO.output(pin, GPIO.HIGH)  # Turn motor on

# Motor On Method
def motor_on(pin):
    GPIO.output(pin, GPIO.LOW)  # Turn motor off

# Method to findout the distance for the door
def distance():
    # set Trigger to HIGH
    GPIO.output(GPIO_TRIGGER, True)
 
    # set Trigger after 0.01ms to LOW
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)
 
    StartTime = time.time()
    StopTime = time.time()
 
    # save StartTime
    while GPIO.input(GPIO_ECHO) == 0:
        StartTime = time.time()
 
    # save time of arrival
    while GPIO.input(GPIO_ECHO) == 1:
        StopTime = time.time()
 
    # time difference between start and arrival
    TimeElapsed = StopTime - StartTime
    # multiply with the sonic speed (34300 cm/s)
    # and divide by 2, because there and back
    distance = (TimeElapsed * 34300) / 2
 
    return distance

if __name__ == '__main__':
    while True:
        try:
            # Extract fetched data from database
            status_data = status_ref.get()
            light_status = status_data.to_dict()[u'light_status']
            door_status = status_data.to_dict()[u'door_status']

            print("Light Status From Backend: {}".format(light_status))

            # Fetch the distance of the door
            dist = distance()

            if door_status is False and dist <= 4 and light_status is False:
                status_ref.set({
                    'door_status': True,
                    'light_status': True
                })

                light_status = True
            elif door_status is True and dist > 4 and light_status is True:
                status_ref.set({
                    'door_status': False,
                    'light_status': False
                })
                light_status = False
            
            try:
                print("--------------------------------------")
                print(light_status)
                print(door_status)
                print(dist)
                print("----------------------------------------")
                if light_status is True:
                    motor_on(channel)
                    print("Ligh On...")
                    time.sleep(1)
                elif light_status is False:
                    motor_off(channel)
                    print("Light Off...")
                    time.sleep(1)
            except KeyboardInterrupt:
                GPIO.cleanup()
        except google.cloud.exception.NotFound:
            print(u'No Data Found')
        time.sleep(1)
