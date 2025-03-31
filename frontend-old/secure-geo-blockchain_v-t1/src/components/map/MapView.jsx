import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
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
  const [viewType, setViewType] = useState('markers'); // 'markers', 'heatmap', or 'clusters'
  const mapRef = useRef(null);

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

      // If we have points, center on the first one or fit bounds
      if (points.length > 0) {
        if (points.length === 1) {
          setCenter(points[0].position);
          setZoom(12);
        } else if (mapRef.current) {
          // Create bounds object and fit map to bounds
          const bounds = L.latLngBounds(points.map(p => p.position));
          mapRef.current.fitBounds(bounds);
        }
      }
    }
  }, [data]);

  const renderMarkers = () => {
  return (
    <>
      {mapPoints.map((point) => (
        <Marker key={point.id} position={point.position}>
          <Popup>
            <div>
              <h3 className="font-medium">{point.name}</h3>
              <p>Latitude: {point.position[0].toFixed(6)}</p>
              <p>Longitude: {point.position[1].toFixed(6)}</p>
              {Object.entries(point.properties)
                .filter(([key]) => !['id', 'lat', 'long', 'latitude', 'longitude'].includes(key))
                .map(([key, value]) => (
                  <p key={key}><span className="font-medium">{key}: </span>{value}</p>
                ))
              }
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

  const renderHeatmap = () => {
    return mapPoints.map((point) => (
      <CircleMarker
        key={point.id}
        center={point.position}
        radius={5}
        color="red"
        fillColor="#f03"
        fillOpacity={0.5}
      >
        <Popup>
          <div>
            <h3 className="font-medium">{point.name}</h3>
            <p>Latitude: {point.position[0].toFixed(6)}</p>
            <p>Longitude: {point.position[1].toFixed(6)}</p>
          </div>
        </Popup>
      </CircleMarker>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Geospatial Visualization</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewType('markers')}
            className={`px-3 py-1 text-sm rounded ${viewType === 'markers'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          >
            Markers
          </button>
          <button
            onClick={() => setViewType('heatmap')}
            className={`px-3 py-1 text-sm rounded ${viewType === 'heatmap'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewType('clusters')}
            className={`px-3 py-1 text-sm rounded ${viewType === 'clusters'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
          >
            Clusters
          </button>
        </div>
      </div>

      <div className="h-96 w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {viewType === 'markers' && renderMarkers()}
          {viewType === 'heatmap' && renderHeatmap()}
          {viewType === 'clusters' && renderMarkers()}
        </MapContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <div className="mr-2 font-medium text-gray-700 dark:text-gray-300">Data Points:</div>
          <div className="text-gray-900 dark:text-white">{mapPoints.length}</div>
        </div>
      </div>

      {mapPoints.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-md">
          No geospatial data available to display. Please upload and select a dataset.
        </div>
      )}
    </div>
  );
};

export default MapView;