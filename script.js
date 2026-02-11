// DOM Elements
const stages = {
    first: document.getElementById('stage-1'),
    second: document.getElementById('stage-2'),
    third: document.getElementById('stage-3'),
    final: document.getElementById('stage-4'),
    message: document.getElementById('stage-5')
};

const buttons = {
    btn1: document.getElementById('btn-1'),
    btn2: document.getElementById('btn-2'),
    btn3: document.getElementById('btn-3'),
    btn4: document.getElementById('btn-4')
};

// Transition Logic
function switchSection(hideSection, showSection) {
    if (!hideSection || !showSection) return;

    hideSection.classList.remove('active');
    hideSection.style.opacity = '0';

    setTimeout(() => {
        hideSection.classList.add('hidden');
        showSection.classList.remove('hidden');

        // Reflow
        void showSection.offsetWidth;

        showSection.style.opacity = '1';
        showSection.classList.add('active');
    }, 800);
}

// Event Listeners
buttons.btn1.addEventListener('click', () => {
    switchSection(stages.first, stages.second);
});

buttons.btn2.addEventListener('click', () => {
    switchSection(stages.second, stages.third);
});


buttons.btn3.addEventListener('click', () => {
    switchSection(stages.third, stages.final);
    // Balloons still active in stage 4 (paper reveal) as per user request flow? 
    // Actually user said "remove moving animation" for final page. 
    // We will keep balloons for paper reveal, but stop them for final message.
});

buttons.btn4.addEventListener('click', () => {
    switchSection(stages.final, stages.message);
    // Stop balloons now
    document.getElementById('balloon-container').style.display = 'none';
    // Start confetti
    setTimeout(startConfetti, 500);
});


// Confetti Logic
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confettiParticles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function startConfetti() {
    for (let i = 0; i < 200; i++) {
        confettiParticles.push(createParticle());
    }
    animateConfetti();
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 90%, 75%)`,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 5 - 2.5
    };
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
    });

    requestAnimationFrame(animateConfetti);
}

// Generate Simple CSS Balloons
function createBalloons() {
    const container = document.getElementById('balloon-container');
    const colors = ['#FFC0CB', '#E6E6FA', '#FFD700', '#ADD8E6'];

    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.animationDuration = `${Math.random() * 10 + 10}s`;
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.opacity = Math.random() * 0.4 + 0.2; // Translucent
        container.appendChild(balloon);
    }
}

// Playful "No" Button Logic
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('btn-3');

const noTexts = [
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Don't be rude!",
    "Just click Yes!",
    "I'll be sad...",
    "Last chance!",
    "Okay fine..."
];

let clickCount = 0;

noBtn.addEventListener('click', (e) => {
    // Prevent meaningful click, just trigger the playfulness
    e.preventDefault();
    moveButton();
});

noBtn.addEventListener('mouseover', () => {
    // Also move on hover for desktop annoy-factor (playful)
    moveButton();
});

function moveButton() {
    clickCount++;

    // 1. Change Text
    if (clickCount < noTexts.length) {
        noBtn.innerText = noTexts[clickCount];
    } else {
        noBtn.innerText = "Okay fine... 🙈";
        noBtn.style.display = 'none'; // Give up eventually
    }

    // 2. Make Yes Button Bigger
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    const currentPadding = parseFloat(window.getComputedStyle(yesBtn).paddingTop);

    yesBtn.style.fontSize = `${currentSize * 1.2}px`;
    yesBtn.style.padding = `${currentPadding * 1.2}px ${currentPadding * 2.5}px`;

    // 3. Move No Button Randomly
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
}

// Initial Balloon Start
createBalloons();
