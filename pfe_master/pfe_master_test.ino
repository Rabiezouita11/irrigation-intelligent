#include <WiFiManager.h>
#include <WiFi.h>
#include "time.h"
#include <IOXhop_FirebaseESP32.h>
#include <Wire.h>

WiFiManager wm;

const char* ssid = "ESP32";
const char* password = "1234rabie";
unsigned long previousMillis = 0;
const unsigned long interval = 10000;

#define FIREBASE_HOST "iot-irrigation-smart-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "AIzaSyCba_eDDCMY7-vQREAOJY4w_DQB1_PB28A"

const char* NTPServer = "pool.ntp.org";
const long GMTOffset_sec = 3600;
const int DayLightOffset_sec = 0;
char timeStringBuff[50];

String previousPumpOffReasons = ""; // Stores the last reasons that triggered a push to Firebase

#define FLOTTEUR_PIN  2
#define RAIN_SENSOR_PIN 27
#define RELAY_PIN_LED 19
#define MOISTURE_PIN A3
#define SYSTEM_STATUS_PATH "/Status_du_system/status"
#define RAIN_SENSOR_STATUS_PATH "/System_irrigation_smart/Captuer_de_pluie/status"
#define IRRIGATION_MODE_PATH "/Mode/status"
#define WaterNiveauSensor "/System_irrigation_smart/capteur_niveau_eau/status"
#define HumiditySol "/System_irrigation_smart/humidite_du_sol/value"
#define HumidityAgriculteurvalue "/humiditer_agriculteur/status"
#define HISTORIQUE_POMPE_ON "/Historique/historiquePompeOn"
#define HISTORIQUE_POMPE_OFF "/Historique/historiquePompeOff"
#define HISTORIQUE_CAPTEURWATERLEVEL "/Historique/historiqueCapteurdeWaterlevel"
#define HISTORIQUE_CAPTEURDEPLUIE "/Historique/historiqueCapteurDEPLUIE"
#define HISTORIQUE_POMPE "/Historique/historiquePompe"

const int lowThreshold = 3350;
const int highThreshold = 3600;

SystemStatus systemStatus = OFF;
bool previousPumpState = false; // Track the previous state of the pump

void setup() {
    WiFi.mode(WIFI_STA);
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n");

    if (!wm.autoConnect(ssid, password)) {
        Serial.println("Erreur de connexion.");
        ESP.restart();
    } else {
        Serial.println("Connexion etablie!");
    }

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    configTime(GMTOffset_sec, DayLightOffset_sec, NTPServer);
    pinMode(RAIN_SENSOR_PIN, INPUT);
    pinMode(RELAY_PIN_LED, OUTPUT);
    pinMode(FLOTTEUR_PIN, INPUT);
    pinMode(MOISTURE_PIN, INPUT);
}

void updateWiFiStatus(unsigned long currentMillis) {
    if (WiFi.status() != WL_CONNECTED && currentMillis - previousMillis >= interval) {
        Serial.println("Reconnecting to WiFi...");
        wm.resetSettings();
        ESP.restart();
    }
}

void updateSystemTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }
    strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%d %H:%M:%S", &timeinfo);
    Firebase.setString(SYSTEM_STATUS_PATH, timeStringBuff);
    Serial.println(timeStringBuff);
}

void checkPumpStatus() {
    String fireStatus = Firebase.getString("/System/status");
    systemStatus = fireStatus.equalsIgnoreCase("OFF") ? OFF : ON;
}

float readMoistureSensor() {
    int sensorValue = analogRead(MOISTURE_PIN);
    return map(sensorValue, 0, 4095, 100, 0);
}

void updateWaterLevel() {
    int val = analogRead(FLOTTEUR_PIN);
    String currentWaterLevelStatus = "HIGH";

    if (val < lowThreshold) {
        currentWaterLevelStatus = "LOW";
    } else if (val >= lowThreshold && val <= highThreshold) {
        currentWaterLevelStatus = "MEDIUM";
    }

    Firebase.setString(WaterNiveauSensor, currentWaterLevelStatus);
    Firebase.pushString(HISTORIQUE_CAPTEURWATERLEVEL, currentWaterLevelStatus + " " + timeStringBuff);
}

void controlPump(bool turnOn) {
    digitalWrite(RELAY_PIN_LED, turnOn ? HIGH : LOW);
    previousPumpState = turnOn;

    String pumpHistoryPath = turnOn ? HISTORIQUE_POMPE_ON : HISTORIQUE_POMPE_OFF;
    Firebase.pushString(pumpHistoryPath, timeStringBuff);
}

void handleAutomaticMode(float moisturePercentage, int humidityAgriculteur) {
    String pumpOffReasons = "";
    String currentRainSensorStatus = digitalRead(RAIN_SENSOR_PIN) == LOW ? "HIGH" : "LOW";

    Firebase.setString(RAIN_SENSOR_STATUS_PATH, currentRainSensorStatus);
    Firebase.pushString(HISTORIQUE_CAPTEURDEPLUIE, currentRainSensorStatus + " " + timeStringBuff);

    if (moisturePercentage >= humidityAgriculteur) {
        pumpOffReasons += "Moisture High, ";
    }

    if (digitalRead(FLOTTEUR_PIN) < lowThreshold) {
        pumpOffReasons += "Water Level Low, ";
    }

    if (currentRainSensorStatus.equals("HIGH")) {
        pumpOffReasons += "Rain Detected, ";
    }

    if (!pumpOffReasons.isEmpty() && pumpOffReasons != previousPumpOffReasons) {
        Firebase.pushString(HISTORIQUE_POMPE, pumpOffReasons + timeStringBuff);
        previousPumpOffReasons = pumpOffReasons;
        controlPump(false);
    } else if (moisturePercentage < humidityAgriculteur) {
        controlPump(true);
    }
}

void loop() {
    unsigned long currentMillis = millis();

    updateWiFiStatus(currentMillis);
    updateSystemTime();

    if (systemStatus == ON) {
        updateWaterLevel();
        float moisturePercentage = readMoistureSensor();
        Firebase.setFloat(HumiditySol, moisturePercentage);

        String irrigationMode = Firebase.getString(IRRIGATION_MODE_PATH);
        int humidityAgriculteur = Firebase.getInt(HumidityAgriculteurvalue);

        if (irrigationMode.equalsIgnoreCase("manual")) {
            bool manualPumpState = Firebase.getBool("/System_irrigation_smart/pompe/status");
            if (manualPumpState != previousPumpState) {
                controlPump(manualPumpState);
            }
        } else if (irrigationMode.equalsIgnoreCase("automatic")) {
            handleAutomaticMode(moisturePercentage, humidityAgriculteur);
        }
    }
}
