import React, { useState, useEffect } from 'react';

const DataStatistics = ({ data }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      // Calculate statistics
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

      // Calculate bounding box
      const lats = points.map(point => parseFloat(point.lat));
      const longs = points.map(point => parseFloat(point.long));

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLong = Math.min(...longs);
      const maxLong = Math.max(...longs);

      // Calculate center point
      const centerLat = (minLat + maxLat) / 2;
      const centerLong = (minLong + maxLong) / 2;

      // Calculate area (very rough approximation)
      const latDistance = maxLat - minLat;
      const longDistance = maxLong - minLong;
      const areaApprox = latDistance * longDistance;

      // Count points by region (using lat/long quadrants)
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
        boundingBox: {
          minLat,
          maxLat,
          minLong,
          maxLong
        },
        center: {
          lat: centerLat,
          long: centerLong
        },
        regions,
        areaApprox
      });
    } else {
      setStats(null);
    }
  }, [data]);

  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Geospatial Data Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Overview</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points:</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.totalPoints}</div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Area (approx):</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.areaApprox.toFixed(4)} sq. deg.</div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Center:</div>
            <div className="text-sm text-gray-900 dark:text-white">
              {stats.center.lat.toFixed(6)}, {stats.center.long.toFixed(6)}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Bounding Box</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">North:</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.boundingBox.maxLat.toFixed(6)}</div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">South:</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.boundingBox.minLat.toFixed(6)}</div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">East:</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.boundingBox.maxLong.toFixed(6)}</div>

            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">West:</div>
            <div className="text-sm text-gray-900 dark:text-white">{stats.boundingBox.minLong.toFixed(6)}</div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:col-span-2">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Regional Distribution</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(stats.regions).map(([region, count]) => (
              <div key={region} className="bg-white dark:bg-gray-800 rounded-lg p-2 text-center">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {count}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
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