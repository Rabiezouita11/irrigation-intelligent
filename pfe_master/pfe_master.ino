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
const long GMTOffset_sec = 3600;
const int DayLightOffset_sec = 0;
char timeStringBuff[50];

String fireStatus = "";
String modee = "";
const int capteur_D = 4;
const int capteur_A = A0;
int val_analogique;

#define FLOTTEUR_PIN A0    // Assuming A0 is the correct analog pin
int lowThreshold = 1350;   // Initial threshold for low water level
int highThreshold = 2090;  // Initial threshold for high water level
int val = 0;

String pompeStatus = "";

#define SYSTEM_STATUS_PATH "/Status_du_system/status"
#define RAIN_SENSOR_STATUS_PATH "/System_irrigation_smart/Captuer_de_pluie/status"
#define IRRIGATION_MODE_PATH "/Mode/status"
#define WaterNiveauSensor "/System_irrigation_smart/capteur_niveau_eau/status"
#define HumiditySol "/System_irrigation_smart/humidite_du_sol/value"
#define HumidityAgriculteurvalue "/humiditer_agriculteur/status"
#define HISTORIQUE_POMPE_ON "/Historique/historiquePompeOn"
#define HISTORIQUE_POMPE_OFF "/Historique/historiquePompeOff"  // New path for off events
#define HISTORIQUE_CAPTEURWATERLEVEL "/Historique/historiqueCapteurdeWaterlevel"
#define HISTORIQUE_CAPTEURDEPLUIE "/Historique/historiqueCapteurDEPLUIE"
#define HISTORIQUE_POMPE "/Historique/historiquePompe"
String previousPumpOffReasons = "";  // Stores the last reasons that triggered a push to Firebase

enum SystemStatus { OFF,
                    ON };

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
  pinMode(FLOTTEUR_PIN, INPUT);  // Make sure to set the pinMode for the analog pin
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
  int humidityAgriculteur = Firebase.getInt(HumidityAgriculteurvalue);
  Serial.println(humidityAgriculteur);

  float sensorValue = analogRead(moisturePin);
  float moisturePercentage = map(sensorValue, 0, 4095, 100, 0);
  Firebase.setFloat(HumiditySol, moisturePercentage);

  SystemStatus systemStatus = (fireStatus.equalsIgnoreCase("OFF")) ? OFF : ON;

  static String previousWaterLevelStatus = "";
  static String previousRainSensorStatus = "";
  static bool previousPumpState = false;

  String pumpOffReasons = "";  // Reset reasons for this loop

  if (systemStatus == ON) {




    if (irrigationMode.equalsIgnoreCase("manual")) {

      val = analogRead(FLOTTEUR_PIN);
      Serial.println(val);

      String currentWaterLevelStatus;
      if (val < lowThreshold) {
        Serial.println("Water level: Low");
        Firebase.setString(WaterNiveauSensor, "LOW");
        currentWaterLevelStatus = "LOW";
      } else if (val >= lowThreshold && val <= highThreshold) {
        Serial.println("Water level: Normal");
        Firebase.setString(WaterNiveauSensor, "MEDIUM");
        currentWaterLevelStatus = "MEDIUM";
      } else {
        Serial.println("Water level: High");
        Firebase.setString(WaterNiveauSensor, "HIGH");
        currentWaterLevelStatus = "HIGH";
      }

      if (currentWaterLevelStatus != previousWaterLevelStatus) {
        Firebase.pushString(HISTORIQUE_CAPTEURWATERLEVEL, currentWaterLevelStatus + " " + timeStringBuff);
        previousWaterLevelStatus = currentWaterLevelStatus;
      }
      bool manualPumpState = Firebase.getBool("/System_irrigation_smart/pompe/status");
      if (manualPumpState) {
        Serial.println("Pompe on");
        digitalWrite(RELAY_PIN_LED, HIGH);

        Firebase.pushString(HISTORIQUE_POMPE_ON, timeStringBuff);
      } else if (!manualPumpState) {
        Serial.println("Pompe off");
        digitalWrite(RELAY_PIN_LED, LOW);

      }
      if (manualPumpState && !previousPumpState) {
        Serial.println("Pompe on");

        Firebase.pushString(HISTORIQUE_POMPE_ON, timeStringBuff);
        previousPumpState = true;
      } else if (!manualPumpState && previousPumpState) {
        Serial.println("Pompe off");

        Firebase.pushString(HISTORIQUE_POMPE_OFF, timeStringBuff);
        previousPumpState = false;
      }
    } else if (irrigationMode.equalsIgnoreCase("automatic")) {


      val = analogRead(FLOTTEUR_PIN);
      Serial.println(val);

      String currentWaterLevelStatus;
      if (val < lowThreshold) {
        Serial.println("Water level: Low");
        Firebase.setString(WaterNiveauSensor, "LOW");
        currentWaterLevelStatus = "LOW";
      } else if (val >= lowThreshold && val <= highThreshold) {
        Serial.println("Water level: Normal");
        Firebase.setString(WaterNiveauSensor, "MEDIUM");
        currentWaterLevelStatus = "MEDIUM";
      } else {
        Serial.println("Water level: High");
        Firebase.setString(WaterNiveauSensor, "HIGH");
        currentWaterLevelStatus = "HIGH";
      }

      if (currentWaterLevelStatus != previousWaterLevelStatus) {
        Firebase.pushString(HISTORIQUE_CAPTEURWATERLEVEL, currentWaterLevelStatus + " " + timeStringBuff);
        previousWaterLevelStatus = currentWaterLevelStatus;
      }


      String currentRainSensorStatus;
      if (digitalRead(capteur_D) == LOW) {
        Firebase.setString(RAIN_SENSOR_STATUS_PATH, "HIGH");
        Serial.println("Digital value: Rain detected");
        currentRainSensorStatus = "HIGH";
      } else {
        Firebase.setString(RAIN_SENSOR_STATUS_PATH, "LOW");
        Serial.println("Digital value: No rain detected");
        currentRainSensorStatus = "LOW";
      }

      if (currentRainSensorStatus != previousRainSensorStatus) {
        Firebase.pushString(HISTORIQUE_CAPTEURDEPLUIE, currentRainSensorStatus + " " + timeStringBuff);
        previousRainSensorStatus = currentRainSensorStatus;
      }

      Serial.println(humidityAgriculteur);
      Serial.println(moisturePercentage);

      if (moisturePercentage >= humidityAgriculteur) {
        Serial.println("Turning off the pump due to adequate soil moisture.");
        pumpOffReasons += "Moisture High, ";
        digitalWrite(RELAY_PIN_LED, LOW);
      }

      if (currentWaterLevelStatus.equalsIgnoreCase("LOW")) {
        Serial.println("Turning off the pump due to low water level.");
        pumpOffReasons += "Water Level Low, ";
        digitalWrite(RELAY_PIN_LED, LOW);
      }

      if (digitalRead(capteur_D) == LOW) {
        Serial.println("Turning off the pump due to rain detection.");
        pumpOffReasons += "Rain Detected, ";
        digitalWrite(RELAY_PIN_LED, LOW);
      }
      if (pumpOffReasons != previousPumpOffReasons) {
        // Push to Firebase if the reasons have changed
        Firebase.pushString(HISTORIQUE_POMPE, pumpOffReasons + timeStringBuff);
        previousPumpOffReasons = pumpOffReasons;  // Update the previous reasons
        previousPumpState = false;
      }
      if (moisturePercentage < humidityAgriculteur) {
        Serial.println("Turning on the pump due to low soil moisture.");
        digitalWrite(RELAY_PIN_LED, HIGH);
        previousPumpState = true;
      }
    }
  }
}
