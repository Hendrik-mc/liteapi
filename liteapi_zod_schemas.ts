import { z } from 'zod';

// Zod schema for Get the details of a hotel
export const get_the_details_of_a_hotel_schema = z.object({
  hotelId: z.string(),
  timeout: z.string().optional(),
});

// Zod schema for Retrieve a list of hotels
export const retrieve_a_list_of_hotels_schema = z.object({
  countryCode: z.string(),
  cityName: z.string().optional(),
  offset: z.string().optional(),
  limit: z.string().optional(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  distance: z.string().optional(),
  timeout: z.string().optional(),
});

// Zod schema for Get the reviews of a hotel
export const get_the_reviews_of_a_hotel_schema = z.object({
  hotelId: z.string(),
  limit: z.string().optional(),
  timeout: z.string().optional(),
});

// Zod schema for List the cities of a country
export const list_the_cities_of_a_country_schema = z.object({
  countryCode: z.string(),
  timeout: z.string().optional(),
});

// Zod schema for List all countries
export const list_all_countries_schema = z.object({
  timeout: z.string().optional(),
});
