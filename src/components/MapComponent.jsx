import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapComponent({ coordinates, center, zoom = 13 }) {
  const position = center || (coordinates.length > 0 ? [coordinates[0].lat, coordinates[0].long] : [0, 0]);
  const polylinePositions = coordinates.map(coord => [coord.lat, coord.long]);

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: '400px', width: '100%' }} className="map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinates.map((coord, index) => (
        <Marker key={index} position={[coord.lat, coord.long]}>
          <Popup>
            Time: {new Date(coord.timestamp).toLocaleString()}<br />
            Lat: {coord.lat}, Long: {coord.long}
          </Popup>
        </Marker>
      ))}
      {polylinePositions.length > 1 && (
        <Polyline positions={polylinePositions} color="#bb86fc" />
      )}
    </MapContainer>
  );
}

export default MapComponent;