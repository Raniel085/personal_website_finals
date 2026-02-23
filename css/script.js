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

// Guestbook Functionality — powered by Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const guestbookForm = document.getElementById('guestbookForm');
const guestbookEntries = document.getElementById('guestbookEntries');

// Load guestbook entries from Supabase
async function loadGuestbookEntries() {
    guestbookEntries.innerHTML = '<p style="opacity:0.6">Loading...</p>';

    const { data, error } = await supabaseClient
        .from('guestbook')
        .select('name, message, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading guestbook:', error);
        guestbookEntries.innerHTML = '<p style="color:red">Failed to load entries.</p>';
        return;
    }

    guestbookEntries.innerHTML = '';
    if (!data.length) {
        guestbookEntries.innerHTML = '<p style="opacity:0.6">No entries yet. Be the first!</p>';
        return;
    }

    data.forEach(entry => {
        const date = new Date(entry.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
        const entryDiv = document.createElement('div');
        entryDiv.className = 'guestbook-entry';
        entryDiv.innerHTML = `
            <strong>${entry.name}</strong>
            <em>${date}</em>
            <p>${entry.message}</p>
        `;
        guestbookEntries.appendChild(entryDiv);
    });
}

// Handle guestbook form submission
guestbookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('visitorName').value.trim();
    const message = document.getElementById('visitorMessage').value.trim();
    const submitBtn = guestbookForm.querySelector('.btn-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const { error } = await supabaseClient
        .from('guestbook')
        .insert([{ name, message }]);

    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign Guestbook';

    if (error) {
        console.error('Error submitting entry:', error);
        alert('Failed to submit. Please try again.');
        return;
    }

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
    { title: 'Kalapastangan', artist: 'fitterkarma',       url: 'audio/fitterkarma - Kalapastangan (Lyrics).mp3', spotifyUrl: 'https://open.spotify.com/track/1udOOSbJnytCdgvbgYOF5s' },
    { title: 'Always',        artist: 'Daniel Caesar',      url: 'audio/Daniel Caesar - Always (Lyrics).mp3',       spotifyUrl: 'https://open.spotify.com/track/2LlOeW5rVcvl3QcPNPcDus' },
    { title: 'Saglit',        artist: 'Avidra feat. bleep', url: 'audio/Saglit.mp3',                                spotifyUrl: 'https://open.spotify.com/album/2G5Ehp6kqdH5z4sGVCC8yY'  }
];

let currentTrackIndex = 0;
let isPlaying = false;

const audioPlayer    = document.getElementById('audioPlayer');
const playPauseBtn   = document.getElementById('playPauseBtn');
const progressBar    = document.getElementById('progressBar');
const progressFill   = document.getElementById('progressFill');
const timeCurrent    = document.getElementById('timeCurrent');
const timeTotal      = document.getElementById('timeTotal');
const currentTrackTitle  = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const spotifyLink    = document.getElementById('spotifyLink');
const playlistItems  = document.querySelectorAll('.playlist-item');

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
    currentTrackTitle.textContent  = track.title;
    currentTrackArtist.textContent = track.artist;
    spotifyLink.href = track.spotifyUrl;
    playlistItems.forEach((item, i) => item.classList.toggle('active', i === index));
    if (isPlaying) audioPlayer.play();
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

if (audioPlayer && playPauseBtn) {
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
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            isPlaying = true;
            loadTrack(index);
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
    });

    loadTrack(0);
}

// Initial generate after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // small timeout to ensure layout settled
    setTimeout(generateSnow, 200);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

