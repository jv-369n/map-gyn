// Variáveis globais
let map;
let currentIconType = 'x';
let currentTransportType = 'bus';
let markers = [];
let addMarkerMode = false;

// Cores dos ícones
const iconColors = {
    bus: '#9b59b6',
    train: '#f1c40f',
    car: '#ecf0f1'
};

// Inicialização do mapa
document.addEventListener('DOMContentLoaded', function() {
    // Cria o mapa
    map = L.map('map').setView([-16.6799, -49.255], 13);
    
    // Adiciona o tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Cria controles personalizados
    createControls();
    
    // Carrega marcadores salvos
    loadMarkers();
    
    // Configura evento de clique no mapa
    map.on('click', function(e) {
        if (addMarkerMode) {
            addMarker(e.latlng);
            addMarkerMode = false;
            updateControlText();
        }
    });
});

// Cria controles interativos
function createControls() {
    // Controle para adicionar marcadores
    const addMarkerControl = L.control({position: 'topright'});
    addMarkerControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'custom-control');
        div.innerHTML = `
            <button id="toggle-marker-mode" class="map-control">
                <span id="marker-mode-text">Adicionar Marcador</span>
            </button>
            <button id="change-icon-type" class="map-control">
                Ícone: <span id="icon-type-text">X</span>
            </button>
            <button id="change-transport-type" class="map-control">
                Tipo: <span id="transport-type-text" style="color: ${iconColors.bus}">Ônibus</span>
            </button>
        `;
        
        // Adiciona eventos
        L.DomEvent.on(div.querySelector('#toggle-marker-mode'), 'click', toggleMarkerMode);
        L.DomEvent.on(div.querySelector('#change-icon-type'), 'click', changeIconType);
        L.DomEvent.on(div.querySelector('#change-transport-type'), 'click', changeTransportType);
        
        return div;
    };
    addMarkerControl.addTo(map);
}

// Alterna o modo de adição de marcadores
function toggleMarkerMode() {
    addMarkerMode = !addMarkerMode;
    updateControlText();
}

// Atualiza os textos dos controles
function updateControlText() {
    document.getElementById('marker-mode-text').textContent = 
        addMarkerMode ? 'Clique no mapa' : 'Adicionar Marcador';
    document.getElementById('icon-type-text').textContent = 
        currentIconType === 'x' ? 'X' : '●';
    document.getElementById('transport-type-text').textContent = 
        currentTransportType === 'bus' ? 'Ônibus' : 
        currentTransportType === 'train' ? 'Trem' : 'Carro';
    document.getElementById('transport-type-text').style.color = 
        iconColors[currentTransportType];
}

// Adiciona um marcador ao mapa
function addMarker(latlng, title = '', description = '') {
    const icon = L.divIcon({
        className: `custom-marker marker-${currentTransportType} marker-${currentIconType}`,
        html: currentIconType === 'x' ? 'X' : '●',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const marker = L.marker(latlng, { icon })
        .addTo(map)
        .bindPopup(`<b>${title || 'Novo Marcador'}</b><br>${description || ''}`);
    
    markers.push({
        position: latlng,
        type: currentTransportType,
        iconType: currentIconType,
        title: title,
        description: description
    });
    
    saveMarkers();
}

// Altera o tipo de ícone
function changeIconType() {
    currentIconType = currentIconType === 'x' ? 'circle' : 'x';
    updateControlText();
}

// Altera o tipo de transporte
function changeTransportType() {
    const types = ['bus', 'train', 'car'];
    const currentIndex = types.indexOf(currentTransportType);
    currentTransportType = types[(currentIndex + 1) % types.length];
    updateControlText();
}

// Carrega marcadores salvos
function loadMarkers() {
    const savedMarkers = localStorage.getItem('goiania_map_markers');
    if (savedMarkers) {
        markers = JSON.parse(savedMarkers);
        markers.forEach(marker => {
            currentTransportType = marker.type;
            currentIconType = marker.iconType;
            addMarker(marker.position, marker.title, marker.description);
        });
    }
}

// Salva marcadores no localStorage
function saveMarkers() {
    localStorage.setItem('goiania_map_markers', JSON.stringify(markers));
}