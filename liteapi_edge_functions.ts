// supabase/functions/liteapi.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://esm.sh/zod";

// Import generated Zod schemas
import {
  get_the_details_of_a_hotel_schema,
  retrieve_a_list_of_hotels_schema,
  get_the_reviews_of_a_hotel_schema,
  list_the_cities_of_a_country_schema,
  list_all_countries_schema,
} from "./liteapi_zod_schemas.ts";

const LITEAPI_BASE = "https://api.liteapi.travel";

const schemaMap: Record<string, z.ZodObject<any>> = {
  "/data/hotel": get_the_details_of_a_hotel_schema,
  "/data/hotels": retrieve_a_list_of_hotels_schema,
  "/data/reviews": get_the_reviews_of_a_hotel_schema,
  "/data/cities": list_the_cities_of_a_country_schema,
  "/data/countries": list_all_countries_schema,
};

serve(async (req) => {
  const url = new URL(req.url);
  const method = req.method;
  const endpoint = url.searchParams.get("endpoint");

  // Validate endpoint
  if (!endpoint || !(endpoint in schemaMap)) {
    return new Response(JSON.stringify({ error: "Missing or unsupported 'endpoint'" }), { status: 400 });
  }

  // Load API key
  const apiKey = Deno.env.get("SUPABASE_SECRET_LITEAPI_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not set" }), { status: 500 });
  }

  // Extract and validate query params
  const inputParams: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    if (key !== "endpoint") inputParams[key] = value;
  }

  try {
    schemaMap[endpoint].parse(inputParams);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Validation failed", details: e.errors }),
      { status: 422 }
    );
  }

  // Forward request to LiteAPI
  const fullUrl = `${LITEAPI_BASE}${endpoint}?${new URLSearchParams(inputParams).toString()}`;
  const headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey,
  };

  const response = await fetch(fullUrl, { method, headers });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
});
