 document.addEventListener('DOMContentLoaded', function() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
      console.error('Leaflet library failed to load');
      return;
    }

    // Initialize the map
    const map = L.map('map', {
      zoomControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      attributionControl: false
    });

    // ESRI Satellite Imagery
    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);

    // Enhanced street map layer with names (CartoDB)
    const streetMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      pane: 'labels',
      maxZoom: 20
    });

    // Create pane for labels
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;

    // Target location (Gamoun Center)
    const targetLocation = [32.978758, 10.460650];
    const zoomLevel = 17;

    // Function to update marker position
    function updateMarkerPosition() {
      const marker = document.getElementById('marker');
      if (marker && map) {
        const point = map.latLngToContainerPoint(targetLocation);
        marker.style.left = point.x + 'px';
        marker.style.top = point.y + 'px';
      }
    }

    // More energetic vertical zoom animation from Tunisia to location
    setTimeout(() => {
      // Start from Tunisia center with exact same longitude as target for perfect vertical movement
      map.setView([34.0, targetLocation[1]], 6);
      setTimeout(() => {
        // More energetic animation with faster duration and stronger easing
        map.flyTo(targetLocation, zoomLevel, {
          duration: 1.2, // Faster animation
          easeLinearity: 0.05, // Much more energetic easing
          noMoveStart: true
        });
      }, 300);
    }, 100);

    // Update marker position on map move
    map.on('move', updateMarkerPosition);
    map.on('zoom', updateMarkerPosition);
    map.on('zoomend', updateMarkerPosition);
    map.on('moveend', updateMarkerPosition);
    
    // Initial marker position update
    setTimeout(updateMarkerPosition, 2000);

    // Button controls
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
    
    // Enhanced layer toggle with street names
    let streetViewVisible = false;
    document.getElementById('toggle-layers').addEventListener('click', function() {
      streetViewVisible = !streetViewVisible;
      this.classList.toggle('active');
      if (streetViewVisible) {
        streetMap.addTo(map);
      } else {
        map.removeLayer(streetMap);
      }
    });

    // Add street view initially to show names
    streetMap.addTo(map);
    document.getElementById('toggle-layers').classList.add('active');
  });