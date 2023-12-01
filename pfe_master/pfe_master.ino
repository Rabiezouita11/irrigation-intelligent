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

void loop()
{
  unsigned long currentMillis = millis();
  // if WiFi is down, try reconnecting every CHECK_WIFI_TIME seconds
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >= interval)) {
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
  Firebase.setString("/Status_du_system/status", timeStringBuff);








}
