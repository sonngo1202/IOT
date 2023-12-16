package com.example.Backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.DAO.StationDAO;
import com.example.Backend.Model.Station;

@RestController
@CrossOrigin
@RequestMapping("/api/iot/stations")
public class StationController {
	private StationDAO stationDAO = new StationDAO();
	
	@GetMapping("")
	public List<Station> getAllStation(){
		List<Station> listStation = stationDAO.getAllStation();
		return listStation;
	}
}

