import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ data }) => {
  const [mapPoints, setMapPoints] = useState([]);
  const [center, setCenter] = useState([20, 0]);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      // Process data and extract points
      const points = data.data
        .filter(item =>
          item.lat !== undefined &&
          item.long !== undefined &&
          !isNaN(parseFloat(item.lat)) &&
          !isNaN(parseFloat(item.long))
        )
        .map(item => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          position: [parseFloat(item.lat), parseFloat(item.long)],
          name: item.name || 'Unknown Location',
          properties: item
        }));

      setMapPoints(points);

      // If we have points, center on the first one
      if (points.length > 0) {
        setCenter(points[0].position);
        setZoom(12);
      }
    }
  }, [data]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Geospatial Visualization</h2>

      <div className="h-96 w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapPoints.map((point) => (
            <Marker key={point.id} position={point.position}>
              <Popup>
                <div>
                  <h3 className="font-medium">{point.name}</h3>
                  <p>Latitude: {point.position[0]}</p>
                  <p>Longitude: {point.position[1]}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {mapPoints.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
          No geospatial data available to display. Please upload and select a dataset.
        </div>
      )}
    </div>
  );
};

export default MapView;