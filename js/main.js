import { locationJokes } from './jokes_data.js';

document.addEventListener('DOMContentLoaded', () => {
    initLocationGreeting();
    initSmoothScroll();
    initSoundboard();
});

/**
 * 1. Location-Based Greeting (Sverdi)
 * Fetches user's location via ipapi.co and displays a custom joke.
 */
async function initLocationGreeting() {
    const speechBubble = document.querySelector('#sverdi-avatar .speech-bubble p');
    if (!speechBubble) return;

    try {
        // Fetch location data
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const country = data.country_name;
        const region = data.region; // e.g., "Bavaria" or "California"
        const city = data.city;

        console.log(`Detected Location: ${city}, ${region}, ${country}`);

        let joke = locationJokes.default;

        // Logic: City -> Region -> Country -> Default
        if (locationJokes[country]) {
            if (typeof locationJokes[country] === 'string') {
                // Simple string for country
                joke = locationJokes[country];
            } else {
                // Object with cities/regions
                const countryJokes = locationJokes[country];

                if (countryJokes[city]) {
                    joke = countryJokes[city];
                } else if (countryJokes[region]) {
                    joke = countryJokes[region];
                } else if (countryJokes.default) {
                    joke = countryJokes.default;
                }
            }
        }

        // Update the speech bubble
        speechBubble.textContent = `"${joke}"`;

    } catch (error) {
        console.error('Error fetching location:', error);
        speechBubble.textContent = `"I can't see where you are, but I smell sauerkraut."`;
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

function initSoundboard() {
    const buttons = document.querySelectorAll('.sound-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const soundFile = btn.getAttribute('data-sound');
            if (soundFile) {
                const audio = new Audio(soundFile);
                audio.play();

                // Add visual feedback
                btn.classList.add('playing');
                audio.onended = () => btn.classList.remove('playing');
            }
        });
    });
}
