package com.example.Backend.Controller;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.DAO.WeatherParameterDAO;
import com.example.Backend.Model.WeatherParameter;

@RestController
@CrossOrigin
@RequestMapping("/api/iot/stat")
public class StatController {
	
	@GetMapping("/month/{id}/{month}")
	public List<WeatherParameter> getStatMonth(@PathVariable int id, @PathVariable String month){
		WeatherParameterDAO weatherParameterDAO = new WeatherParameterDAO();
		return weatherParameterDAO.getStatMonth(month, id); 
	}
	
	@GetMapping("/day/{id}/{day}")
	public List<WeatherParameter> getStatDay(@PathVariable int id, @PathVariable String day ) throws ParseException{
		WeatherParameterDAO weatherParameterDAO = new WeatherParameterDAO();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        java.util.Date utilDate = dateFormat.parse(day);
        Date sqlDate = new Date(utilDate.getTime());
		return weatherParameterDAO.getStatDay(sqlDate, id); 
	}
}