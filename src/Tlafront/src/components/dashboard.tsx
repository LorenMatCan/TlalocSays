"use client";

import type { WeatherData, WeatherFeature } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherCard } from "./weather-card";
import { WeatherChart } from "./weather-chart";
import { CloudDrizzle, Download, Factory, Leaf, Thermometer, Wind, BarChart3 } from "lucide-react";
import { format } from "date-fns";

interface DashboardProps {
  data: WeatherData;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

export function Dashboard({ data, mapContainerRef }: DashboardProps) {
  const formattedDate = format(new Date(data.date), "PPP");
  
  const allWeatherCards = [
    {
      id: 'wind speed',
      icon: <Wind />,
      title: 'Wind Speed',
      value: `${data.metrics.wind} km/h`,
    },
    {
      id: 'humidity',
      icon: <Thermometer />,
      title: 'Humidity',
      value: `${data.metrics.humidity}`,
    },
    {
      id: 'cloud amount',
      icon: <Factory />,
      title: 'Cloud Amount',
      value: `${data.metrics.cloud} ug/m³`,
    },
    {
      id: 'sky clearness',
      icon: <Leaf />,
      title: 'Sky Clearness',
      value: data.metrics.skyClearness,
    },
    {
      id: 'frost day',
      icon: <BarChart3 />,
      title: 'Frost Day',
      value: data.metrics.frostDay,
    },
  ];

  const selectedCards = allWeatherCards.filter(card => data.features.includes(card.id as WeatherFeature));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full h-full">
        {/* Left & Center Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-tight">{data.location}</CardTitle>
                    <CardDescription>{formattedDate}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCards.map(card => (
                        <WeatherCard key={card.id} icon={card.icon} title={card.title} value={card.value} />
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 flex-grow">
                <div className="xl:col-span-3 h-[300px] xl:h-auto">
                     <WeatherChart data={data.visualizationData} />
                </div>
                <div className="xl:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold mb-1 text-primary">Meteorologist's Summary</h4>
                                <p className="text-muted-foreground text-xs">{data.report}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1 text-primary">Historical Data Insights</h4>
                                <p className="text-muted-foreground text-xs">{data.analysis}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        {/* Right Section - Map */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="flex-grow h-[300px] lg:h-auto">
                 <CardHeader>
                    <CardTitle className="text-lg font-headline">Event Location Map</CardTitle>
                </CardHeader>
                <CardContent>
                    <div ref={mapContainerRef} className="h-[250px] lg:h-[450px] w-full rounded-lg" />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
