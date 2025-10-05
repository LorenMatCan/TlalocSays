"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Search, Bell, MessageSquare } from 'lucide-react';
import { format, addMonths, subYears } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from "./ui/input";

interface HeaderProps {
    onNewReport: () => void;
    onDateChange: (date: Date) => void;
    onCoordsChange: (lat: number, lng: number) => void;
    initialDate: Date;
    lat: number;
    lng: number;
}

export function Header({ onNewReport, onDateChange, onCoordsChange, initialDate, lat, lng }: HeaderProps) {
    const [date, setDate] = useState<Date>(initialDate);
    const [currentLat, setCurrentLat] = useState(lat.toString());
    const [currentLng, setCurrentLng] = useState(lng.toString());

    useEffect(() => {
        setDate(initialDate);
    }, [initialDate]);

    useEffect(() => {
        setCurrentLat(lat.toString());
        setCurrentLng(lng.toString());
    }, [lat, lng]);

    const handleDateSelect = (selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            onDateChange(selectedDate);
        }
    }

    const handleCoordsBlur = () => {
        const newLat = parseFloat(currentLat);
        const newLng = parseFloat(currentLng);
        if (!isNaN(newLat) && !isNaN(newLng)) {
            onCoordsChange(newLat, newLng);
        }
    }
    
    const handleCoordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCoordsBlur();
        }
    }


    return (
        <header className="w-full bg-transparent py-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="/tlaloc-print.jpg" />
                        <AvatarFallback>SR</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm text-muted-foreground">Hello!</p>
                    </div>
                </div>

                
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                         <Input 
                            type="number"
                            placeholder="Latitude"
                            value={currentLat}
                            onChange={(e) => setCurrentLat(e.target.value)}
                            onBlur={handleCoordsBlur}
                            onKeyPress={handleCoordKeyPress}
                            className="w-28"
                        />
                         <Input 
                            type="number"
                            placeholder="Longitude"
                            value={currentLng}
                            onChange={(e) => setCurrentLng(e.target.value)}
                            onBlur={handleCoordsBlur}
                            onKeyPress={handleCoordKeyPress}
                            className="w-28"
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    size="icon"
                                    className={cn("w-10 h-10", !date && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    fromDate={subYears(new Date(), 2)}
                                    toDate={addMonths(new Date(), 6)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        <Button variant="outline" size="icon"><MessageSquare className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon"><Bell className="h-4 w-4"/></Button>
                    </div>
                    
                    <Button onClick={onNewReport} variant="default" className="shadow-sm ml-4 bg-primary/90 hover:bg-primary">
                        New Report
                    </Button>
                </div>
            </div>
        </header>
    )
}
