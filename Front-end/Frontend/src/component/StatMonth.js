import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './StatMonth.css';  // Đảm bảo có file CSS để tùy chỉnh kích thước
import { useParams } from 'react-router-dom';
Chart.register(...registerables);

const StatMonth = () => {
    const currentDate = new Date();
    const initialMonth = currentDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit' });
    const [month, setMonth] = useState(initialMonth);

    const { id } = useParams(initialMonth);
    const [days, setDays] = useState();
    const [temperatureData, setTemperatureData] = useState();
    const [humidityData, setHumidityData] = useState();
    const [uvData, setUvData] = useState();

    const formatDay = (inputDay) => {
        const dateParts = inputDay.split('-');
        const formattedDay = `${dateParts[2]}/${dateParts[1]}`;
        return formattedDay;
    };

    useEffect(() => {
        const fetchStatDay = async () => {
            const response = await fetch('http://localhost:8081/api/iot/stat/month/' + id + '/' + month);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data) {
                    const newDays = data.map((element) => formatDay(element.event_date));
                    const newTemperatureData = data.map((element) => element.temp);
                    const newHumidityData = data.map((element) => element.humi);
                    const newUvData = data.map((element) => element.uv);

                    setDays(newDays);
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
    }, [month])

    const data = {
        labels: days,
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
                maxTicksLimit: 31,
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
                position: 'bottom'
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
                <button onClick={() => { window.location.href = "/stat/day/" + id }} >Theo ngày</button>
                <button style={{ color: '#ffff', backgroundColor: 'rgb(20, 179, 152)' }}>Theo tháng</button>
            </div>
            <div className="selectDay">
                <label>Tháng: </label>
                <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}></input>
            </div>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default StatMonth;
