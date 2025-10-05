"use client";

import React, { useEffect, useState, useRef } from 'react';
import type { z } from "zod";
import type L from 'leaflet';
import Image from 'next/image';

import { WelcomeDialog } from '@/components/welcome-dialog';
import { Dashboard } from '@/components/dashboard';
import { getWeatherData } from '@/app/actions';
import type { WeatherData } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Header } from '@/components/header';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import { formSchema } from '@/lib/types';
import { AppSidebar } from '@/components/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [lat, setLat] = useState(19.43);
  const [lng, setLng] = useState(-99.13);
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenDialog = sessionStorage.getItem('hasSeenWelcomeDialog');
    if (!hasSeenDialog) {
      setIsDialogOpen(true);
      sessionStorage.setItem('hasSeenWelcomeDialog', 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current && mapContainerRef.current) {
      const L = require('leaflet');
      const mapInstance = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 5,
        attributionControl: false,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance);
      
      L.marker([lat, lng]).addTo(mapInstance);

      mapRef.current = mapInstance;
      setMap(mapInstance);
    }
  }, []); 

  useEffect(() => {
    if (map) {
      map.setView([lat, lng]);
       // Clear existing markers and add a new one
       map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      const L = require('leaflet');
      L.marker([lat, lng]).addTo(map);
    }
  }, [lat, lng, map]);
  
  const { toast } = useToast();

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setWeatherData(null);
    
    // Close dialog only on successful submission. If it's already closed, it does nothing.
    setIsDialogOpen(false); 
    
    const locationName = values.location;
    if (values.latitude && values.longitude) {
      setLat(values.latitude);
      setLng(values.longitude);
    }
    
    const result = await getWeatherData({ ...values, location: locationName });
    
    if ("error" in result) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setIsDialogOpen(true); // Re-open the dialog on error
    } else {
      setWeatherData(result);
    }
    setIsLoading(false);
  };

  const handleNewReport = () => {
    // Resetting data but keeping the map state
    setWeatherData(null);
    setIsDialogOpen(true);
  }

  const handleDateChange = (date: Date) => {
    if(weatherData) {
      const newValues: z.infer<typeof formSchema> = {
        location: weatherData.location,
        date: date,
        features: weatherData.features,
        latitude: lat,
        longitude: lng,
      };
      handleFormSubmit(newValues);
    }
  }

  return (
    <>
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header 
          onNewReport={handleNewReport}
          onDateChange={handleDateChange}
          onCoordsChange={(newLat, newLng) => {
            setLat(newLat);
            setLng(newLng);
          }}
          initialDate={weatherData ? new Date(weatherData.date) : new Date()}
          lat={lat}
          lng={lng}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="w-full h-full max-w-screen-2xl mx-auto">
              {isLoading && !weatherData && <DashboardSkeleton />}

              {!isLoading && weatherData ? (
                <Dashboard data={weatherData} mapContainerRef={mapContainerRef} />
              ) : (
                !isLoading && !weatherData && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-card rounded-xl shadow-md">
                      <Image src="/Tlaloc-Icon.jpg" alt="Tlaloc Icon" width={80} height={80} className="mb-4" />
                      <h2 className="text-2xl font-bold font-headline text-foreground mb-2">Welcome to Tlaloc's Dashboard</h2>
                      <p className="text-muted-foreground mb-6 max-w-md">
                          Generate a new historical weather report to begin. Check the likelihood of rain, wind, heat, and more for any location and date.
                      </p>
                      <button onClick={handleNewReport} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold shadow-sm hover:bg-primary/90 transition-colors">
                          Create a New Report
                      </button>
                  </div>
                )
              )}
            </div>
        </main>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      )}
      <WelcomeDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSubmit={handleFormSubmit}
        isSubmitting={isLoading}
      />
    </>
  );
}
