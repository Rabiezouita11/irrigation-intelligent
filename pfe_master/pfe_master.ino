#include <WiFiManager.h>
#include <Servo.h>
#include <WiFi.h>
WiFiManager wm;
const char* ssid = "ESP32";
const char* password = "1234rabie";
unsigned long previousMillis = 0;
unsigned long interval = 10000;
unsigned long lastUpdate = 0;
unsigned long updateInterval = 5000;
float cachedTemperature = 0.0;
#include "time.h"
#include <IOXhop_FirebaseESP32.h>                                             // firebase library
#include "DHT.h"
#define DHTPIN 14
#define DHTTYPE DHT11
#define FIREBASE_HOST "iot-irrigation-smart-default-rtdb.firebaseio.com"
#include <Wire.h>
#define FIREBASE_AUTH "AIzaSyCba_eDDCMY7-vQREAOJY4w_DQB1_PB28A"                    // the secret key generated from firebase
const char* NTPServer = "pool.ntp.org";
const long  GMTOffset_sec = 3600;   //Replace with your GMT offset (seconds)
const int   DayLightOffset_sec = 0;  //Replace with your daylight offset (seconds)
char timeStringBuff[50];//password of wifi ssid
String fireStatus = "";
String mouteurStatus = "";
String modee = "";
String ventilateurStatus = "";

String moteurStatus = "";
String pompeStatus = "";

#define SYSTEM_STATUS_PATH "/Status_du_system/status"
#define RAIN_SENSOR_STATUS_PATH "/System_irrigation_smart/Captuer_de_pluie/status"
#define IRRIGATION_MODE_PATH "/Mode/status"

enum SystemStatus { OFF, ON };

String ledStatus = "";
const int RELAY_PIN_VENTILATEUR = 13; // pin ventilateur
const int RELAY_PIN_LED = 12; // pin ventilateur
const int rainSensor = 27; // Définir le port du capteur de pluie

const int moisturePin = A0;
int moisturePercentage;



#define SIGNAL_PIN 5


Servo myservo;  // create servo object to control a servo
// twelve servo objects can be created on most boards

int pos = 0;


DHT dht(DHTPIN, DHTTYPE);

//float sensorValue = 0; // initialisation de la valeur de capteur a 0

//float hsensor = A4;

//float humidity;

void setup() {


  WiFi.mode(WIFI_STA);

  Serial.begin(115200);
  delay(1000);
  Serial.println("\n");

  if (!wm.autoConnect(ssid, password))
    Serial.println("Erreur de connexion.");
  else
    Serial.println("Connexion etablie!");
  pinMode(RELAY_PIN_VENTILATEUR, OUTPUT);
  pinMode(RELAY_PIN_LED, OUTPUT);
  // pinMode(hsensor, INPUT);

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  configTime(GMTOffset_sec, DayLightOffset_sec, NTPServer);


  dht.begin();
  pinMode(rainSensor, INPUT); // Définir le port du capteur de pluie comme entrée
  myservo.attach(25);
}



//
//void loop() {
//  unsigned long currentMillis = millis();
//
//  if (WiFi.status() != WL_CONNECTED && currentMillis - previousMillis >= interval) {
//    Serial.print(millis());
//    Serial.println("Reconnecting to WiFi...");
//    wm.resetSettings();
//    ESP.restart();
//    previousMillis = currentMillis;
//    return;
//  }
//
//  struct tm timeinfo;
//  if (!getLocalTime(&timeinfo)) {
//    Serial.println("Failed to obtain time");
//    return;
//  }
//
//  strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%d %H:%M:%S", &timeinfo);
//  Firebase.setString(SYSTEM_STATUS_PATH, timeStringBuff);
//
//  String fireStatus = Firebase.getString("/System/status");
//  String irrigationMode = Firebase.getString(IRRIGATION_MODE_PATH);
//
//  SystemStatus systemStatus = (fireStatus.equalsIgnoreCase("OFF")) ? OFF : ON;
//  if (systemStatus == ON) {
//    // Perform operations related to the system being ON
//    // ...
//
//    // Update rain sensor status
//  //  Firebase.setString(RAIN_SENSOR_STATUS_PATH, "high");
//
//    // Control the pump based on the irrigation mode
//    if (irrigationMode.equalsIgnoreCase("manual")) {
//      // Get the manual pump state (true or false) from Firebase
//      bool manualPumpState = Firebase.getBool("/System_irrigation_smart/pompe/status");
//
//      // Perform operations based on manual pump state
//      if (manualPumpState) {
//        // Turn on the pump
//        // Code to turn on the pump
//        Serial.println("Pompe on");
//      } else {
//        // Turn off the pump
//        // Code to turn off the pump
//        Serial.println("Pompe off");
//
//      }
//    } else if (irrigationMode.equalsIgnoreCase("automatic")) {
//      // Perform automatic control of the pump based on other conditions
//      // Code for automatic pump control
//    }
//  } else {
////    Firebase.setString(RAIN_SENSOR_STATUS_PATH, "low");
//  }
//}
void loop() {
  unsigned long currentMillis = millis();

  // Check WiFi connection only if it's been a while since the last check
  if (WiFi.status() != WL_CONNECTED && currentMillis - previousMillis >= interval) {
    Serial.println("Reconnecting to WiFi...");
    wm.resetSettings();
    ESP.restart();  // Consider a more graceful WiFi reconnect strategy
    previousMillis = currentMillis;
    return;
  }

  // Fetch the current time only if needed
  static unsigned long lastTimeUpdate = 0;
  if (currentMillis - lastTimeUpdate >= updateInterval) {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
      Serial.println("Failed to obtain time");
    } else {
      strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%d %H:%M:%S", &timeinfo);
      Firebase.setString(SYSTEM_STATUS_PATH, timeStringBuff);
    }
    lastTimeUpdate = currentMillis;
  }

  // Check system status only if it's been a while since the last check
  static unsigned long lastFirebaseCheck = 0;
  if (currentMillis - lastFirebaseCheck >= updateInterval) {
    String fireStatus = Firebase.getString("/System/status");
    String irrigationMode = Firebase.getString(IRRIGATION_MODE_PATH);

    SystemStatus systemStatus = (fireStatus.equalsIgnoreCase("OFF")) ? OFF : ON;
    if (systemStatus == ON) {
      if (irrigationMode.equalsIgnoreCase("manual")) {
        bool manualPumpState = Firebase.getBool("/System_irrigation_smart/pompe/status");
        if (manualPumpState) {
          Serial.println("Pompe on");
        } else {
          Serial.println("Pompe off");
        }
      } else if (irrigationMode.equalsIgnoreCase("automatic")) {
        // Code for automatic pump control
      }
    }
    lastFirebaseCheck = currentMillis;
  }

  // Add additional logic or sensor readings here if needed
}
