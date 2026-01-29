import { 
  aqiData, plants, brands,
  type AqiData, type Plant, type Brand,
  type GetPlantRecommendationsRequest, type SolarResult, type CalculateSolarRequest
} from "@shared/schema";

export interface IStorage {
  getAqi(zip: string): Promise<AqiData>;
  getPlantRecommendations(filters: GetPlantRecommendationsRequest): Promise<Plant[]>;
  calculateSolar(params: CalculateSolarRequest): Promise<SolarResult>;
  getBrandScore(name: string): Promise<Brand>;
}

export class MemStorage implements IStorage {
  private mockPlants: Plant[];

  constructor() {
    // Seed some mock plants
    this.mockPlants = [
      {
        id: 1, name: "Aloe Vera", type: "medicinal", careLevel: "Low",
        sunlight: "Direct", watering: "Infrequent",
        image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921",
        tags: ["skin", "burns", "indoor"]
      },
      {
        id: 2, name: "Snake Plant", type: "environmental", careLevel: "Low",
        sunlight: "Low/Indirect", watering: "Infrequent",
        image: "https://images.unsplash.com/photo-1599598425947-d35279b9b48c",
        tags: ["air-purifier", "indoor"]
      },
      {
        id: 3, name: "Basil", type: "healthy", careLevel: "Medium",
        sunlight: "Direct", watering: "Regular",
        image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733",
        tags: ["cooking", "digestion"]
      },
      {
        id: 4, name: "Lavender", type: "medicinal", careLevel: "Medium",
        sunlight: "Direct", watering: "Moderate",
        image: "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da",
        tags: ["sleep", "stress", "calming"]
      },
      {
        id: 5, name: "Spider Plant", type: "environmental", careLevel: "Low",
        sunlight: "Indirect", watering: "Moderate",
        image: "https://images.unsplash.com/photo-1572688484205-a14a90c92215",
        tags: ["air-purifier", "beginner"]
      },
      {
        id: 6, name: "Mint", type: "healthy", careLevel: "Low",
        sunlight: "Partial", watering: "Frequent",
        image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
        tags: ["digestion", "tea"]
      }
    ];
  }

  async getAqi(zip: string): Promise<AqiData> {
    // Mock AQI Logic based on ZIP code
    const zipNum = parseInt(zip) || 0;
    let value = 45;
    let category = "Good";
    let color = "green";

    if (zipNum % 3 === 0) {
      value = 112;
      category = "Unhealthy for Sensitive Groups";
      color = "orange";
    } else if (zipNum % 2 === 0) {
      value = 75;
      category = "Moderate";
      color = "yellow";
    }

    // specific mock for 90210
    if (zip === "90210") {
      value = 155;
      category = "Unhealthy";
      color = "red";
    }

    return { id: 1, zip, value, category, color };
  }

  async getPlantRecommendations(filters: GetPlantRecommendationsRequest): Promise<Plant[]> {
    // Simple mock filtering
    let results = [...this.mockPlants];

    if (filters.disease) {
      // If disease is entered, prioritize medicinal
      const medicinal = results.filter(p => p.type === "medicinal");
      const others = results.filter(p => p.type !== "medicinal");
      results = [...medicinal, ...others];
    } else {
      // Basic healthy recommendation
      // Keep all, maybe sort by care level
    }
    
    // In a real app, we'd use weather to filter sunlight/watering, 
    // but for mock data we just return the static list primarily.
    return results;
  }

  async calculateSolar(params: CalculateSolarRequest): Promise<SolarResult> {
    const { dailyKwh } = params;
    // Simple Mock Logic
    // If usage is very low, maybe not worth it? Or always worth it?
    // Let's say < 5kWh is not worth it for this mock.
    
    if (dailyKwh < 5) {
      return {
        worthIt: false,
        summary: "Your energy usage is too low to justify the upfront cost of solar panels."
      };
    }

    // Estimate panels (300W per panel, 4 sun hours avg)
    // Daily Need = Kwh. Panel Daily Prod = 0.3 * 4 = 1.2 kWh
    const panelsNeeded = Math.ceil(dailyKwh / 1.2);
    const annualSavings = Math.round(dailyKwh * 0.15 * 365); // $0.15 per kWh

    return {
      worthIt: true,
      panels: panelsNeeded,
      summary: `You could save approximately $${annualSavings} per year.`
    };
  }

  async getBrandScore(name: string): Promise<Brand> {
    // Mock logic: hash the name to get a consistent score
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = Math.abs(hash % 100);
    
    let ecoRating = "Low";
    if (score > 70) ecoRating = "High";
    else if (score > 40) ecoRating = "Medium";

    let packagingImpact = "High";
    if (score > 70) packagingImpact = "Low";
    else if (score > 40) packagingImpact = "Moderate";

    return {
      id: 1,
      name,
      score,
      ecoRating,
      packagingImpact
    };
  }
}

export const storage = new MemStorage();
