package com.example.Backend.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;
import java.util.List;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.Backend.DAO.StationDAO;
import com.example.Backend.DAO.WeatherParameterDAO;
import com.example.Backend.Model.Station;
import com.example.Backend.Model.WeatherParameter;

@Component
public class MqttSubscriberScheduler {

    @Autowired
    private MqttSubscriber mqttSubscriber;

    @Scheduled(fixedRate = 60*60*1000) 
    public void subscribeAndProcessMessage() throws MqttException {
        StationDAO stationDAO = new StationDAO();
        WeatherParameterDAO weatherParameterDAO = new WeatherParameterDAO();
        
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime roundedDownDateTime = currentDateTime.withMinute(0).withSecond(0).withNano(0);
        Time currentTime = Time.valueOf(roundedDownDateTime.toLocalTime());
        Date currentDay = Date.valueOf(currentDateTime.toLocalDate());

        List<Station> listStation = stationDAO.getAllStation();
        for (Station station : listStation) {
            WeatherParameter weatherParameter = mqttSubscriber.subscribe(station.getId());
            weatherParameter.setStation(station);
            weatherParameter.setEvent_time(currentTime);
            weatherParameter.setEvent_date(currentDay);
            boolean kq = weatherParameterDAO.saveWeatherParameter(weatherParameter);
            if (!kq) {
                System.out.println("Lưu thất bại ở trạm " + station.getName());
            }
        }
    }
}
