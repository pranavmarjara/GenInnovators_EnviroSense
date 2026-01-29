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
    this.mockPlants = [
      // Low Sunlight
      { id: 1, name: "Snake Plant", sunlight: "low", watering: "rare", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: ["headache", "respiratory"] },
      { id: 2, name: "Peace Lily", sunlight: "low", watering: "moderate", careIntensity: "moderate", medicinalValue: "General well-being", diseaseTags: ["stress", "anxiety"] },
      { id: 3, name: "ZZ Plant", sunlight: "low", watering: "rare", careIntensity: "easy", medicinalValue: "General well-being", diseaseTags: [] },
      { id: 4, name: "Cast Iron Plant", sunlight: "low", watering: "moderate", careIntensity: "easy", medicinalValue: "General well-being", diseaseTags: [] },
      { id: 5, name: "Pothos", sunlight: "low", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },

      // Moderate Sunlight
      { id: 6, name: "Aloe Vera", sunlight: "moderate", watering: "rare", careIntensity: "easy", medicinalValue: "Skin burns and digestion", diseaseTags: ["skin", "digestion"] },
      { id: 7, name: "Basil", sunlight: "moderate", watering: "frequent", careIntensity: "moderate", medicinalValue: "Anti-inflammatory", diseaseTags: ["inflammation", "digestion"] },
      { id: 8, name: "Spider Plant", sunlight: "moderate", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 9, name: "Mint", sunlight: "moderate", watering: "frequent", careIntensity: "easy", medicinalValue: "Digestion and freshness", diseaseTags: ["digestion", "nausea"] },
      { id: 10, name: "Jade Plant", sunlight: "moderate", watering: "rare", careIntensity: "moderate", medicinalValue: "General well-being", diseaseTags: [] },

      // High Sunlight
      { id: 11, name: "Marigold", sunlight: "high", watering: "moderate", careIntensity: "easy", medicinalValue: "Antiseptic properties", diseaseTags: ["skin", "wounds"] },
      { id: 12, name: "Hibiscus", sunlight: "high", watering: "frequent", careIntensity: "moderate", medicinalValue: "Blood pressure regulation", diseaseTags: ["hypertension"] },
      { id: 13, name: "Tulsi (Holy Basil)", sunlight: "high", watering: "frequent", careIntensity: "moderate", medicinalValue: "Immunity and respiratory health", diseaseTags: ["cold", "cough", "flu"] },
      { id: 14, name: "Rosemary", sunlight: "high", watering: "moderate", careIntensity: "moderate", medicinalValue: "Memory and concentration", diseaseTags: ["memory", "stress"] },
      { id: 15, name: "Lavender", sunlight: "high", watering: "rare", careIntensity: "moderate", medicinalValue: "Sleep and relaxation", diseaseTags: ["insomnia", "stress"] },

      // Additional for categories
      { id: 16, name: "Dracaena", sunlight: "low", watering: "moderate", careIntensity: "moderate", medicinalValue: "General well-being", diseaseTags: [] },
      { id: 17, name: "Rubber Plant", sunlight: "moderate", watering: "moderate", careIntensity: "easy", medicinalValue: "Air purification", diseaseTags: [] },
      { id: 18, name: "Sunflowers", sunlight: "high", watering: "frequent", careIntensity: "easy", medicinalValue: "Nutritional seeds", diseaseTags: [] },
      { id: 19, name: "Oregano", sunlight: "high", watering: "moderate", careIntensity: "easy", medicinalValue: "Antioxidant", diseaseTags: ["cold", "infection"] },
      { id: 20, name: "Lemon Balm", sunlight: "moderate", watering: "frequent", careIntensity: "easy", medicinalValue: "Anxiety relief", diseaseTags: ["anxiety", "insomnia"] }
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
    let results = [...this.mockPlants];

    if (filters.sunlight) {
      results = results.filter(p => p.sunlight === filters.sunlight);
    }
    if (filters.watering) {
      results = results.filter(p => p.watering === filters.watering);
    }
    if (filters.careIntensity) {
      results = results.filter(p => p.careIntensity === filters.careIntensity);
    }
    if (filters.disease) {
      const diseaseLower = filters.disease.toLowerCase();
      results = results.filter(p => 
        p.diseaseTags?.some(tag => tag.toLowerCase().includes(diseaseLower)) ||
        p.medicinalValue.toLowerCase().includes(diseaseLower)
      );
    }

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
