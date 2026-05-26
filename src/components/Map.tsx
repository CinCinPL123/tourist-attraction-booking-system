'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Attraction } from '@/types';

interface MapProps {
  attractions: Attraction[];
  onSelectAttraction: (attraction: Attraction) => void;
}

export default function Map({ attractions, onSelectAttraction }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: number]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultCenter: L.LatLngExpression = [52.1, 19.4];
    const defaultZoom = 6;

    const mapInstance = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(mapInstance);

    mapRef.current = mapInstance;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = {};

    if (attractions.length === 0) return;

    const groupBounds = L.latLngBounds([]);

    attractions.forEach((attraction) => {
      const position: L.LatLngExpression = [attraction.lat, attraction.lng];
      groupBounds.extend(position);

      const iconLetter = attraction.category ? attraction.category.substring(0, 1).toUpperCase() : 'A';
      
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-30 animate-ping"></span>
            <div class="relative w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 border-2 border-white shadow-lg flex items-center justify-center text-white font-extrabold text-xs transition-transform duration-200 hover:scale-110">
              ${iconLetter}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 bg-emerald-500 rotate-45 border-r border-b border-white"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const marker = L.marker(position, { icon: customIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <h4 class="font-extrabold text-slate-900 text-xs">${attraction.title}</h4>
            <div class="flex items-center justify-between mt-1 gap-2">
              <span class="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5 bg-slate-100 rounded">${attraction.category}</span>
              <span class="text-xs font-black text-emerald-700">${attraction.price} PLN</span>
            </div>
            <p class="text-[10px] text-slate-400 mt-1 cursor-pointer hover:underline font-bold text-center select-attraction-btn">Click to view details</p>
          </div>
        `);

      marker.on('click', () => {
        onSelectAttraction(attraction);
      });

      markersRef.current[attraction.id] = marker;
    });

    if (attractions.length > 1) {
      map.fitBounds(groupBounds, { padding: [40, 40] });
    } else if (attractions.length === 1) {
      map.setView([attractions[0].lat, attractions[0].lng], 8);
    }
  }, [attractions, onSelectAttraction]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
