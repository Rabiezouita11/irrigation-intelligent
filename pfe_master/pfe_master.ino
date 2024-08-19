#include <WiFiManager.h>
#include <WiFi.h>
#include "time.h"
#include <IOXhop_FirebaseESP32.h>
#include <Wire.h>

WiFiManager wm;

const char* ssid = "ESP32";
const char* password = "1234rabie";
unsigned long previousMillis = 0;
unsigned long interval = 10000;
unsigned long lastUpdate = 0;
unsigned long updateInterval = 5000;

#define FIREBASE_HOST "iot-irrigation-smart-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "AIzaSyCba_eDDCMY7-vQREAOJY4w_DQB1_PB28A"

const char* NTPServer = "pool.ntp.org";
const long  GMTOffset_sec = 3600;
const int   DayLightOffset_sec = 0;
char timeStringBuff[50];

String fireStatus = "";
String modee = "";
const int capteur_D = 4;
const int capteur_A = A0;
int val_analogique;

#define FLOTTEUR_PIN  2
int lowThreshold = 3350;
int highThreshold = 3600;
int val = 0;

String pompeStatus = "";

#define SYSTEM_STATUS_PATH "/Status_du_system/status"
#define RAIN_SENSOR_STATUS_PATH "/System_irrigation_smart/Captuer_de_pluie/status"
#define IRRIGATION_MODE_PATH "/Mode/status"
#define WaterNiveauSensor "/System_irrigation_smart/capteur_niveau_eau/status"
#define HumiditySol "/System_irrigation_smart/humidite_du_sol/value"
#define HumidityAgriculteur "/humiditer_agriculteur/status"
#define HISTORIQUE_POMPE_ON "/System_irrigation_smart/historiquePompeOn"
#define HISTORIQUE_POMPE_OFF "/System_irrigation_smart/historiquePompeOff" // New path for off events

enum SystemStatus { OFF, ON };

const int rainSensor = 27;
const int RELAY_PIN_LED = 19;
const int moisturePin = A3;

int moisturePercentage;
bool previousPumpState = false;  // Track the previous state of the pump

void setup() {
    WiFi.mode(WIFI_STA);
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n");

    if (!wm.autoConnect(ssid, password))
        Serial.println("Erreur de connexion.");
    else
        Serial.println("Connexion etablie!");

    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
    configTime(GMTOffset_sec, DayLightOffset_sec, NTPServer);
    pinMode(rainSensor, INPUT);
    pinMode(RELAY_PIN_LED, OUTPUT);
    pinMode(capteur_D, INPUT);
    pinMode(capteur_A, INPUT);
}

void loop() {
    unsigned long currentMillis = millis();

    if (WiFi.status() != WL_CONNECTED && currentMillis - previousMillis >= interval) {
        Serial.print(millis());
        Serial.println("Reconnecting to WiFi...");
        wm.resetSettings();
        ESP.restart();
        previousMillis = currentMillis;
        return;
    }

    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return;
    }

    strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%d %H:%M:%S", &timeinfo);
    Firebase.setString(SYSTEM_STATUS_PATH, timeStringBuff);
    Serial.println(timeStringBuff);
    Serial.println(SYSTEM_STATUS_PATH);

    String fireStatus = Firebase.getString("/System/status");
    String irrigationMode = Firebase.getString(IRRIGATION_MODE_PATH);
    String humidityAgriculteur = Firebase.getString(HumidityAgriculteur);

    float sensorValue = analogRead(moisturePin);
    float moisturePercentage = map(sensorValue, 0, 4095, 100, 0);
    Firebase.setFloat(HumiditySol, moisturePercentage);

    SystemStatus systemStatus = (fireStatus.equalsIgnoreCase("OFF")) ? OFF : ON;

    if (systemStatus == ON) {
        if (irrigationMode.equalsIgnoreCase("manual")) {
            bool manualPumpState = Firebase.getBool("/System_irrigation_smart/pompe/status");

            if (manualPumpState && !previousPumpState) {
                Serial.println("Pompe on");
                digitalWrite(RELAY_PIN_LED, HIGH);

                // Save the current time to Firebase under historiquePompeOn
                Firebase.pushString(HISTORIQUE_POMPE_ON, timeStringBuff);

                // Update the previousPumpState to true
                previousPumpState = true;
            } else if (!manualPumpState && previousPumpState) {
                Serial.println("Pompe off");
                digitalWrite(RELAY_PIN_LED, LOW);

                // Save the current time to Firebase under historiquePompeOff
                Firebase.pushString(HISTORIQUE_POMPE_OFF, timeStringBuff); // Save the off event

                // Update the previousPumpState to false
                previousPumpState = false;
            }
        } else if (irrigationMode.equalsIgnoreCase("automatic")) {
            val = analogRead(FLOTTEUR_PIN);

            if (val < lowThreshold) {
                Serial.println("Water level: Low");
                Firebase.setString(WaterNiveauSensor, "LOW");
            } else if (val >= lowThreshold && val <= highThreshold) {
                Serial.println("Water level: Normal");
                Firebase.setString(WaterNiveauSensor, "MEDIUM");
            } else {
                Serial.println("Water level: High");
                Firebase.setString(WaterNiveauSensor, "HIGH");
            }

            String WateLevelStatus = Firebase.getString(WaterNiveauSensor);

            if (digitalRead(capteur_D) == LOW) {
                Firebase.setString(RAIN_SENSOR_STATUS_PATH, "HIGH");
                Serial.println("Digital value: Rain detected");
            } else {
                Firebase.setString(RAIN_SENSOR_STATUS_PATH, "LOW");
                Serial.println("Digital value: No rain detected");
            }

            // Check for moisture, water level, or rain first
            if (moisturePercentage >= humidityAgriculteur.toFloat() || WateLevelStatus.equalsIgnoreCase("LOW") || digitalRead(capteur_D) == LOW) {
                Serial.println("Turning off the pump due to adequate soil moisture, low water level, or rain detection.");
                digitalWrite(RELAY_PIN_LED, LOW);  // Turn off the pump
            }
            // If the above conditions are not met, check if moisture is less than target humidity
            else if (moisturePercentage < humidityAgriculteur.toFloat()) {
                Serial.println("Turning on the pump due to low soil moisture.");
                digitalWrite(RELAY_PIN_LED, HIGH); // Turn on the pump
            }
        }
    }
}
