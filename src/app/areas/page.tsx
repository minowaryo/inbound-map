'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { getAllAreas, getAreaByPrefecture } from '@/types/areas';
import { validateAreaDefinitions, getAreaStatistics } from '@/utils/areaUtils';

interface AreaValidationData {
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  statistics: {
    totalAreas: number;
    totalPrefectures: number;
    areaPrefectureCounts: Record<string, number>;
    averagePrefecturesPerArea: number;
  };
}

export default function AreasPage() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [validationData, setValidationData] = useState<AreaValidationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  const areas = getAllAreas();

  // エリア定義の検証データを取得
  useEffect(() => {
    const fetchValidationData = async () => {
      try {
        const response = await fetch('/api/areas/validate');
        const data = await response.json();
        if (data.success) {
          setValidationData(data);
        }
      } catch (error) {
        console.error('検証データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchValidationData();
  }, []);

  const containerStyle = {
    width: '100%',
    height: '70vh',
  };

  const center = {
    lat: 38.0,
    lng: 138.0,
  };

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
  };

  const handleInfoWindowClose = () => {
    setSelectedArea(null);
  };

  const handleGoogleMapsLoad = () => {
    setIsGoogleMapsLoaded(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">エリア定義テスト</h1>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">エリア定義を検証中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">エリア定義テスト</h1>
        
        {/* 検証結果 */}
        {validationData && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">検証結果</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本統計 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">基本統計</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">エリア数:</span> {validationData.statistics.totalAreas}</p>
                  <p><span className="font-medium">都道府県数:</span> {validationData.statistics.totalPrefectures}</p>
                  <p><span className="font-medium">平均都道府県数:</span> {validationData.statistics.averagePrefecturesPerArea.toFixed(1)}</p>
                  <p><span className="font-medium">検証結果:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      validationData.validation.isValid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {validationData.validation.isValid ? '✅ 正常' : '❌ エラーあり'}
                    </span>
                  </p>
                </div>
              </div>

              {/* エラー・警告 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3">エラー・警告</h3>
                {validationData.validation.errors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 mb-2">エラー:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                      {validationData.validation.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationData.validation.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2">警告:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                      {validationData.validation.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationData.validation.errors.length === 0 && validationData.validation.warnings.length === 0 && (
                  <p className="text-green-600">✅ エラー・警告なし</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* エリア詳細 */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">エリア詳細</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((area) => (
              <div 
                key={area.id} 
                className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAreaClick(area.id)}
              >
                <div className="flex items-center mb-2">
                  <div 
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <h3 className="font-semibold">{area.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{area.prefectures.length}都道府県</p>
                <p className="text-xs text-gray-500">
                  {area.prefectures.slice(0, 3).join(', ')}
                  {area.prefectures.length > 3 && '...'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 地図 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">エリア地図</h2>
          <LoadScript 
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
            onLoad={handleGoogleMapsLoad}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={5}
              options={{
                gestureHandling: 'cooperative',
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false,
                clickableIcons: false,
              }}
            >
                            {isGoogleMapsLoaded && areas.map((area) => (
                <Marker
                  key={area.id}
                  position={area.center}
                  title={area.name}
                  onClick={() => handleAreaClick(area.id)}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="${area.color}" stroke="white" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${area.name.charAt(0)}</text>
                      </svg>
                    `)}`,
                    scaledSize: { width: 32, height: 32 }
                  }}
                />
              ))}

              {isGoogleMapsLoaded && selectedArea && (
                <InfoWindow
                  position={areas.find(area => area.id === selectedArea)?.center}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div style={{ padding: '8px', maxWidth: '250px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                      {areas.find(area => area.id === selectedArea)?.name}
                    </h3>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                      <strong>都道府県:</strong> {areas.find(area => area.id === selectedArea)?.prefectures.length}件
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                      {areas.find(area => area.id === selectedArea)?.prefectures.join(', ')}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      <strong>座標:</strong> {areas.find(area => area.id === selectedArea)?.center.lat.toFixed(4)}, {areas.find(area => area.id === selectedArea)?.center.lng.toFixed(4)}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
} 