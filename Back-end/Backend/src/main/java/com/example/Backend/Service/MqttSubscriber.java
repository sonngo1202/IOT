package com.example.Backend.Service;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.Backend.Model.WeatherParameter;

@Component
public class MqttSubscriber {

    @Autowired
    private MqttClient mqttClient;

    public WeatherParameter subscribe(int id) throws MqttException {
        WeatherParameter weatherParameter = new WeatherParameter();
        mqttClient.subscribe("IOT/"+id+"/Temperature", (topic, message) -> {
            weatherParameter.setTemp(Float.parseFloat(new String(message.getPayload()).trim()));
        });
        mqttClient.subscribe("IOT/"+id+"/Humidity", (topic, message) -> {
            weatherParameter.setHumi(Float.parseFloat(new String(message.getPayload()).trim()));
        });
        mqttClient.subscribe("IOT/"+id+"/UV", (topic, message) -> {
            weatherParameter.setUv(Float.parseFloat(new String(message.getPayload()).trim()));
        });
        return weatherParameter;
    }

}
