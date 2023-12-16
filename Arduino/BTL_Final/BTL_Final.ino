#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "ROG_Phone3";
const char* password = "999999999";

#define DHTPIN 27
#define DHTTYPE DHT11

int UVOUT = 32; // Output from the sensor connected to GPIO 15
int REF_3V3 = 4; // 3.3V power on the ESP32 board connected to GPIO 4

float mWcm2_min = 0.0; // Giá trị mW/cm^2 tối thiểu
float mWcm2_max = 15.0; // Giá trị mW/cm^2 tối đa

#define MQTT_SERVER "mqtt-dashboard.com"
#define MQTT_PORT 1883
#define MQTT_USER "IOT_BTL"
#define MQTT_PASSWORD "@Adog1202"
#define MQTT_TEMP_TOPIC_1 "IOT/1/Temperature"
#define MQTT_HUM_TOPIC_1 "IOT/1/Humidity"
#define MQTT_UV_TOPIC_1 "IOT/1/UV"

#define MQTT_TOPIC_TEMP_2 "IOT/2/Temperature"
#define MQTT_TOPIC_HUM_2 "IOT/2/Humidity"
#define MQTT_TOPIC_UV_2 "IOT/2/UV"

#define MQTT_TOPIC_TEMP_3 "IOT/3/Temperature"
#define MQTT_TOPIC_HUM_3 "IOT/3/Humidity"
#define MQTT_TOPIC_UV_3 "IOT/3/UV"

#define MQTT_TOPIC_TEMP_4 "IOT/4/Temperature"
#define MQTT_TOPIC_HUM_4 "IOT/4/Humidity"
#define MQTT_TOPIC_UV_4 "IOT/4/UV"

#define MQTT_TOPIC_TEMP_5 "IOT/5/Temperature"
#define MQTT_TOPIC_HUM_5 "IOT/5/Humidity"
#define MQTT_TOPIC_UV_5 "IOT/5/UV"

unsigned long previousMillis = 0;
const long interval = 5000;

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup_wifi() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void connect_to_broker() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "iot";
    clientId += String(random(0xffff), HEX);

    if (client.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}

void callback(char* topic, byte *payload, unsigned int length) {
  // Bỏ trống vì không cần callback trong ví dụ này
}

void setup() {
  pinMode(REF_3V3, OUTPUT); // Set pin mode for 3.3V power pin
  digitalWrite(REF_3V3, HIGH); // Turn on 3.3V power

  Serial.begin(115200);
  setup_wifi();

  dht.begin();

  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
  connect_to_broker();
}

void loop() {
  client.loop();
  
  if (!client.connected()) {
    connect_to_broker();
  }
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    
    int uvLevel = analogRead(UVOUT); // Đọc giá trị analog từ cảm biến UV
    // Chuyển đổi giá trị đọc sang mW/cm^2
    float voltage = uvLevel * (3.3 / 4095.0); // Chuyển đổi giá trị analog sang điện áp
    float uvIntensity = voltage * (mWcm2_max / 3.3) - 4.10; // Đổi điện áp đến đơn vị mW/cm^2
    // Giới hạn giá trị mW/cm^2 từ 0 đến 15
    uvIntensity = constrain(uvIntensity, mWcm2_min, mWcm2_max) ;
    // Station 1
    client.publish(MQTT_TEMP_TOPIC_1, String(temperature, 2).c_str());
    client.publish(MQTT_HUM_TOPIC_1, String(humidity, 2).c_str());
    client.publish(MQTT_UV_TOPIC_1, String(uvIntensity, 2).c_str());

    // Station 2
    client.publish(MQTT_TOPIC_TEMP_2, String(temperature + 1, 2).c_str());
    client.publish(MQTT_TOPIC_HUM_2, String(humidity + 1, 2).c_str());
    client.publish(MQTT_TOPIC_UV_2, String(uvIntensity + 1, 2).c_str());

    // Station 3
    client.publish(MQTT_TOPIC_TEMP_3, String(temperature + 2, 2).c_str());
    client.publish(MQTT_TOPIC_HUM_3, String(humidity + 2, 2).c_str());
    client.publish(MQTT_TOPIC_UV_3, String(uvIntensity + 2, 2).c_str());

    // Station 4
    client.publish(MQTT_TOPIC_TEMP_4, String(temperature + 3, 2).c_str());
    client.publish(MQTT_TOPIC_HUM_4, String(humidity + 3, 2).c_str());
    client.publish(MQTT_TOPIC_UV_4, String(uvIntensity + 3, 2).c_str());

    // Station 5
    client.publish(MQTT_TOPIC_TEMP_5, String(temperature + 4, 2).c_str());
    client.publish(MQTT_TOPIC_HUM_5, String(humidity + 4, 2).c_str());
    client.publish(MQTT_TOPIC_UV_5, String(uvIntensity + 4, 2).c_str());

    //Serial.print("UV Level (mW/cm^2): ");
    //Serial.println(uvIntensity, 2);
    
    delay(0);
}
