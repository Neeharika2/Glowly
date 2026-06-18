import { useEffect, useRef, useState } from 'react';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  salonName: string;
  address?: string;
}

export default function InteractiveMap({ latitude, longitude, salonName, address }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Load Leaflet dynamically from CDN
  useEffect(() => {
    // Check if already loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Add Leaflet Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    
    script.onload = () => {
      setLeafletLoaded(true);
    };
    script.onerror = () => {
      setLoadError(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup links or scripts is optional, but standard to leave in global scope once initialized
    };
  }, []);

  // Initialize and update Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || !(window as any).L) return;

    const L = (window as any).L;

    // Clear previous map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Use CartoDB Dark Matter tiles for a high-end luxury feel
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Create a custom gold circular styled marker
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-gold/30 animate-ping"></div>
            <div class="w-4 h-4 rounded-full bg-gold border-2 border-white shadow-md"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Add marker to map
      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      // Add popup
      marker.bindPopup(`
        <div class="text-dark font-sans p-1">
          <h4 class="font-bold text-sm font-display text-plum-900">${salonName}</h4>
          <p class="text-xs text-gray-500 mt-1 max-w-[200px]">${address || 'Chennai'}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" target="_blank" rel="noopener noreferrer" class="inline-block mt-2 text-[10px] font-bold text-gold hover:underline">
            Get Directions &rarr;
          </a>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, latitude, longitude, salonName, address]);

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl border border-gray-200 p-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Failed to load interactive maps.</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(salonName + ' ' + (address || ''))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-dark text-white rounded-full text-xs font-semibold hover:bg-dark/80"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-card border border-white/10 bg-dark">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark text-white/50 gap-2.5 z-10">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-medium tracking-wider">LOADING LUXURY MAPS...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full z-0" />
    </div>
  );
}
