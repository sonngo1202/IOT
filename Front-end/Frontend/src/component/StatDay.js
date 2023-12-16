import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './StatDay.css';  // Đảm bảo có file CSS để tùy chỉnh kích thước
import { useParams } from 'react-router-dom';
Chart.register(...registerables);

const StatDay = () => {
  const { id } = useParams();
  const [day, setDay] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState();
  const [temperatureData, setTemperatureData] = useState();
  const [humidityData, setHumidityData] = useState();
  const [uvData, setUvData] = useState();

  useEffect(()=>{
    const fetchStatDay = async () => {
      const response = await fetch('http://localhost:8081/api/iot/stat/day/'+id+'/'+day);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data) {
          const newHours = data.map((element) => element.event_time.slice(0, 5));
          const newTemperatureData = data.map((element) => element.temp);
          const newHumidityData = data.map((element) => element.humi);
          const newUvData = data.map((element) => element.uv);

          setHours(newHours);
          setTemperatureData(newTemperatureData);
          setHumidityData(newHumidityData);
          setUvData(newUvData);
        } else {
          console.error('Invalid data structure:', data);
        }
      } else {
        console.error('Fail to fetch data');
      }
    };

    fetchStatDay();
  }, [day])

  const data = {
    labels: hours,
    datasets: [
      {
        label: 'Nhiệt độ',
        data: temperatureData,
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
        yAxisID: 'y-axis-temperature',
      },
      {
        label: 'Độ ẩm',
        data: humidityData,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
        yAxisID: 'y-axis-humidity',
      },
      {
        label: 'Chỉ số UV',
        data: uvData,
        fill: false,
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.1,
        yAxisID: 'y-axis-uv',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        maxTicksLimit: 24,
        stepSize: 1,
      },
      'y-axis-temperature': {
        beginAtZero: true,
        max: 50,
        ticks: {
          callback: function (value, index, values) {
            return value + '°C';
          },
        },
      },
      'y-axis-humidity': {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value, index, values) {
            return value + '%';
          },
        },
      },
      'y-axis-uv': {
        beginAtZero: true,
        max: 25,
        ticks: {
          callback: function (value, index, values) {
            return value;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const datasetLabel = context.dataset.label || '';
            return datasetLabel + ': ' + context.parsed.y;
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="selectStat">
        <button style={{color:'#ffff', backgroundColor:'rgb(20, 179, 152)'}}>Theo ngày</button>
        <button onClick={()=>{window.location.href = "/stat/month/"+id}}>Theo tháng</button>
      </div>
      <div className="selectDay">
        <label>Ngày: </label>
        <input type="date" value={day} onChange={(e)=> setDay(e.target.value)}></input>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StatDay;
