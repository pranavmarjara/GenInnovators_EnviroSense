import { 
  aqiData, plants,
  type AqiData, type Plant,
  type GetPlantRecommendationsRequest, type SolarResult, type CalculateSolarRequest
} from "@shared/schema";

export interface IStorage {
  getAqi(zip: string): Promise<AqiData>;
  getPlantRecommendations(filters: GetPlantRecommendationsRequest): Promise<Plant[]>;
  calculateSolar(params: CalculateSolarRequest): Promise<SolarResult>;
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
    
    // Panel specs: 500W monocrystalline, ~4 sun hours avg
    const panelWatts = 500;
    const sunHoursPerDay = 4;
    const panelDailyKwh = (panelWatts / 1000) * sunHoursPerDay; // 2 kWh per panel per day
    
    // Calculate panels needed
    const panelsNeeded = Math.ceil(dailyKwh / panelDailyKwh);
    const systemSizeKw = (panelsNeeded * panelWatts) / 1000;
    const dailyProduction = panelsNeeded * panelDailyKwh;
    const energyOffsetPercent = Math.min(100, Math.round((dailyProduction / dailyKwh) * 100));
    
    // CO2 reduction: ~0.4 kg CO2 per kWh saved
    const annualKwhSaved = dailyProduction * 365;
    const annualCo2ReductionTons = Math.round((annualKwhSaved * 0.4) / 1000 * 10) / 10;
    
    // Savings: ~8 INR per kWh
    const annualSavingsInr = Math.round(annualKwhSaved * 8);
    
    // Low usage threshold
    if (dailyKwh < 5) {
      return {
        worthIt: false,
        panels: panelsNeeded,
        systemSizeKw,
        energyOffsetPercent,
        annualCo2ReductionTons,
        annualSavingsInr,
        summary: "Your energy usage is relatively low. Solar installation may not provide optimal return on investment for your current consumption patterns."
      };
    }

    return {
      worthIt: true,
      panels: panelsNeeded,
      systemSizeKw,
      energyOffsetPercent,
      annualCo2ReductionTons,
      annualSavingsInr,
      summary: "Based on your energy consumption and regional factors, solar installation is recommended for your location."
    };
  }

}

export const storage = new MemStorage();
