'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';

export default function MapPage() {
  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = {
    lat: 35.681236,
    lng: 139.767125,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={5}
      >
        {/* ここにマーカーなどを追加可能 */}
      </GoogleMap>
    </LoadScript>
  );
}
