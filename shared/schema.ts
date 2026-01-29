import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We will mostly use in-memory mock data, but defining schemas ensures type safety

// === AQI Data ===
export const aqiData = pgTable("aqi_data", {
  id: serial("id").primaryKey(),
  zip: text("zip").notNull(),
  value: integer("value").notNull(),
  category: text("category").notNull(), // Good, Moderate, Poor
  color: text("color").notNull(), // green, yellow, red
});

// === Plant Recommendations ===
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // medicinal, healthy, environmental
  careLevel: text("care_level").notNull(), // Low, Medium, High
  sunlight: text("sunlight").notNull(),
  watering: text("watering").notNull(),
  image: text("image"),
  tags: text("tags").array(), // For filtering by disease/condition
});

// === Brand Scores ===
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  packagingImpact: text("packaging_impact").notNull(),
  ecoRating: text("eco_rating").notNull(), // Low, Medium, High
});

// === Schemas ===
export const insertAqiSchema = createInsertSchema(aqiData);
export const insertPlantSchema = createInsertSchema(plants);
export const insertBrandSchema = createInsertSchema(brands);

// === Type Exports ===
export type AqiData = typeof aqiData.$inferSelect;
export type Plant = typeof plants.$inferSelect;
export type Brand = typeof brands.$inferSelect;

// === API Request/Response Types ===

// AQI
export const getAqiSchema = z.object({
  zip: z.string().min(5),
});
export type GetAqiRequest = z.infer<typeof getAqiSchema>;

// Plants
export const getPlantRecommendationsSchema = z.object({
  zip: z.string().optional(),
  weather: z.enum(["hot", "moderate", "cold"]),
  disease: z.string().optional(),
});
export type GetPlantRecommendationsRequest = z.infer<typeof getPlantRecommendationsSchema>;

// Solar
export const calculateSolarSchema = z.object({
  zip: z.string(),
  dailyKwh: z.coerce.number().min(0),
});
export type CalculateSolarRequest = z.infer<typeof calculateSolarSchema>;

export type SolarResult = {
  worthIt: boolean;
  panels?: number;
  summary: string;
};

// Brand
export const getBrandScoreSchema = z.object({
  name: z.string(),
});
export type GetBrandScoreRequest = z.infer<typeof getBrandScoreSchema>;
