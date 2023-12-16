package com.example.Backend.Config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MqttConfig {

    @Value("${mqtt.broker}")
    private String brokerUrl;

    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;
    
    @Value("${mqtt.clientID}")
    private String clientID;

    @Bean
    public MqttClient mqttClient() {
        try {
            MqttConnectOptions mqttConnectOptions = new MqttConnectOptions();
            mqttConnectOptions.setUserName(username);
            mqttConnectOptions.setPassword(password.toCharArray());
            mqttConnectOptions.setKeepAliveInterval(60);
            mqttConnectOptions.setAutomaticReconnect(true);
            mqttConnectOptions.setCleanSession(true);
            mqttConnectOptions.setConnectionTimeout(10);

            MqttClient mqttClient = new MqttClient(brokerUrl, clientID);
            mqttClient.connect(mqttConnectOptions);
            return mqttClient;
        } catch (MqttException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create MqttClient", e);
        }
    }

}
