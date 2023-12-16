import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYjIwZGNjbjU3OCIsImEiOiJjbHBncWU0ejMwMHJ4MnFyd2ZkYzcwbHIxIn0.K6S8hdC_I3hOAkxbJbSx9w';

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(11);

    useEffect(() => {
        if (map.current) return;
        
        //Hiện ra ở khu vực Hà Nội
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [105.8542, 21.0285],
            zoom: zoom
        });

        // Thêm điều khiển phóng to thu nhỏ
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Thêm plugin tìm kiếm
        map.current.addControl(
            new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                placeholder: 'Tìm kiếm'
            }),
            'top-left'
        );

        const fetchStation = async ()=>{
            const response = await fetch('http://localhost:8081/api/iot/stations');

            if(response.ok){
                const data = await response.json();
                console.log(data);
                // Đánh dấu các quận trên bản đồ
                data.forEach(station => {
                    const marker = new mapboxgl.Marker({color:'red'})
                        .setLngLat([station.longitude, station.latitude])
                        .addTo(map.current);

                    // Thêm sự kiện click cho mỗi marker
                    marker.getElement().addEventListener('click', () => {
                        // Chuyển hướng đến trang mới khi nhấp vào marker
                        window.location.href = `/station/${station.id}`;
                    });
                });
            }else{
                console.error('Fail to fetch data');
            }
        }
        fetchStation();
    }, [zoom]);

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};

export default Map;
