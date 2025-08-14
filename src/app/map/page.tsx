'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow,
  MarkerClusterer 
} from '@react-google-maps/api';

export default function MapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(() => {
    const lat = parseFloat(searchParams.get('lat') || '38.0');
    const lng = parseFloat(searchParams.get('lng') || '138.0');
    return { lat, lng };
  });
  const [mapZoom, setMapZoom] = useState(() => {
    return parseInt(searchParams.get('zoom') || '6');
  });

  // 初期化時にURLパラメータを設定
  useEffect(() => {
    const lat = parseFloat(searchParams.get('lat') || '38.0');
    const lng = parseFloat(searchParams.get('lng') || '138.0');
    const zoom = parseInt(searchParams.get('zoom') || '6');
    
    setMapCenter({ lat, lng });
    setMapZoom(zoom);
  }, [searchParams]);

  const containerStyle = {
    width: '100%',
    height: '100vh', // ビューポートの高さ全体を使用
  };

  // 都市の座標と情報
  const cities = [
    {
      id: 'tokyo',
      name: '東京',
      position: { lat: 35.681236, lng: 139.767125 },
      description: '日本の首都。政治・経済・文化の中心地。',
      category: 'capital',
      icon: '🏛️'
    },
    {
      id: 'osaka',
      name: '大阪',
      position: { lat: 34.693738, lng: 135.502165 },
      description: '関西地方の中心都市。食文化と商業の街。',
      category: 'business',
      icon: '🏢'
    },
    {
      id: 'sapporo',
      name: '札幌',
      position: { lat: 43.061936, lng: 141.354292 },
      description: '北海道の道庁所在地。雪祭りとビールで有名。',
      category: 'tourism',
      icon: '❄️'
    },
    {
      id: 'nagoya',
      name: '名古屋',
      position: { lat: 35.170915, lng: 136.879432 },
      description: '中部地方の中心都市。自動車産業の拠点。',
      category: 'business',
      icon: '🏭'
    },
    {
      id: 'fukuoka',
      name: '福岡',
      position: { lat: 33.590355, lng: 130.401716 },
      description: '九州地方の中心都市。食文化と歴史の街。',
      category: 'tourism',
      icon: '🍜'
    }
  ];

  // カテゴリ別マーカーアイコン
  const getMarkerIcon = (category: string) => {
    const icons = {
      capital: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#FF4444" stroke="#FFFFFF" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">都</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      },
      business: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#4444FF" stroke="#FFFFFF" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">商</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      },
      tourism: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#44FF44" stroke="#FFFFFF" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">観</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    };
    return icons[category as keyof typeof icons] || icons.business;
  };

  // 地図インスタンスの参照
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isUpdatingURL, setIsUpdatingURL] = useState(false);

  // URLクエリパラメータを更新（デバウンス付き）
  const updateURLParams = useCallback((center: { lat: number; lng: number }, zoom: number) => {
    if (isUpdatingURL) return;
    
    setIsUpdatingURL(true);
    setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('lat', center.lat.toString());
      params.set('lng', center.lng.toString());
      params.set('zoom', zoom.toString());
      router.replace(`/map?${params.toString()}`);
      setIsUpdatingURL(false);
    }, 1000); // 1秒のデバウンスに延長
  }, [searchParams, router, isUpdatingURL]);

  // 地図の中心位置とズームが変更された時の処理（パフォーマンス最適化）
  const handleCenterChanged = useCallback(() => {
    // 地図の中心位置変更時の処理を最小限に抑制
    // 状態更新を削減してパフォーマンスを向上
  }, []);

  const handleZoomChanged = useCallback(() => {
    // 地図のズーム変更時の処理を最小限に抑制
    // 状態更新を削減してパフォーマンスを向上
  }, []);

  // 地図が読み込まれた時の処理
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // マーカークリック時の処理
  const handleMarkerClick = (cityId: string) => {
    setSelectedCity(cityId);
  };

  // マーカーホバリング時の処理
  const handleMarkerMouseOver = (cityId: string) => {
    setSelectedCity(cityId);
  };

  // マーカーホバリング終了時の処理
  const handleMarkerMouseOut = () => {
    setSelectedCity(null);
  };

  // InfoWindowを閉じる処理
  const handleInfoWindowClose = () => {
    setSelectedCity(null);
  };

  return (
    <div className="map-page">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={mapZoom}
        onLoad={onLoad}
        options={{
          gestureHandling: 'cooperative',
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUI: false,
          clickableIcons: false,
          draggable: true,
          scrollwheel: true,
          disableDoubleClickZoom: false,
          maxZoom: 18,
          minZoom: 4
        }}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
                             {cities.map((city) => (
                 <Marker
                   key={city.id}
                   position={city.position}
                   title={city.name}
                   onClick={() => handleMarkerClick(city.id)}
                   onMouseOver={() => handleMarkerMouseOver(city.id)}
                   onMouseOut={handleMarkerMouseOut}
                   clusterer={clusterer}
                 />
               ))}
            </>
          )}
        </MarkerClusterer>

                 {selectedCity && (
           <InfoWindow
             position={cities.find(city => city.id === selectedCity)?.position}
             onCloseClick={handleInfoWindowClose}
             options={{
               pixelOffset: new google.maps.Size(0, -40),
               disableAutoPan: false
             }}
           >
             <div style={{ 
               padding: '8px', 
               maxWidth: '200px',
               backgroundColor: 'white',
               borderRadius: '4px',
               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
             }}>
               <h3 style={{ 
                 margin: '0 0 8px 0', 
                 fontSize: '16px', 
                 fontWeight: 'bold',
                 color: '#333'
               }}>
                 {cities.find(city => city.id === selectedCity)?.icon} 
                 {cities.find(city => city.id === selectedCity)?.name}
               </h3>
               <p style={{ 
                 margin: '0', 
                 fontSize: '14px', 
                 lineHeight: '1.4',
                 color: '#666'
               }}>
                 {cities.find(city => city.id === selectedCity)?.description}
               </p>
             </div>
           </InfoWindow>
         )}
       </GoogleMap>
     </LoadScript>
    </div>
  );
}
