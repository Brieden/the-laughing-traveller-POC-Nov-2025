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
    console.log('initLocationGreeting started');
    const greetingText = document.querySelector('#location-greeting .greeting-text');
    if (!greetingText) {
        console.error('Greeting text element not found');
        return;
    }

    try {
        console.log('Fetching location...');
        // Fetch location data
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Location data received:', data);

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

        console.log('Selected joke:', joke);

        // Update the greeting text
        greetingText.textContent = `"${joke}"`;

    } catch (error) {
        console.error('Error fetching location:', error);
        greetingText.textContent = `"I can't see where you are, but I smell sauerkraut."`;
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
