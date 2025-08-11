'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function MapPage() {
  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = {
    lat: 35.681236,
    lng: 139.767125,
  };

  // 都市の座標
  const cities = [
    {
      name: '東京',
      position: { lat: 35.681236, lng: 139.767125 },
    },
    {
      name: '大阪',
      position: { lat: 34.693738, lng: 135.502165 },
    },
    {
      name: '札幌',
      position: { lat: 43.061936, lng: 141.354292 },
    },
  ];

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {cities.map((city, index) => (
          <Marker
            key={index}
            position={city.position}
            title={city.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
