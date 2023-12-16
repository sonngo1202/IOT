package com.example.Backend.Controller;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Model.WeatherParameter;
import com.example.Backend.Service.MqttSubscriber;

@RestController
@CrossOrigin
@RequestMapping("/api/iot/weather")
public class WeatherParameterController {
	
	@Autowired
	private MqttSubscriber mqttSubscriber;
	
	@GetMapping("{id}")
	public WeatherParameter getWeatherParameter(@PathVariable int id) throws MqttException {
		return mqttSubscriber.subscribe(id);
	}
}
