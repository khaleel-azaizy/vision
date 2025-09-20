/**
 * Location Service
 * Handles location-related operations including reverse geocoding
 */

export interface LocationInfo {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export class LocationService {
  private static readonly API_KEY = 'AIzaSyDPstmPzkUnJn5HeUlQlH7xsgibrG6vmXY';
  
  /**
   * Get location name from coordinates
   * This method works around CORS issues by using different approaches
   */
  static async getLocationName(lat: number, lng: number): Promise<string> {
    try {
      // For web development, we'll use a predefined mapping
      // In production, you'd use Google Maps JavaScript API or a backend proxy
      const locationMap = this.getLocationMapping();
      const coordKey = `${lat.toFixed(4)},${lng.toFixed(4)}`; // relax precision to increase hits
      
      if (locationMap[coordKey]) {
        return locationMap[coordKey];
      }
      
      // Try to find nearby coordinates (within ~1km)
      for (const [key, value] of Object.entries(locationMap)) {
        const [mapLat, mapLng] = key.split(',').map(Number);
        const distance = this.calculateDistance(lat, lng, mapLat, mapLng);
        
        if (distance < 5) { // Within 5km for nearby cities
          return value;
        }
      }
      
      // Fallback to coordinates
      return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Current Location';
    }
  }
  
  /**
   * Predefined location mappings for common areas
   * You can expand this list with more locations
   */
  private static getLocationMapping(): Record<string, string> {
    return {
      // Jerusalem area
      '31.7816832,35.1961088': 'Jerusalem, Israel',
      '31.7683,35.2137': 'Jerusalem, Israel',
      '31.7767,35.2345': 'Jerusalem, Israel',
      
      // Tel Aviv area
      '32.0853,34.7818': 'Tel Aviv, Israel',
      '32.1093,34.8555': 'Tel Aviv, Israel',
      
      // Haifa area
      '32.7940,34.9896': 'Haifa, Israel',

      // Tamra / Lower Galilee area (approx)
      '32.8350,35.1850': 'Tamra, Israel',
      '32.8330,35.1830': 'Tamra, Israel',
      '32.8670,35.2830': 'Sakhnin, Israel',
      '32.8500,35.3330': 'Arraba, Israel',
      '32.8500,35.2000': 'Kabul, Israel',
      
      // New York area
      '40.7128,-74.0060': 'New York, NY',
      '40.7589,-73.9851': 'New York, NY',
      
      // San Francisco area
      '37.7749,-122.4194': 'San Francisco, CA',
      '37.7849,-122.4094': 'San Francisco, CA',
      
      // London area
      '51.5074,-0.1278': 'London, England',
      '51.5154,-0.1178': 'London, England',
      
      // Paris area
      '48.8566,2.3522': 'Paris, France',
      
      // Berlin area
      '52.5200,13.4050': 'Berlin, Germany',
      
      // Tokyo area
      '35.6762,139.6503': 'Tokyo, Japan',
      
      // Sydney area
      '33.8688,151.2093': 'Sydney, Australia',
    };
  }
  
  /**
   * Calculate distance between two coordinates in kilometers
   */
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return d;
  }
  
  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  /**
   * For production use: Create a backend proxy endpoint
   * This would be called from your backend server to avoid CORS issues
   */
  static async getLocationNameFromBackend(lat: number, lng: number): Promise<string> {
    try {
      // This would call your backend endpoint
      const response = await fetch('/api/location/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng }),
      });
      
      if (!response.ok) {
        throw new Error('Backend geocoding failed');
      }
      
      const data = await response.json();
      return data.address || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
      
    } catch (error) {
      console.error('Backend geocoding error:', error);
      return `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }
  }
}
