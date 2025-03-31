import React, { useState, useEffect } from 'react';
import styles from './DataStatistics.module.css';

const DataStatistics = ({ data }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      const points = data.data.filter(item =>
        item.lat !== undefined &&
        item.long !== undefined &&
        !isNaN(parseFloat(item.lat)) &&
        !isNaN(parseFloat(item.long))
      );

      if (points.length === 0) {
        setStats(null);
        return;
      }

      const lats = points.map(point => parseFloat(point.lat));
      const longs = points.map(point => parseFloat(point.long));
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLong = Math.min(...longs);
      const maxLong = Math.max(...longs);
      const centerLat = (minLat + maxLat) / 2;
      const centerLong = (minLong + maxLong) / 2;
      const latDistance = maxLat - minLat;
      const longDistance = maxLong - minLong;
      const areaApprox = latDistance * longDistance;

      const regions = {
        northEast: 0,
        northWest: 0,
        southEast: 0,
        southWest: 0
      };

      points.forEach(point => {
        const lat = parseFloat(point.lat);
        const long = parseFloat(point.long);
        if (lat >= centerLat && long >= centerLong) regions.northEast++;
        else if (lat >= centerLat && long < centerLong) regions.northWest++;
        else if (lat < centerLat && long >= centerLong) regions.southEast++;
        else regions.southWest++;
      });

      setStats({
        totalPoints: points.length,
        boundingBox: { minLat, maxLat, minLong, maxLong },
        center: { lat: centerLat, long: centerLong },
        regions,
        areaApprox
      });
    } else {
      setStats(null);
    }
  }, [data]);

  if (!stats) return null;

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Geospatial Data Statistics</h2>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.label}>Overview</h3>
          <div className={styles.grid}>
            <div className={styles.label}>Total Points:</div>
            <div className={styles.value}>{stats.totalPoints}</div>

            <div className={styles.label}>Area (approx):</div>
            <div className={styles.value}>{stats.areaApprox.toFixed(4)} sq. deg.</div>

            <div className={styles.label}>Center:</div>
            <div className={styles.value}>
              {stats.center.lat.toFixed(6)}, {stats.center.long.toFixed(6)}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.label}>Bounding Box</h3>
          <div className={styles.grid}>
            <div className={styles.label}>North:</div>
            <div className={styles.value}>{stats.boundingBox.maxLat.toFixed(6)}</div>

            <div className={styles.label}>South:</div>
            <div className={styles.value}>{stats.boundingBox.minLat.toFixed(6)}</div>

            <div className={styles.label}>East:</div>
            <div className={styles.value}>{stats.boundingBox.maxLong.toFixed(6)}</div>

            <div className={styles.label}>West:</div>
            <div className={styles.value}>{stats.boundingBox.minLong.toFixed(6)}</div>
          </div>
        </div>

        <div className={`${styles.section} ${styles.full}`}>
          <h3 className={styles.label}>Regional Distribution</h3>
          <div className={styles.grid}>
            {Object.entries(stats.regions).map(([region, count]) => (
              <div key={region} className={styles.region}>
                <div className={styles.regionLabel}>
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </div>
                <div className={styles.regionCount}>{count}</div>
                <div className={styles.regionPercent}>
                  {Math.round((count / stats.totalPoints) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStatistics;
