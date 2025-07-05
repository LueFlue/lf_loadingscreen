const audio = new Audio();
const musicPlayer = document.getElementById('music-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeBtn = document.getElementById('volume-btn');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const trackDuration = document.getElementById('track-duration');

let isPlaying = false;
let isMuted = false;

const tracks = config.tracks;

let currentTrackIndex = Math.floor(Math.random() * tracks.length);
let manualChange = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadTrack(index) {
  audio.src = tracks[index].src;
  document.getElementById('track-title').textContent = tracks[index].title;
  document.getElementById('track-artist').textContent = tracks[index].artist;
  progressBar.style.width = '0%';
  trackDuration.textContent = '0:00 / 0:00';
  audio.addEventListener('loadedmetadata', () => {
    trackDuration.textContent = `0:00 / ${formatTime(audio.duration)}`;
  }, { once: true });
}

function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    audio.play().catch(err => console.error("Playback failed:", err));
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
  isPlaying = !isPlaying;
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  volumeBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
  volumeSlider.value = isMuted ? 0 : audio.volume;
}

function updateProgress() {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    trackDuration.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
}

document.getElementById('play-pause-btn').addEventListener('click', togglePlayPause);

document.getElementById('prev-btn').addEventListener('click', () => {
  manualChange = true;
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play().catch(err => console.error("Playback failed:", err));
});

document.getElementById('next-btn').addEventListener('click', () => {
  manualChange = true;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) audio.play().catch(err => console.error("Playback failed:", err));
});

volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  isMuted = audio.volume === 0;
  volumeBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

volumeBtn.addEventListener('click', toggleMute);

audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('ended', () => {
  if (!manualChange) {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  }
  manualChange = false;
  loadTrack(currentTrackIndex);
  audio.play().catch(err => console.error("Playback failed:", err));
});

progressContainer.addEventListener('click', (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const seekTime = (clickX / width) * audio.duration;
  audio.currentTime = seekTime;
});

function generateWebsiteButtons() {
  const container = document.getElementById('external-links');
  if (!container) return;
  container.innerHTML = '';

  if (!config.websites_enabled) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'flex';

  config.websiteButtons.forEach(btn => {
    const a = document.createElement('a');
    a.id = btn.id;
    a.href = btn.url;
    a.target = '_blank';
    a.title = btn.title;
    a.style.color = btn.color;
    a.style.fontSize = '28px';
    a.style.margin = '0 8px';
    a.innerHTML = `<i class="${btn.iconClass}"></i>`;
    container.appendChild(a);
  });
}

function updateLoadingScreenUI() {
  const loadingScreen = document.getElementById('loading-screen');
  const websiteLinks = document.getElementById('external-links');
  const musicPlayer = document.getElementById('music-player');

  if (loadingScreen) {
    loadingScreen.style.display = config.loadingscreen_enabled ? 'block' : 'none';
  }
  if (websiteLinks) {
    websiteLinks.style.display = config.websites_enabled ? 'flex' : 'none';
  }
  if (musicPlayer) {
    musicPlayer.style.display = config.loadingscreen_enabled ? 'flex' : 'none';
  }
}

generateWebsiteButtons();
updateLoadingScreenUI();

loadTrack(currentTrackIndex);
audio.play().catch(err => console.error("Playback failed:", err));
isPlaying = true;
playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
audio.volume = volumeSlider.value;
isMuted = audio.volume === 0;
volumeBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
