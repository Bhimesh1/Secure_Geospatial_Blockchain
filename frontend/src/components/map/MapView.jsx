import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/lib/assets/MarkerCluster.css';
import 'react-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import L from 'leaflet';
import styles from './MapView.module.css';

// Fix leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ data, mode }) => {
  const [mapPoints, setMapPoints] = useState([]);
  const [center, setCenter] = useState([20, 0]);
  const [zoom, setZoom] = useState(2);
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
          properties: item,
          intensity: item.intensity || Math.random()
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
            <div className={styles.popup}>
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

  const getHeatmapColor = (intensity) => {
    const colors = [
      { threshold: 0.2, color: '#0000ff' },
      { threshold: 0.4, color: '#00ffff' },
      { threshold: 0.6, color: '#00ff00' },
      { threshold: 0.8, color: '#ffff00' },
      { threshold: 1.0, color: '#ff0000' }
    ];

    for (let i = 0; i < colors.length; i++) {
      if (intensity <= colors[i].threshold) {
        return colors[i].color;
      }
    }
    return colors[colors.length - 1].color;
  };

  const renderHeatmap = () => (
    <>
      {mapPoints.map((point) => (
        <CircleMarker
          key={point.id}
          center={point.position}
          radius={20}
          color={getHeatmapColor(point.intensity)}
          fillColor={getHeatmapColor(point.intensity)}
          fillOpacity={0.5}
          weight={1}
        >
          <Popup>
            <div className={styles.popup}>
              <h3><strong>{point.name}</strong></h3>
              <p>Latitude: {point.position[0].toFixed(6)}</p>
              <p>Longitude: {point.position[1].toFixed(6)}</p>
              <p><strong>Intensity:</strong> {(point.intensity * 100).toFixed(1)}%</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );

  const ClusterLayer = () => {
    if (!mapPoints.length) return null;
    
    return (
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={true}
      >
        {mapPoints.map((point) => (
          <Marker key={point.id} position={point.position}>
            <Popup>
              <div className={styles.popup}>
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
      </MarkerClusterGroup>
    );
  };

  return (
    <div className={styles.wrapper}>
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

          {mode === 'markers' && renderMarkers()}
          {mode === 'heatmap' && renderHeatmap()}
          {mode === 'clusters' && <ClusterLayer />}
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
