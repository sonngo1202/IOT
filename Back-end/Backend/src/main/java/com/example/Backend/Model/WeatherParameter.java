package com.example.Backend.Model;

import java.sql.Date;
import java.sql.Time;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WeatherParameter {
	int id;
	Time event_time;
	Date event_date;
	float temp;
	float humi;
	float uv;
	Station station;
}

