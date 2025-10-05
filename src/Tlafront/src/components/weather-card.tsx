import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type React from "react";

interface WeatherCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

export function WeatherCard({ icon, title, value }: WeatherCardProps) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
