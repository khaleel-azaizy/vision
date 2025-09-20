// Google Places API service for finding nearby shops
// This is a template for future implementation

interface Shop {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  phone?: string;
  website?: string;
  openingHours?: string[];
  priceLevel?: number;
  photos?: string[];
  types: string[];
}

interface PlacesResponse {
  results: Shop[];
  status: string;
  next_page_token?: string;
}

export class PlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Find nearby shops within a specified radius
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   * @param radius - Search radius in meters (max 50000)
   * @param shopType - Type of shop to search for
   * @returns Promise<Shop[]>
   */
  async findNearbyShops(
    latitude: number,
    longitude: number,
    radius: number = 5000, // 5km default
    shopType: string = 'store'
  ): Promise<Shop[]> {
    try {
      const url = `${this.baseUrl}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${shopType}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK') {
        return data.results.map(this.mapPlaceToShop);
      } else {
        console.error('Places API error:', data.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching nearby shops:', error);
      return [];
    }
  }

  /**
   * Find shops by specific category
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   * @param category - Specific category (electronics_store, clothing_store, etc.)
   */
  async findShopsByCategory(
    latitude: number,
    longitude: number,
    category: string,
    radius: number = 5000
  ): Promise<Shop[]> {
    return this.findNearbyShops(latitude, longitude, radius, category);
  }

  /**
   * Get detailed information about a specific shop
   * @param placeId - Google Place ID
   */
  async getShopDetails(placeId: string): Promise<Shop | null> {
    try {
      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,formatted_address,rating,formatted_phone_number,website,opening_hours,price_level,photos,types&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return this.mapPlaceDetailsToShop(data.result);
      } else {
        console.error('Place details error:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching shop details:', error);
      return null;
    }
  }

  /**
   * Find shops that sell specific products
   * @param latitude - User's latitude
   * @param longitude - User's longitude
   * @param productQuery - What you're looking for (e.g., "hardware store", "electronics")
   */
  async findShopsForProduct(
    latitude: number,
    longitude: number,
    productQuery: string,
    radius: number = 5000
  ): Promise<Shop[]> {
    try {
      const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(productQuery)}&location=${latitude},${longitude}&radius=${radius}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data: PlacesResponse = await response.json();

      if (data.status === 'OK') {
        return data.results.map(this.mapPlaceToShop);
      } else {
        console.error('Text search error:', data.status);
        return [];
      }
    } catch (error) {
      console.error('Error searching for shops:', error);
      return [];
    }
  }

  private mapPlaceToShop(place: any): Shop {
    return {
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      rating: place.rating || 0,
      distance: place.distance || 0,
      priceLevel: place.price_level,
      types: place.types,
      photos: place.photos?.map((photo: any) => 
        `${this.baseUrl}/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
      ),
    };
  }

  private mapPlaceDetailsToShop(place: any): Shop {
    return {
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      distance: 0, // Not provided in details
      phone: place.formatted_phone_number,
      website: place.website,
      openingHours: place.opening_hours?.weekday_text,
      priceLevel: place.price_level,
      types: place.types,
      photos: place.photos?.map((photo: any) => 
        `${this.baseUrl}/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${this.apiKey}`
      ),
    };
  }
}

// Shop categories for common searches
export const SHOP_CATEGORIES = {
  GENERAL_STORE: 'store',
  ELECTRONICS: 'electronics_store',
  CLOTHING: 'clothing_store',
  HARDWARE: 'hardware_store',
  PHARMACY: 'pharmacy',
  GROCERY: 'supermarket',
  RESTAURANT: 'restaurant',
  HOSPITAL: 'hospital',
  GAS_STATION: 'gas_station',
  BANK: 'bank',
  ATM: 'atm',
  POST_OFFICE: 'post_office',
} as const;

// Example usage (for future implementation):
/*
const placesService = new PlacesService('AIzaSyDPstmPzkUnJn5HeUlQlH7xsgibrG6vmXY');

// Find nearby stores
const nearbyShops = await placesService.findNearbyShops(37.7749, -122.4194, 5000);

// Find electronics stores specifically
const electronicsStores = await placesService.findShopsByCategory(
  37.7749, -122.4194, 
  SHOP_CATEGORIES.ELECTRONICS
);

// Find shops that sell specific products
const hardwareStores = await placesService.findShopsForProduct(
  37.7749, -122.4194, 
  'hardware store'
);
*/
