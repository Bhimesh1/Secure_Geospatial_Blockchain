import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapView.module.css';

// Fix leaflet icons in React
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
  const [viewType, setViewType] = useState('markers');
  const mapRef = useRef(null);

  useEffect(() => {
    if (data?.data?.length) {
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

      if (points.length > 0) {
        if (points.length === 1) {
          setCenter(points[0].position);
          setZoom(12);
        } else if (mapRef.current) {
          const bounds = L.latLngBounds(points.map(p => p.position));
          mapRef.current.fitBounds(bounds);
        }
      }
    }
  }, [data]);

  const renderMarkers = () => (
    <>
      {mapPoints.map((point) => (
        <Marker key={point.id} position={point.position}>
          <Popup>
            <div>
              <h3><strong>{point.name}</strong></h3>
              <p>Latitude: {point.position[0].toFixed(6)}</p>
              <p>Longitude: {point.position[1].toFixed(6)}</p>
              {Object.entries(point.properties)
                .filter(([key]) => !['id', 'lat', 'long', 'latitude', 'longitude'].includes(key))
                .map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );

  const renderHeatmap = () => (
    mapPoints.map(point => (
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
            <h3><strong>{point.name}</strong></h3>
            <p>Latitude: {point.position[0].toFixed(6)}</p>
            <p>Longitude: {point.position[1].toFixed(6)}</p>
          </div>
        </Popup>
      </CircleMarker>
    ))
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Geospatial Visualization</h2>
        <div className={styles.viewSwitch}>
          {['markers', 'heatmap', 'clusters'].map(view => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`${styles.switchBtn} ${viewType === view ? styles.active : ''}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.mapBox}>
        <MapContainer center={center} zoom={zoom} ref={mapRef} style={{ height: '100%', width: '100%' }}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {viewType === 'markers' && renderMarkers()}
          {viewType === 'heatmap' && renderHeatmap()}
          {viewType === 'clusters' && renderMarkers()}
        </MapContainer>
      </div>

      <div className={styles.meta}>
        <span>Data Points:</span>
        <span className={styles.count}>{mapPoints.length}</span>
      </div>

      {mapPoints.length === 0 && (
        <div className={styles.alert}>
          No geospatial data available to display. Please upload and select a dataset.
        </div>
      )}
    </div>
  );
};

export default MapView;
