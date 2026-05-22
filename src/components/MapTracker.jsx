import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Autocomplete } from '@react-google-maps/api';
import { MapPin, Search, Navigation } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '100%', borderRadius: 'inherit' };
const defaultCenter = { lat: 28.6315, lng: 77.2167 }; // Connaught Place, New Delhi

const MapTracker = ({ sosState, ambulanceETA, setAmbulanceETA, ambulanceDist, setAmbulanceDist }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", // Provide your API key in .env
    libraries,
  });

  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [ambulanceLocation, setAmbulanceLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Initial user location setup
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setPermissionDenied(false);
        },
        () => {
          setPermissionDenied(true);
        }
      );
    }
  }, []);

  // Handle SOS Dispatched -> spawn ambulance and start moving it
  useEffect(() => {
    let interval;
    if (sosState === 'dispatched') {
      // Spawn ambulance ~0.05 degrees away (approx 5km)
      const spawnLat = userLocation.lat + 0.04;
      const spawnLng = userLocation.lng + 0.03;
      setAmbulanceLocation({ lat: spawnLat, lng: spawnLng });
      setAmbulanceETA(14);
      setAmbulanceDist(5.2);

      let currentLat = spawnLat;
      let currentLng = spawnLng;
      let currentETA = 14;
      let currentDist = 5.2;

      // Update position every 2 seconds
      interval = setInterval(() => {
        // Move slightly towards user 
        currentLat -= (currentLat - userLocation.lat) * 0.1;
        currentLng -= (currentLng - userLocation.lng) * 0.1;

        currentDist -= (currentDist * 0.1);
        currentETA = Math.floor(currentETA * 0.9);

        setAmbulanceLocation({ lat: currentLat, lng: currentLng });
        setAmbulanceDist(Math.max(currentDist, 0.1).toFixed(1));
        setAmbulanceETA(Math.max(currentETA, 1));
        
        if (currentDist < 0.2) clearInterval(interval);

      }, 3000);
    } else {
      setAmbulanceLocation(null);
    }

    return () => clearInterval(interval);
  }, [sosState, userLocation, setAmbulanceETA, setAmbulanceDist]);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if(place.geometry && place.geometry.location) {
        setUserLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
        map?.panTo({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
      }
    }
  };

  if (loadError) return <div className="p-4 text-center text-rose-500 bg-slate-900 w-full h-full flex items-center justify-center">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="p-4 text-center text-teal-400 bg-slate-900 w-full h-full flex items-center justify-center animate-pulse">Loading Map Services...</div>;

  return (
    <div className="absolute inset-0 z-0">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ disableDefaultUI: true, zoomControl: true, styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "road", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        ]}}
      >
        {/* User Location Marker */}
        <Marker position={userLocation} icon={{
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeWeight: 4,
          strokeColor: '#ffffff',
          scale: 8
        }} />

        {/* Moving Ambulance Marker */}
        {ambulanceLocation && (
          <>
            <Marker position={ambulanceLocation} icon={{
              url: 'https://cdn-icons-png.flaticon.com/512/1042/1042226.png', // Temporary ambulance icon
              scaledSize: new window.google.maps.Size(40, 40)
            }} />
            <Polyline 
              path={[ambulanceLocation, userLocation]} 
              options={{ strokeColor: '#e11d48', strokeOpacity: 0.8, strokeWeight: 4, strokeDasharray: "5, 5" }} 
            />
          </>
        )}

        {/* Search Box if GPS denied or they want to move it manually */}
        {sosState === 'idle' && (
          <div className="absolute top-4 left-4 z-10 w-80">
             <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
               <div className="relative">
                 <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder={permissionDenied ? "Location denied. Enter manually..." : "Search location"}
                   className="w-full bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 shadow-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                 />
               </div>
             </Autocomplete>
          </div>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapTracker;
