'use server';

import type { WeatherData, WeatherFeature } from '@/lib/types';
import { formSchema } from '@/lib/types';
import type { z } from 'zod';
import { format } from 'date-fns';


export async function getWeatherData(values: z.infer<typeof formSchema>): Promise<WeatherData | { error: string }> {
  try {
    const validatedValues = formSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: 'Invalid input data.' };
    }

    const { location, date, features, latitude, longitude } = validatedValues.data;
    
    const requestBody = {
      latitude: latitude,
      longitude: longitude,
      date: format(date, "MM/dd/yyyy")
    };

    const response = await fetch("http://127.0.0.1:5000/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        console.error("Backend request failed:", response.status, response.statusText);
        const errorText = await response.text();
        return { error: `Failed to fetch weather data from backend. Server responded with: ${errorText}` };
    }

    const data = await response.json();

    const visualizationData = (features as WeatherFeature[]).map(feature => {
        let value;
        let name = '';
        switch(feature) {
            case 'temperature': value = data.averages.temperature_avg; name = 'Temperature'; break;
            case 'wind speed': value = data.averages.wind_avg; name = 'Wind Speed'; break;
            case 'humidity': value = data.averages.humidity_avg; name = 'Humidity'; break;
            default: value = 0; name = feature.charAt(0).toUpperCase() + feature.slice(1);
        }
        return { name, value };
    });

    return {
      location,
      date: date.toISOString(),
      features: features as WeatherFeature[],
      report: data.source || "No report available.",
      analysis: `Analysis based on ${data.num_años} years of data` || "No analysis available.",
      visualizationData: visualizationData,
      metrics: {
        temperature: data.averages.temperature_avg,
        wind: data.averages.wind_avg,
        humidity: data.averages.humidity_avg,
      },
      conditions: data.conditions,
      thresholds: data.thresholds,
    };
  } catch (error) {
    console.error('Error in getWeatherData action:', error);
    // As requested, only log the error if backend is unreachable.
    return { error: 'Failed to connect to the weather data service. Please ensure it is running and try again.' };
  }
}


