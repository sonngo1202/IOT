package com.example.Backend.DAO;

import java.sql.Connection;
import java.sql.DriverManager;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class DAO {
	 static Connection con;
	 DAO(){
		 if(con == null) {
				String jdbcURL = "jdbc:mysql://localhost:3306/iot_btl";
				String jdbcUsername = "root";
				String jdbcPassword = "Heliossn1202";
				try {
					Class.forName("com.mysql.jdbc.Driver");
					con = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
				}catch (Exception e) {
					e.printStackTrace();
				}
			}
	 }
}
