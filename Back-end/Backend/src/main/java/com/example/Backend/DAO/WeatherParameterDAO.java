package com.example.Backend.DAO;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.example.Backend.Model.WeatherParameter;

public class WeatherParameterDAO extends DAO{

	public WeatherParameterDAO() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public boolean saveWeatherParameter(WeatherParameter weatherParameter) {
		boolean kq = false;
		String query = "INSERT INTO tblweatherparameter (event_time, event_date, temp, humi, uv, idtblStation) VALUES (?, ?, ?, ?, ?, ?)";
		try {
			PreparedStatement ps = con.prepareStatement(query);
		    ps.setTime(1, weatherParameter.getEvent_time());
		    ps.setDate(2, weatherParameter.getEvent_date());
		    ps.setFloat(3, weatherParameter.getTemp());
		    ps.setFloat(4, weatherParameter.getHumi());
		    ps.setFloat(5, weatherParameter.getUv());
		    ps.setInt(6, weatherParameter.getStation().getId());
		    ps.executeUpdate();
		    kq = true;
		}catch(Exception e) {
			e.printStackTrace();
			kq = false;
		}
		return kq;
	}
	
	public List<WeatherParameter> getStatDay(Date day, int id){
		List<WeatherParameter> listWeatherParameter = new ArrayList<>();
		String query = "SELECT * FROM tblweatherparameter WHERE event_date = ? AND idtblStation = ?";
		try {
			PreparedStatement ps = con.prepareStatement(query);
			ps.setDate(1, day);
			ps.setInt(2, id);
			ResultSet rs = ps.executeQuery();
			while(rs.next()) {
				WeatherParameter weatherParameter = new WeatherParameter();
				weatherParameter.setEvent_time(rs.getTime("event_time"));
				weatherParameter.setTemp(rs.getFloat("temp"));
				weatherParameter.setHumi(rs.getFloat("humi"));
				weatherParameter.setUv(rs.getFloat("uv"));
				listWeatherParameter.add(weatherParameter);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		return listWeatherParameter;
	}
	
	public List<WeatherParameter> getStatMonth(String month, int id){
		List<WeatherParameter> listWeatherParameter = new ArrayList<>();
		String []s = month.trim().split("\\-");
		String query = "SELECT event_date ,ROUND(AVG(temp), 2) as statTemp, ROUND(AVG(humi), 2) as statHumi, ROUND(AVG(uv), 2) as statUv\r\n"
				+ "FROM tblweatherparameter \r\n"
				+ "WHERE MONTH(event_date) = ? AND idtblStation = ? AND YEAR(event_date) = ?\r\n"
				+ "GROUP BY event_date";
		try {
			PreparedStatement ps = con.prepareStatement(query);
			ps.setInt(1, Integer.parseInt(s[1]));
			ps.setInt(2, id);
			ps.setInt(3, Integer.parseInt(s[0]));
			ResultSet rs = ps.executeQuery();
			while(rs.next()) {
				WeatherParameter weatherParameter = new WeatherParameter();
				weatherParameter.setEvent_date(rs.getDate("event_date"));
				weatherParameter.setTemp(rs.getFloat("statTemp"));
				weatherParameter.setHumi(rs.getFloat("statHumi"));
				weatherParameter.setUv(rs.getFloat("statUv"));
				listWeatherParameter.add(weatherParameter);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		return listWeatherParameter;
	}
}
