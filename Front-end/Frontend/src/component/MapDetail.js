// MapDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MapDetail.css'; // Import the CSS file

const MapDetail = () => {
  const { id } = useParams();
  const [weather, setWeather] = useState(null);
  const [station, setStation] = useState(null);

  useEffect(() => {
    const fetchStation = async () => {
      const response = await fetch('http://localhost:8081/api/iot/stations');

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStation(data.find((station) => station.id == id));
      } else {
        console.error('Fail to fetch data');
      }
    };

    fetchStation();
  }, [id]);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch('http://localhost:8081/api/iot/weather/'+id);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setWeather(data);
      } else {
        console.error('Fail to fetch data');
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="paper">
      <div className="content">
        <h2>Thông tin thời tiết</h2>

        <div className="dataContainer">
          <div className={`dataSquare temperatureSquare`}>
            <p className="value">Nhiệt độ</p>
            <p className="value">{weather ? weather.temp : "-"}°C</p>
          </div>

          <div className={`dataSquare humiditySquare`}>
            <p className="value">Độ ẩm</p>
            <p className="value">{weather ? weather.humi : "-"}%</p>
          </div>
          <div className={`dataSquare uvLocationSquare`}>
            <p className="value">Chỉ số UV</p>
            <p className="value">{weather ? weather.uv : "-"}</p>
          </div>

          <div className={`dataSquare addressSquare`}>
            <p className="value">Nơi đo</p>
            <p className="value">{station ? station.des: ""}</p>
          </div>
        </div>
        <div className="adviceContainer">
          <label>* Lời khuyên:</label>
          <p>{!weather ? "":
              (weather.temp < 15 ? "- Nhiệt độ rất thấp! Nhớ mặc ấm":
              (weather.temp <= 30 ? "- Nhiệt độ vừa! Chúc bạn một ngày tốt lành":"- Nhiệt độ cao! Tránh ra ngoài nhiều"))}
          </p>
          <p>{!weather ? "":
              (weather.humi < 30 ? "- Độ ẩm thấp! Đề xuất cung cấp độ ẩm cho da":
              (weather.humi <= 60 ? "- Độ ẩm trung bình! Nên dùng kem dưỡng ẩm":"- Độ ẩm cao! Hạn chế không gian ẩm ướt"))}
          </p>
          <p>{!weather ? "":
              (weather.uv < 2 ? "- Tia UV ở mức an toàn!":
              (weather.uv <= 5 ? "- Hãy sử dụng kem chống nắng bảo vệ da":"- Tia UV cao! Tránh tiếp xúc với ánh nắng"))}
          </p>
        </div>
        <div className="buttonDetail">
          <button onClick={()=>{ window.location.href = "/stat/day/"+id }}>Theo dõi sự biến đổi</button>
        </div>
      </div>
    </div>
  );
};

export default MapDetail;
