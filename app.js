// Tu "Base de datos" estática mapeada a tu repositorio de GitHub
const database = [
    {
        id: 'prueba',
        title: 'Radio Neverland Latino',
        author: 'SoyAlert',
        cover: './img/cover.jpg', // Tu ruta real
        folderPath: 'Listas/prueba/',
        tracks: [
            { title: 'Sailor Moon . En mis sueños HD', file: 'Sailor Moon . En mis sueños HD Completo.mp3' },
            { title: 'Dragon Ball Z ED2', file: 'dbz_ed2.mp3' },
            // ... ya no hay "time" ...
        ]
    }
];

// Variables de estado del reproductor
let currentPlaylist = null;
let currentTrackIndex = 0;
const audio = document.getElementById('audio-element');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

// --- RENDERIZADO DE VISTAS ---

// Dibuja la pantalla principal (las carpetas)
function renderHome() {
    const content = document.getElementById('app-content');
    let html = `<div class="folder-grid">`;
    
    database.forEach(list => {
        html += `
            <div class="folder-card" onclick="renderPlaylist('${list.id}')">
                <img src="${list.cover}" class="folder-cover" alt="Cover">
                <div class="folder-title">${list.title}</div>
                <div class="folder-meta">${list.tracks.length} items</div>
            </div>
        `;
    });
    
    html += `</div>`;
    content.innerHTML = html;
}

// Dibuja el interior de una carpeta específica
function renderPlaylist(playlistId) {
    const list = database.find(l => l.id === playlistId);
    const content = document.getElementById('app-content');
    
    let html = `
        <div class="playlist-header">
            <img src="${list.cover}" class="playlist-cover" alt="Cover">
            <div class="playlist-info">
                <h1>${list.title}</h1>
                <div class="meta">
                    <span class="material-icons-round" style="font-size: 16px;">lock</span>
                    ${list.author} • ${list.tracks.length} tracks
                </div>
            </div>
        </div>
        <div class="track-list">
    `;

    list.tracks.forEach((track, index) => {
        html += `
            <div class="track-item" onclick="loadAndPlayTrack('${list.id}', ${index})">
                <div class="track-num">${index + 1}</div>
                <div class="track-name">${track.title}</div>
                <div class="track-time">${track.time}</div>
                <span class="material-icons-round" style="color: #a7a7a7;">more_horiz</span>
            </div>
        `;
    });

    html += `</div>`;
    content.innerHTML = html;
}

// --- LÓGICA DEL REPRODUCTOR ---

function loadAndPlayTrack(playlistId, trackIndex) {
    currentPlaylist = database.find(l => l.id === playlistId);
    currentTrackIndex = trackIndex;
    const track = currentPlaylist.tracks[trackIndex];

    // Actualiza la UI inferior
    document.getElementById('player-cover').src = currentPlaylist.cover;
    document.getElementById('player-cover').style.display = 'block';
    document.getElementById('player-title').innerText = track.title;
    document.getElementById('player-artist').innerText = currentPlaylist.title;

    // Carga el audio (Asegúrate de que la ruta coincida con tu repo de GitHub)
    // Ej: ./Listas/RadioNeverlandLatino/dbz_op2.mp3
    audio.src = `${currentPlaylist.folderPath}${track.file}`;
    audio.play();
    playPauseBtn.innerText = 'pause';
}

function togglePlay() {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerText = 'pause';
    } else {
        audio.pause();
        playPauseBtn.innerText = 'play_arrow';
    }
}

function nextTrack() {
    if (!currentPlaylist) return;
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= currentPlaylist.tracks.length) nextIndex = 0; // Vuelve al inicio
    loadAndPlayTrack(currentPlaylist.id, nextIndex);
}

function prevTrack() {
    if (!currentPlaylist) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = currentPlaylist.tracks.length - 1;
    loadAndPlayTrack(currentPlaylist.id, prevIndex);
}

// Actualizar barra de progreso
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;
        
        // Formatear tiempo
        let currentMins = Math.floor(audio.currentTime / 60);
        let currentSecs = Math.floor(audio.currentTime % 60);
        if (currentSecs < 10) currentSecs = '0' + currentSecs;
        currentTimeEl.innerText = `${currentMins}:${currentSecs}`;
    }
});

audio.addEventListener('loadedmetadata', () => {
    let durationMins = Math.floor(audio.duration / 60);
    let durationSecs = Math.floor(audio.duration % 60);
    if (durationSecs < 10) durationSecs = '0' + durationSecs;
    totalTimeEl.innerText = `${durationMins}:${durationSecs}`;
});

// Pasar a la siguiente al terminar
audio.addEventListener('ended', nextTrack);

// Inicializar la página en la vista de Inicio
renderHome();
