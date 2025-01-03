// script.js
class CounterAnimation {
    constructor(options = {}) {
        // Konfigurasi default
        this.duration = options.duration || 2000;
        this.easingName = options.easing || 'easeOutExpo';
        this.autoStart = options.autoStart ?? true;
        
        // Fungsi easing
        this.easingFunctions = {
            linear: t => t,
            easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
            easeOutBounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            },
            easeOutCubic: t => 1 - Math.pow(1 - t, 3)
        };

        // Data counter
        this.counters = [
            { 
                target: 943, 
                element: document.querySelector('.profile-card__info > div:nth-child(1) > div:first-child'),
                current: 0
            },
            { 
                target: 83, 
                element: document.querySelector('.profile-card__info > div:nth-child(2) > div:first-child'),
                current: 0
            },
            { 
                target: 46, 
                element: document.querySelector('.profile-card__info > div:nth-child(3) > div:first-child'),
                current: 0
            }
        ];

        // Inisialisasi state
        this.isAnimating = false;
        this.startTime = null;
        this.animationFrame = null;

        // Bind methods
        this.animate = this.animate.bind(this);
        this.start = this.start.bind(this);
        this.pause = this.pause.bind(this);
        this.reset = this.reset.bind(this);

        // Auto start jika diminta
        if (this.autoStart) {
            document.addEventListener('DOMContentLoaded', this.start);
        }

        // Tambahkan trigger scroll
        this.setupScrollTrigger();
    }

    animate(currentTime) {
        if (!this.startTime) this.startTime = currentTime;
        
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Aplikasikan easing
        const easedProgress = this.easingFunctions[this.easingName](progress);

        // Update semua counter
        this.counters.forEach(counter => {
            const currentValue = Math.round(easedProgress * counter.target);
            counter.element.textContent = currentValue;
            counter.current = currentValue;
        });

        // Lanjutkan animasi jika belum selesai
        if (progress < 1) {
            this.animationFrame = requestAnimationFrame(this.animate);
        } else {
            this.isAnimating = false;
        }
    }

    start() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.startTime = null;
            this.animationFrame = requestAnimationFrame(this.animate);
        }
    }

    pause() {
        if (this.isAnimating) {
            cancelAnimationFrame(this.animationFrame);
            this.isAnimating = false;
        }
    }

    reset() {
        this.pause();
        this.counters.forEach(counter => {
            counter.current = 0;
            counter.element.textContent = '0';
        });
        this.start();
    }

    setupScrollTrigger() {
        // Tambahkan observer untuk memulai animasi saat elemen terlihat
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.start();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe elemen parent dari counter
        const parentElement = document.querySelector('.profile-card__info');
        if (parentElement) {
            observer.observe(parentElement);
        }
    }

    // Method untuk mengubah durasi
    setDuration(newDuration) {
        this.duration = newDuration;
        this.reset();
    }

    // Method untuk mengubah easing
    setEasing(newEasing) {
        if (this.easingFunctions[newEasing]) {
            this.easingName = newEasing;
            this.reset();
        }
    }
}

// Inisialisasi counter dengan konfigurasi
const counterAnimation = new CounterAnimation({
    duration: 2000,          // Durasi 2 detik
    easing: 'easeOutExpo',   // Efek easing
    autoStart: false         // Tidak autostart, gunakan scroll trigger
});


// Tambahkan ke script.js

// Dark Mode Toggle
function initDarkMode() {
    const body = document.body;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        body.classList.add('dark-mode');
    }
    
    // Bisa ditambahkan tombol toggle jika diinginkan
}

// Smooth scroll untuk link internal
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Portfolio item hover effect
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    // Your existing CounterAnimation initialization
});

// Tambahkan kontrol untuk testing
// Uncomment baris berikut jika ingin menambahkan tombol kontrol
/*
const controls = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
        <button onclick="counterAnimation.start()">Start</button>
        <button onclick="counterAnimation.pause()">Pause</button>
        <button onclick="counterAnimation.reset()">Reset</button>
        <select onchange="counterAnimation.setEasing(this.value)">
            <option value="linear">Linear</option>
            <option value="easeOutExpo" selected>Expo</option>
            <option value="easeOutBounce">Bounce</option>
            <option value="easeOutCubic">Cubic</option>
        </select>
        <input type="range" min="500" max="5000" value="2000" 
            onchange="counterAnimation.setDuration(parseInt(this.value))"
        >
    </div>
`;
document.body.insertAdjacentHTML('beforeend', controls);
*/