'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ lat, lng, onChange }: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const defaultCenter: L.LatLngExpression = [lat || 52.1, lng || 19.4];
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

    const pickerIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-6 w-6 rounded-full bg-brand-400 opacity-30 animate-ping"></span>
          <div class="relative w-7 h-7 rounded-full bg-white border-2 border-brand-600 shadow-lg flex items-center justify-center">
            <div class="w-3 h-3 rounded-full bg-brand-600"></div>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-brand-600 rotate-45 border-r border-b border-white"></div>
        </div>
      `,
      className: 'custom-picker-marker',
      iconSize: [28, 32],
      iconAnchor: [14, 32]
    });

    const marker = L.marker(defaultCenter, {
      icon: pickerIcon,
      draggable: true,
    }).addTo(mapInstance);

    markerRef.current = marker;

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange(parseFloat(position.lat.toFixed(6)), parseFloat(position.lng.toFixed(6)));
    });

    mapInstance.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng(e.latlng);
      onChange(parseFloat(clickLat.toFixed(6)), parseFloat(clickLng.toFixed(6)));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync marker position if updated externally (e.g. typed in input fields)
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        const newPos = L.latLng(lat, lng);
        markerRef.current.setLatLng(newPos);
        mapRef.current.panTo(newPos);
      }
    }
  }, [lat, lng]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
