// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.toggle('dark-mode', savedTheme === 'dark');
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Guestbook Functionality
const guestbookForm = document.getElementById('guestbookForm');
const guestbookEntries = document.getElementById('guestbookEntries');

// Load guestbook entries from localStorage
function loadGuestbookEntries() {
    const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    guestbookEntries.innerHTML = '';
    entries.reverse().forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';
        entryDiv.innerHTML = `
            <strong>${entry.name}</strong>
            <em>${entry.email} • ${entry.date}</em>
            <p>${entry.message}</p>
        `;
        guestbookEntries.appendChild(entryDiv);
    });
}

// Handle guestbook form submission
guestbookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('visitorName').value;
    const email = document.getElementById('visitorEmail').value;
    const message = document.getElementById('visitorMessage').value;
    
    const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    const newEntry = {
        name,
        email,
        message,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };
    
    entries.push(newEntry);
    localStorage.setItem('guestbookEntries', JSON.stringify(entries));
    
    guestbookForm.reset();
    loadGuestbookEntries();
});

// Load guestbook entries on page load
loadGuestbookEntries();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all bento items
document.querySelectorAll('.bento-item').forEach(item => {
    observer.observe(item);
});

// Add CSS animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Gallery lightbox effect (optional enhancement)
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', function() {
        const src = this.src;
        const lightbox = document.createElement('div');
        lightbox.setAttribute('style', `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        `);
        
        const img_full = document.createElement('img');
        img_full.src = src;
        img_full.setAttribute('style', `
            max-width: 90%;
            max-height: 90%;
            border-radius: 12px;
        `);
        
        lightbox.appendChild(img_full);
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', () => {
            lightbox.remove();
        });
    });
});

// Navbar active state
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 13px rgba(0, 0, 0, 0.06)';
    }
});

// Responsive Snow Background
const snowContainer = document.getElementById('snowContainer');
let snowResizeTimer = null;

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createFlake() {
    if (!snowContainer) return;
    const flake = document.createElement('div');
    flake.className = 'snow-flake';

    // size class
    const sizeRoll = Math.random();
    if (sizeRoll < 0.5) flake.classList.add('small');
    else if (sizeRoll < 0.85) flake.classList.add('medium');
    else flake.classList.add('large');

    // use a simple snow character for consistent look
    flake.textContent = '•';

    // position and animation
    const left = randomBetween(0, 100);
    flake.style.left = left + 'vw';
    const duration = randomBetween(8, 18);
    const delay = randomBetween(0, 6);
    flake.style.animation = `fall ${duration}s linear ${delay}s forwards`;

    // slight horizontal drift via transform origin variation
    flake.style.transform = `translateX(0)`;

    snowContainer.appendChild(flake);

    // Remove after animation to keep DOM small
    setTimeout(() => {
        flake.remove();
    }, (duration + delay) * 1000 + 200);
}

function generateSnow() {
    if (!snowContainer) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Clear existing flakes
    snowContainer.innerHTML = '';

    const w = window.innerWidth;
    let count;
    if (w >= 1400) count = 40;
    else if (w >= 1024) count = 30;
    else if (w >= 768) count = 20;
    else if (w >= 480) count = 12;
    else count = 6; // mobile: fewer flakes

    // Create flakes with small stagger
    for (let i = 0; i < count; i++) {
        // small timeout to stagger creation slightly
        setTimeout(createFlake, i * 120);
    }
}

// Debounced resize -> regenerate snow
window.addEventListener('resize', () => {
    clearTimeout(snowResizeTimer);
    snowResizeTimer = setTimeout(generateSnow, 250);
});

// Music Player Functionality
const playlist = [
    { title: 'Kalapastangan', artist: 'Artist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', spotifyUrl: 'https://open.spotify.com/artist/3tWAXoP37qDPvpAOnj7Zmr?si=ZlC6oza3QUiXLR7J06FASg' },
    { title: 'Always', artist: 'Artist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1E8NG9HeYK83rI?si=MVTreXdcSuuIdh4b9EU20A' },
    { title: 'Saglit', artist: 'Artist', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', spotifyUrl: 'https://open.spotify.com/album/2G5Ehp6kqdH5z4sGVCC8yY' }
];

let currentTrackIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const spotifyLink = document.getElementById('spotifyLink');
const playlistItems = document.querySelectorAll('.playlist-item');

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    audioPlayer.src = track.url;
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;
    spotifyLink.href = track.spotifyUrl;
    
    playlistItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    if (isPlaying) {
        audioPlayer.play();
    }
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class=\"fas fa-play\"></i>';
    } else {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class=\"fas fa-pause\"></i>';
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);

audioPlayer.addEventListener('timeupdate', () => {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = percent + '%';
    timeCurrent.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
});

progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class=\"fas fa-pause\"></i>';
        audioPlayer.play();
    });
});

// Load first track on page load
loadTrack(0);

// Initial generate after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // small timeout to ensure layout settled
    setTimeout(generateSnow, 200);
});

