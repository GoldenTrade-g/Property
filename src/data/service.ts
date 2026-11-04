import { Property, properties as staticProperties } from './properties';

// Simulate API service with dynamic data
class PropertyDataService {
  private lastFetchTime: Date = new Date();
  private priceVariation: Map<string, number> = new Map();

  // Simulate fetching data from API
  async fetchProperties(): Promise<{ data: Property[]; timestamp: Date }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update last fetch time
    this.lastFetchTime = new Date();

    // Apply price variations (±2% fluctuation)
    const dynamicProperties = staticProperties.map(property => {
      const variation = this.getPriceVariation(property.id);
      const fluctuation = 1 + (variation / 100);
      
      return {
        ...property,
        askingRate: Math.round(property.askingRate * fluctuation),
        totalPrice: Math.round(property.totalPrice * fluctuation * 100) / 100,
        avgMonthlyRent: Math.round(property.avgMonthlyRent * fluctuation),
      };
    });

    return {
      data: dynamicProperties,
      timestamp: this.lastFetchTime,
    };
  }

  // Generate price variation for each property
  private getPriceVariation(propertyId: string): number {
    if (!this.priceVariation.has(propertyId)) {
      // Initial variation between -2% and +2%
      this.priceVariation.set(propertyId, (Math.random() - 0.5) * 4);
    }
    
    // Small random adjustment on each fetch (±0.5%)
    const currentVariation = this.priceVariation.get(propertyId)!;
    const adjustment = (Math.random() - 0.5) * 1;
    const newVariation = Math.max(-3, Math.min(3, currentVariation + adjustment));
    
    this.priceVariation.set(propertyId, newVariation);
    return newVariation;
  }

  // Get last fetch timestamp
  getLastFetchTime(): Date {
    return this.lastFetchTime;
  }

  // Format time ago
  getTimeAgo(): string {
    const now = new Date();
    const diffMs = now.getTime() - this.lastFetchTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
  }
}

export const propertyDataService = new PropertyDataService();
