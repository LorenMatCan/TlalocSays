"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import type { WeatherData } from '@/lib/types'

interface WeatherChartProps {
    data: WeatherData['visualizationData'];
}

export function WeatherChart({ data }: WeatherChartProps) {
    const chartConfig = data.reduce((acc, item) => {
        const nameKey = item.name.replace(/\s+/g, '');
        acc[nameKey] = {
            label: item.name,
            color: `hsl(var(--primary))`,
        };
        return acc;
    }, {} as any);

     const chartData = data.map(item => ({
        ...item,
        nameKey: item.name.replace(/\s+/g, '')
    }));

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-lg">Data Visualization</CardTitle>
                <CardDescription className="text-xs">Visual representation of key weather feature probabilities.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.8)" />
                            <XAxis 
                                dataKey="name" 
                                tickLine={false} 
                                tickMargin={10} 
                                axisLine={false}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                            />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10}/>
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--accent) / 0.5)' }}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
