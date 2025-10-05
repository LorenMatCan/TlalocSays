import { z } from 'zod';

export type WeatherFeature = 'temperature' | 'wind speed' | 'humidity';

export const weatherFeatures: { id: WeatherFeature, label: string }[] = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'wind speed', label: 'Wind Speed' },
    { id: 'humidity', label: 'Humidity' },
    { id: 'cloud amount', label: 'Cloud Amount' },
    { id: 'sky clearness', label: 'Sky Clearness' },
    { id: 'frost day', label: 'Frost Day' },
]

export const formSchema = z.object({
    location: z.string().min(2, {
        message: "Location must be at least 2 characters.",
    }),
    date: z.date({
        required_error: "A date is required.",
    }),
    features: z.array(z.string()).refine((value) => value.some((item) =>
        item), {
        message: "You have to select at least one feature.",
    }),
    latitude: z.number().min(-90, { message: "Latitude must be between -90 and 90." }).max(90, { message: "Latitude must be between -90 and 90." }).optional(),
    longitude: z.number().min(-180, { message: "Longitude must be between -180 and 180." }).max(180, { message: "Longitude must be between -180 and 180." }).optional(),
});

export type WeatherData = {
  location: string;
  date: string;
  report: string;
  analysis: string;
  visualizationData: { name: string; value: number }[];
  metrics: {
    temperature: number;
    wind: number;
    humidity: number;
  };
  features: WeatherFeature[];
  conditions: {
    very_hot: boolean;
    very_cold: boolean;
    very_windy: boolean;
    very_wet: boolean;
  };
  thresholds: {
    VERY_HOT: number;
    VERY_COLD: number;
    VERY_WINDY: number;
    VERY_WET: number;
  };
};
