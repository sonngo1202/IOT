package com.example.Backend.DAO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.example.Backend.Model.Station;

public class StationDAO extends DAO{
	public List<Station> getAllStation(){
		List<Station> listStation = new ArrayList<>();
		String sql = "SELECT * FROM tblStation";
		try {
			PreparedStatement ps = con.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()) {
				Station station = new Station();
				station.setId(rs.getInt("id"));
				station.setName(rs.getString("name"));
				station.setLongitude(rs.getFloat("longitude"));
				station.setLatitude(rs.getFloat("latitude"));
				station.setDes(rs.getString("des"));
				listStation.add(station);
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return listStation;
	}
}