/**
 * Service to handle geolocation functionality
 */

const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000, // Aumentado a 15 segundos
  maximumAge: 30000 // Permitir usar una ubicación en caché de hasta 30 segundos
};

class GeolocationService {
  constructor() {
    this.currentPosition = null;
    this.watchId = null;
  }

  /**
   * Check if geolocation is supported by the browser
   * @returns {boolean}
   */
  isSupported() {
    return 'geolocation' in navigator;
  }

  /**
   * Request geolocation permissions and get current position
   * @returns {Promise} Resolves with position object or rejects with error
   */
  async getCurrentPosition() {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by your browser');
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.currentPosition = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            resolve(this.currentPosition);
          },
          (error) => {
            reject(this.handleGeolocationError(error));
          },
          DEFAULT_OPTIONS
        );
      });

      return position;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Start watching position changes
   * @param {Function} onSuccess - Callback for position updates
   * @param {Function} onError - Callback for errors
   */
  watchPosition(onSuccess, onError) {
    if (!this.isSupported()) {
      onError(new Error('Geolocation is not supported by your browser'));
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        onSuccess(this.currentPosition);
      },
      (error) => {
        onError(this.handleGeolocationError(error));
      },
      DEFAULT_OPTIONS
    );
  }

  /**
   * Stop watching position changes
   */
  clearWatch() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Handle geolocation errors
   * @param {GeolocationPositionError} error
   * @returns {Error}
   */
  handleGeolocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('User denied the request for geolocation');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information is unavailable');
      case error.TIMEOUT:
        return new Error('The request to get user location timed out');
      default:
        return new Error('An unknown error occurred');
    }
  }
}

export const geolocationService = new GeolocationService();
