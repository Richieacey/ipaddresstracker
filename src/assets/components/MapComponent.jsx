import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


function MapViewUpdater({ position, zoom }) {
    const map = useMap();
    
    useEffect(() => {
        if (position && position.every(coord => typeof coord === 'number')) {
            map.setView(position, zoom);
        }
    }, [position, zoom, map]);

    return null;
}



export default function SimpleMap({ latitude, longitude, popupText }) { 
    
    const position = [latitude, longitude];
    const initialZoom = 13;

    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
       
        return <div className="w-full h-[50rem] flex items-center justify-center bg-gray-100 z-0">
                 <p className="text-xl font-medium">Loading map coordinates...</p>
               </div>;
    }

    return (
        <div className="w-full h-[50rem] overflow-hidden absolute top-[18rem] z-0"> 
            <MapContainer 
                center={position} 
                zoom={initialZoom} 
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position}> 
                    <Popup>
                        {popupText || `Location: Lat ${latitude}, Lon ${longitude}`}
                    </Popup>
                </Marker>
                <MapViewUpdater position={position} zoom={initialZoom} />

            </MapContainer>
        </div>
    );
}