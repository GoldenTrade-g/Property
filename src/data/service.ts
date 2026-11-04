import { Property, properties as staticProperties } from './properties';

// Pool of potential new listings
const newListingPool: Property[] = [
  {
    id: 'P007',
    name: 'Supernova Spira',
    location: 'Sector 90, Noida',
    city: 'Noida',
    askingRate: 7800,
    unitSize: 1450,
    totalPrice: 113.1,
    status: 'Active',
    type: 'Residential',
    investmentMode: 'PG',
    builder: 'Supertech Ltd',
    builderPhone: '919810012345',
    dealer: 'NCR Real Estate Solutions',
    dealerPhone: '919876500001',
    reraNumber: 'UPRERAPRJ9012',
    reraVerified: true,
    tower: 'Tower C',
    unit: '708',
    rentalYield: 7.5,
    priceHistory: [
      { month: 'Jan', builderPrice: 7200, resalePrice: 7000, circleRate: 5000 },
      { month: 'Feb', builderPrice: 7300, resalePrice: 7100, circleRate: 5000 },
      { month: 'Mar', builderPrice: 7400, resalePrice: 7200, circleRate: 5100 },
      { month: 'Apr', builderPrice: 7500, resalePrice: 7300, circleRate: 5100 },
      { month: 'May', builderPrice: 7600, resalePrice: 7400, circleRate: 5200 },
      { month: 'Jun', builderPrice: 7800, resalePrice: 7600, circleRate: 5200 },
    ],
    demandGenerators: ['Noida Sector 90 Metro', 'Amity University', 'Sector 90 Market'],
    distanceToHub: 0.8,
    appreciationRate: 13,
    vacancyRate: 7,
    propertyTax: 48000,
    maintenanceCost: 38000,
    avgMonthlyRent: 70000,
    imageGradient: 'from-pink-500 to-rose-600',
    lat: 28.5100,
    lng: 77.3800,
    investmentRequired: {
      renovationCost: 5,
      setupCost: 3,
      totalInvestment: 8,
      description: 'Convert to 7-bed PG: partition walls, AC, furnished setup'
    },
    nearbyServices: {
      schools: 4,
      hospitals: 3,
      metro: 0.8,
      markets: 6,
      restaurants: 12,
      parks: 3
    },
    areaProspects: [
      'Upcoming metro connectivity boosting accessibility',
      'Amity University driving student housing demand',
      'Growing commercial establishments in Sector 90',
      'Affordable pricing with good appreciation potential'
    ]
  },
  {
    id: 'P008',
    name: 'DLF Garden City',
    location: 'Sector 91, Gurugram',
    city: 'Gurugram',
    askingRate: 9200,
    unitSize: 1600,
    totalPrice: 147.2,
    status: 'Active',
    type: 'Residential',
    investmentMode: 'Residential',
    builder: 'DLF Homes',
    builderPhone: '919810023456',
    dealer: 'Gurugram Property Experts',
    dealerPhone: '919876500002',
    reraNumber: 'HRERAPRJ1023',
    reraVerified: true,
    tower: 'Tower 12',
    unit: '1105',
    rentalYield: 5.8,
    priceHistory: [
      { month: 'Jan', builderPrice: 8500, resalePrice: 8200, circleRate: 6000 },
      { month: 'Feb', builderPrice: 8600, resalePrice: 8300, circleRate: 6000 },
      { month: 'Mar', builderPrice: 8700, resalePrice: 8400, circleRate: 6100 },
      { month: 'Apr', builderPrice: 8800, resalePrice: 8500, circleRate: 6100 },
      { month: 'May', builderPrice: 9000, resalePrice: 8700, circleRate: 6200 },
      { month: 'Jun', builderPrice: 9200, resalePrice: 8900, circleRate: 6200 },
    ],
    demandGenerators: ['Gurugram Metro', 'Cyber Hub', 'DLF Phase 5'],
    distanceToHub: 2.0,
    appreciationRate: 11,
    vacancyRate: 9,
    propertyTax: 62000,
    maintenanceCost: 48000,
    avgMonthlyRent: 71000,
    imageGradient: 'from-violet-500 to-purple-600',
    lat: 28.4300,
    lng: 76.9800,
    investmentRequired: {
      renovationCost: 4,
      setupCost: 3,
      totalInvestment: 7,
      description: 'Family rental setup: modular kitchen, wardrobes, AC'
    },
    nearbyServices: {
      schools: 6,
      hospitals: 4,
      metro: 1.5,
      markets: 8,
      restaurants: 20,
      parks: 5
    },
    areaProspects: [
      'Premium DLF township with excellent amenities',
      'Close to Cyber Hub corporate district',
      'Strong rental demand from IT professionals',
      'Well-connected to Delhi and IGI Airport'
    ]
  },
  {
    id: 'P009',
    name: 'Warehousing Park',
    location: 'Kundli, Sonipat',
    city: 'Sonipat',
    askingRate: 3200,
    unitSize: 15000,
    totalPrice: 480,
    status: 'Active',
    type: 'Warehouse',
    investmentMode: 'Logistics',
    builder: 'Warehousing Park Pvt Ltd',
    builderPhone: '919810034567',
    dealer: 'North India Logistics',
    dealerPhone: '919876500003',
    reraNumber: 'HRREPRJ5678',
    reraVerified: true,
    tower: 'Block A',
    unit: 'W-22',
    rentalYield: 11.2,
    priceHistory: [
      { month: 'Jan', builderPrice: 2900, resalePrice: 2800, circleRate: 2000 },
      { month: 'Feb', builderPrice: 2950, resalePrice: 2850, circleRate: 2000 },
      { month: 'Mar', builderPrice: 3000, resalePrice: 2900, circleRate: 2100 },
      { month: 'Apr', builderPrice: 3050, resalePrice: 2950, circleRate: 2100 },
      { month: 'May', builderPrice: 3100, resalePrice: 3000, circleRate: 2200 },
      { month: 'Jun', builderPrice: 3200, resalePrice: 3100, circleRate: 2200 },
    ],
    demandGenerators: ['Kundli Industrial Area', 'NH-44', 'Railway Freight Terminal'],
    distanceToHub: 1.8,
    appreciationRate: 16,
    vacancyRate: 2,
    propertyTax: 110000,
    maintenanceCost: 90000,
    avgMonthlyRent: 448000,
    imageGradient: 'from-red-500 to-orange-600',
    lat: 28.9500,
    lng: 77.0500,
    investmentRequired: {
      renovationCost: 12,
      setupCost: 18,
      totalInvestment: 30,
      description: 'Warehouse setup: loading docks, racking, security, office'
    },
    nearbyServices: {
      schools: 1,
      hospitals: 1,
      metro: 15.0,
      markets: 2,
      restaurants: 3,
      parks: 1
    },
    areaProspects: [
      'Strategic location on NH-44 freight corridor',
      'Growing e-commerce fulfillment demand',
      'Low vacancy rates in industrial warehousing',
      'Excellent road connectivity to Delhi-NCR'
    ]
  },
  {
    id: 'P010',
    name: 'Godrej Nature\'s Retreat',
    location: 'Sector 145, Noida',
    city: 'Noida',
    askingRate: 6500,
    unitSize: 1850,
    totalPrice: 120.25,
    status: 'Active',
    type: 'Residential',
    investmentMode: 'PG',
    builder: 'Godrej Properties',
    builderPhone: '919810045678',
    dealer: 'Noida Premium Homes',
    dealerPhone: '919876500004',
    reraNumber: 'UPRERAPRJ1134',
    reraVerified: true,
    tower: 'Tower 5',
    unit: '902',
    rentalYield: 7.8,
    priceHistory: [
      { month: 'Jan', builderPrice: 6000, resalePrice: 5800, circleRate: 4200 },
      { month: 'Feb', builderPrice: 6100, resalePrice: 5900, circleRate: 4200 },
      { month: 'Mar', builderPrice: 6200, resalePrice: 6000, circleRate: 4300 },
      { month: 'Apr', builderPrice: 6300, resalePrice: 6100, circleRate: 4300 },
      { month: 'May', builderPrice: 6400, resalePrice: 6200, circleRate: 4400 },
      { month: 'Jun', builderPrice: 6500, resalePrice: 6300, circleRate: 4400 },
    ],
    demandGenerators: ['Sector 145 Metro', 'Film City', 'Yamuna Expressway'],
    distanceToHub: 1.5,
    appreciationRate: 14,
    vacancyRate: 6,
    propertyTax: 52000,
    maintenanceCost: 42000,
    avgMonthlyRent: 78000,
    imageGradient: 'from-green-500 to-emerald-600',
    lat: 28.4600,
    lng: 77.4200,
    investmentRequired: {
      renovationCost: 6,
      setupCost: 4,
      totalInvestment: 10,
      description: 'Convert to 8-bed PG: partitions, AC, common area, WiFi'
    },
    nearbyServices: {
      schools: 3,
      hospitals: 2,
      metro: 1.5,
      markets: 5,
      restaurants: 10,
      parks: 4
    },
    areaProspects: [
      'Upcoming Jewar Airport boosting area development',
      'Film City project creating entertainment hub',
      'Excellent connectivity via Yamuna Expressway',
      'Green surroundings with premium amenities'
    ]
  }
];

// Simulate API service with dynamic data and new listings
class PropertyDataService {
  private lastFetchTime: Date = new Date();
  private priceVariation: Map<string, number> = new Map();
  private addedListings: Set<string> = new Set();
  private fetchCount: number = 0;
  private statusChanges: Map<string, 'Active' | 'Reserved' | 'Sold'> = new Map();

  // Simulate fetching data from API
  async fetchProperties(): Promise<{ data: Property[]; timestamp: Date; newListingsCount: number }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    this.fetchCount++;
    this.lastFetchTime = new Date();

    // Start with static properties
    let dynamicProperties = [...staticProperties];

    // Add new listings periodically (every 3-5 fetches)
    if (this.fetchCount % 3 === 0 && this.addedListings.size < newListingPool.length) {
      const availableNewListings = newListingPool.filter(p => !this.addedListings.has(p.id));
      if (availableNewListings.length > 0) {
        // Add 1-2 new listings
        const numToAdd = Math.min(Math.floor(Math.random() * 2) + 1, availableNewListings.length);
        for (let i = 0; i < numToAdd; i++) {
          const newListing = availableNewListings[i];
          dynamicProperties.push(newListing);
          this.addedListings.add(newListing.id);
        }
      }
    }

    // Simulate status changes (some properties get reserved/sold)
    if (this.fetchCount % 5 === 0 && this.fetchCount > 5) {
      const activeProperties = dynamicProperties.filter(p => p.status === 'Active');
      if (activeProperties.length > 3) {
        // Randomly mark 1 property as Reserved or Sold
        const randomIndex = Math.floor(Math.random() * activeProperties.length);
        const property = activeProperties[randomIndex];
        const newStatus = Math.random() > 0.5 ? 'Reserved' : 'Sold';
        this.statusChanges.set(property.id, newStatus);
      }
    }

    // Apply status changes
    dynamicProperties = dynamicProperties.map(p => {
      const statusChange = this.statusChanges.get(p.id);
      if (statusChange) {
        return { ...p, status: statusChange };
      }
      return p;
    });

    // Apply price variations (±2% fluctuation)
    dynamicProperties = dynamicProperties.map(property => {
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
      newListingsCount: this.addedListings.size,
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

  // Get count of new listings added
  getNewListingsCount(): number {
    return this.addedListings.size;
  }

  // Reset service (for testing)
  reset() {
    this.addedListings.clear();
    this.statusChanges.clear();
    this.fetchCount = 0;
    this.priceVariation.clear();
  }
}

export const propertyDataService = new PropertyDataService();
