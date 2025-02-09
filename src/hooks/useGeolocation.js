import { useState, useEffect } from 'react';
import { geolocationService } from '../services/geolocationService';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handleSuccess = (position) => {
      if (mounted) {
        setLocation(position);
        setError(null);
        setLoading(false);
      }
    };

    const handleError = (err) => {
      if (mounted) {
        setError(err.message);
        setLoading(false);
      }
    };

    const initializeGeolocation = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        handleSuccess(position);

        if (options.watch) {
          geolocationService.watchPosition(handleSuccess, handleError);
        }
      } catch (err) {
        handleError(err);
      }
    };

    initializeGeolocation();

    return () => {
      mounted = false;
      if (options.watch) {
        geolocationService.clearWatch();
      }
    };
  }, [options.watch]);

  return { location, error, loading };
};
