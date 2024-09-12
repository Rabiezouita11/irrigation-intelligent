# Smart Irrigation System

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)
![Angular](https://img.shields.io/badge/Angular-v12%2B-red)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange)


I’m thrilled to unveil my recent project—a Smart Irrigation System that integrates Angular, Node.js, Firebase, and the ESP32 microcontroller. This innovative solution is designed to optimize agricultural irrigation through both manual and automatic control. 

Here’s a detailed look at the project and its features:

### 🔧 **Technologies Used:**
- **Frontend:** Angular
- **Backend:** Node.js
- **Database:** Firebase
- **Microcontroller:** ESP32

### 🛠️ **Key Tasks & Features:**

1. **Frontend Development (Angular) 🚀**
   - Setup Angular project
   - Implement real-time data visualization
   - User interface for manual and automatic irrigation control

2. **Backend Development (Node.js) 🛠️**
   - Set up Express.js server
   - Integrate with Firebase to store and retrieve sensor data
   - Real-time data updates using WebSockets

3. **Firebase Configuration 🔧**
   - Create and configure Firebase project
   - Set up Realtime Database for live data storage
   - Initialize Firebase SDK in both frontend and backend

4. **Sensor Integration 📡**
   - Configure ESP32 to send sensor data
   - Implement Express.js routes to handle incoming data
   - Use Firebase Admin SDK to save data

5. **System Features 🌟**
   - **Manual Mode:** Allows users to control the irrigation pump manually
   - **Automatic Mode:** Automated irrigation based on rain detection, soil moisture, and water levels
   - **Notifications & Alerts:** Real-time alerts for low water levels and insufficient soil moisture

6. **Error Handling & Testing ⚠️🧪**
   - Implement error handling in both frontend and backend
   - Test Firebase integration, ESP32 data transmission, and Angular data display

This project represents a significant step forward in smart agriculture, leveraging cutting-edge technology to make irrigation more efficient and responsive. 

Feel free to reach out if you’re interested in learning more about the project or if you have any questions! 

#SmartIrrigation #Angular #NodeJS #Firebase #ESP32 #WebSockets #IoT #AgricultureTech

## Screenshots

### 🛠️ **Pompe Conditions Events:**

![1724324800133](https://github.com/user-attachments/assets/65eee0b2-ac88-4bbe-9236-e11f92b639b5)

### 🛠️ **Water Niveau Sensor Events ,Capteur de pluie Events:**

![1724324794053](https://github.com/user-attachments/assets/00377c37-e897-434d-83cb-423abe57d1f6)


### 🛠️ **Pompe Off Events ,Pompe On Events:**
![1724324788561](https://github.com/user-attachments/assets/69cafe53-9ad6-47f5-b499-69022580727b)


### 🛠️ **System Mode automatic : Warning: The pump is OFF. Please check the system immediately!**

![1724324782915](https://github.com/user-attachments/assets/5482b2e9-e90d-4a95-a8f7-cc3a3297be46)


### 🛠️ **Weather Data**

![1724324774662](https://github.com/user-attachments/assets/3291a0b1-1492-4546-826b-593b7bdeebf6)


### 🛠️ *System Mode manual**

![1724324766673](https://github.com/user-attachments/assets/24d0bf51-a026-4c2b-8018-d7d3975aefaa)


### 🛠️ *Smart Irrigation System is OFF**

![1724324759497](https://github.com/user-attachments/assets/9776df8b-06c7-4ab9-bedb-8a5f2b1537b0)


### 🛠️ *IoT System is Offline**

![1724324748916](https://github.com/user-attachments/assets/33c69325-7b8e-4656-a83e-51c40819b775)


### 🛠️ *systeme authentification avec firebase**

![1724324737004](https://github.com/user-attachments/assets/c0fe7bcd-c38c-4c71-a22f-e62a7a542e5f)



# Smart Irrigation System with ESP32

## Project Overview

This project involves creating a smart irrigation system using an ESP32 microcontroller. The system utilizes various sensors and actuators to manage irrigation based on real-time data and user-defined settings. The ESP32 is connected to Firebase for remote monitoring and control.

## Components

- **ESP32 Microcontroller**: Main control unit.
- **WiFiManager Library**: Manages WiFi connections.
- **FirebaseESP32 Library**: Handles Firebase interactions.
- **Various sensors and actuators**: Includes water level sensors, rain sensors, and more.

## Sensors and Actuators

### Water Level Sensor
- **Pin**: `A0`
- **Description**: Measures the water level in the reservoir. The analog value is read to determine the water level status (`LOW`, `MEDIUM`, `HIGH`).

### Rain Sensor
- **Pin**: `27`
- **Description**: Detects rain. When the rain is detected, it sends a digital signal indicating `HIGH` (rain detected) or `LOW` (no rain).

### Soil Moisture Sensor
- **Pin**: `A3`
- **Description**: Measures soil moisture percentage. This sensor helps in determining if irrigation is needed based on soil moisture levels.

### Flotteur Sensor
- **Pin**: `A0` (shared with Water Level Sensor)
- **Description**: Additional water level detection; ensure this pin is correctly managed if used for multiple purposes.

### Relay
- **Pin**: `19`
- **Description**: Controls the irrigation pump. When activated, it turns the pump ON or OFF based on the system's requirements.

## Firebase Configuration

- **Firebase Host**: `iot-irrigation-smart-default-rtdb.firebaseio.com`
- **Firebase Auth**: `AIzaSyCba_eDDCMY7-vQREAOJY4w_DQB1_PB28A`

## Time Configuration

- **NTP Server**: `pool.ntp.org`
- **GMT Offset**: `3600 seconds` (1 hour)
- **Daylight Offset**: `0 seconds`

## Firebase Paths

- **System Status**: `/Status_du_system/status`
- **Rain Sensor Status**: `/System_irrigation_smart/Captuer_de_pluie/status`
- **Irrigation Mode**: `/Mode/status`
- **Water Level Sensor Status**: `/System_irrigation_smart/capteur_niveau_eau/status`
- **Soil Moisture**: `/System_irrigation_smart/humidite_du_sol/value`
- **Humidity Agriculturist Value**: `/humiditer_agriculteur/status`
- **Pump History ON**: `/Historique/historiquePompeOn`
- **Pump History OFF**: `/Historique/historiquePompeOff`
- **Water Level Sensor History**: `/Historique/historiqueCapteurdeWaterlevel`
- **Rain Sensor History**: `/Historique/historiqueCapteurDEPLUIE`
- **Pump History**: `/Historique/historiquePompe`
- **Pump Status**: `/System_irrigation_smart/pompe/status`

## Setup and Configuration

1. **Install Required Libraries**: Ensure you have the `WiFiManager`, `WiFi`, `FirebaseESP32`, and `Wire` libraries installed in your Arduino IDE.
2. **Connect to WiFi**: The ESP32 will attempt to connect to the WiFi network specified by `ssid` and `password`.
3. **Configure Firebase**: Replace `FIREBASE_HOST` and `FIREBASE_AUTH` with your Firebase project details.

## Usage

- **Manual Mode**: The system can be controlled manually through Firebase. Adjust water levels and pump status as needed.
- **Automatic Mode**: The system will automatically manage irrigation based on sensor data and pre-defined thresholds.

## Troubleshooting

- **Connection Issues**: Ensure WiFi credentials are correct and check for network connectivity.
- **Sensor Calibration**: Verify sensor readings and calibrate if necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.






