import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
// import 'react-leaflet-cluster/lib/assets/MarkerCluster.css';
// import 'react-leaflet-cluster/lib/assets/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L from 'leaflet';
import styles from './MapView.module.css';

// Fix leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map bounds updater component
const MapBoundsUpdater = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => p.position));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);

  return null;
};

// Tile layer component with error handling
const CustomTileLayer = ({ url, attribution }) => {
  const map = useMap();
  
  useEffect(() => {
    const handleError = (e) => {
      console.error('Tile loading error:', e);
      // Attempt to reload the problematic tile
      if (e.tile) {
        e.tile.src = e.tile.src;
      }
    };

    map.on('tileerror', handleError);
    return () => map.off('tileerror', handleError);
  }, [map]);

  return (
    <TileLayer
      attribution={attribution}
      url={url}
      keepBuffer={8}
      updateWhenIdle={true}
      updateWhenZooming={false}
      maxZoom={19}
      minZoom={2}
    />
  );
};

const MapView = ({ data, mode }) => {
  const [mapPoints, setMapPoints] = useState([]);
  const [center, setCenter] = useState([20, 0]);
  const [zoom, setZoom] = useState(2);
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Process data with useMemo to prevent unnecessary recalculations
  const processedPoints = useMemo(() => {
    if (!data?.data) return [];

    try {
      if (data.data.type === 'FeatureCollection') {
        return data.data.features.map(feature => ({
          id: feature.properties.id || Math.random().toString(36).substr(2, 9),
          position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
          name: feature.properties.name || 'Unknown Location',
          properties: feature.properties,
          intensity: feature.properties.intensity || Math.random()
        }));
      }

      return data.data
        .filter(item => {
          const lat = parseFloat(item.lat);
          const long = parseFloat(item.long);
          return (
            lat !== undefined &&
            long !== undefined &&
            !isNaN(lat) &&
            !isNaN(long) &&
            isFinite(lat) &&
            isFinite(long) &&
            lat >= -90 && lat <= 90 &&
            long >= -180 && long <= 180
          );
        })
        .map(item => ({
          id: item.id || Math.random().toString(36).substr(2, 9),
          position: [parseFloat(item.lat), parseFloat(item.long)],
          name: item.name || 'Unknown Location',
          properties: Object.fromEntries(
            Object.entries(item).map(([key, value]) => [
              key,
              typeof value === 'number' && !isFinite(value) ? 0 : value
            ])
          ),
          intensity: isFinite(item.intensity) ? item.intensity : Math.random()
        }));
    } catch (error) {
      console.error('Error processing map data:', error);
      return [];
    }
  }, [data]);

  useEffect(() => {
    setMapPoints(processedPoints);
    setIsLoading(false);
  }, [processedPoints]);

  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const renderMarkers = useMemo(() => (
    <>
      {mapPoints.map((point) => (
        <Marker 
          key={point.id} 
          position={point.position}
          eventHandlers={{
            add: (e) => {
              // Ensure marker is properly placed
              e.target.options.autoPan = true;
            }
          }}
        >
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
  ), [mapPoints]);

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
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>Loading map...</p>
          </div>
        )}
        <MapContainer 
          center={center} 
          zoom={zoom} 
          ref={mapRef} 
          style={{ height: '100%', width: '100%' }}
          whenReady={handleMapLoad}
          preferCanvas={true}
          renderer={L.canvas()}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <CustomTileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satellite">
              <CustomTileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Terrain">
              <CustomTileLayer
                attribution='&copy; CARTO'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <MapBoundsUpdater points={mapPoints} />
          {mode === 'markers' && renderMarkers}
          {mode === 'heatmap' && renderHeatmap()}
          {mode === 'clusters' && <ClusterLayer />}
        </MapContainer>
      </div>

      <div className={styles.dataInfo}>
        <div className={styles.summary}>
          <div className={styles.statCard}>
            <span className={styles.label}>Total Locations</span>
            <span className={styles.count}>{mapPoints.length}</span>
          </div>
          {mapPoints.length > 0 && (
            <div className={styles.statCard}>
              <span className={styles.label}>Coverage Area</span>
              <span className={styles.count}>
                {mapRef.current ? 
                  `${(L.latLngBounds(mapPoints.map(p => p.position)).toBBoxString().split(',').slice(0, 2)
                    .map(coord => Math.abs(parseFloat(coord)).toFixed(1))
                    .join('° x '))
                  }°` : '...'}
              </span>
            </div>
          )}
        </div>

        <div className={styles.locationList}>
          <h3>Location Details</h3>
          <div className={styles.listContainer}>
            {mapPoints.map((point) => (
              <div 
                key={point.id} 
                className={styles.locationCard}
                onClick={() => {
                  mapRef.current?.setView(point.position, 13);
                }}
              >
                <h4>{point.name}</h4>
                <div className={styles.locationDetails}>
                  <div className={styles.coordinates}>
                    <span>📍 {point.position[0].toFixed(4)}°, {point.position[1].toFixed(4)}°</span>
                  </div>
                  {Object.entries(point.properties)
                    .filter(([key]) => !['id', 'lat', 'long', 'latitude', 'longitude', 'name'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className={styles.propertyItem}>
                        <span className={styles.propertyLabel}>{key}:</span>
                        <span className={styles.propertyValue}>{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {mapPoints.length === 0 && (
          <div className={styles.alert}>
            No geospatial data available to display. Please upload and select a dataset.
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
