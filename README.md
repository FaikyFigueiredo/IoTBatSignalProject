# **BatSignal Project**

## Description

This project was made for the IoTs chair of Computers Engineer chair on IFPB. This project controls a simple LED with a buton or remotely by a site. Also it saves all the changes of the LEDs state and generates a full graphic showing how much the LED was turned on in the last 24 hours.

## Architecture

We have two nodes(ESP32S3), one with the button and other with the LED, these LEDs are connected by MQTT using a broker(RaspBerry Pi).

For the web connection we have a front end and a back end. The back end connects as a second subscriber in the topic of the LEDs states and stores the data in a SQLite3 DB. Also, every time that the LED changes the state, the back end send an alert to the front end update by a websocket.

The back end can also publish in the topic to change the state of the LED, it just triggers this publish when the front end makes a GET request to the server in /toggleled.
