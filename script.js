// DOM Elements
const stages = {
    first: document.getElementById('stage-1'),
    second: document.getElementById('stage-2'),
    third: document.getElementById('stage-3'),
    final: document.getElementById('stage-4')
};

const buttons = {
    btn1: document.getElementById('btn-1'),
    btn2: document.getElementById('btn-2'),
    btn3: document.getElementById('btn-3')
};

// State Management
function switchSection(hideSection, showSection) {
    // 1. Hide current section
    hideSection.classList.remove('active');
    hideSection.classList.add('hidden'); // Use hidden class to remove from layout if needed, but opacity handles visual

    // 2. Wait a tiny bit (for CSS transition) then show next
    setTimeout(() => {
        showSection.classList.remove('hidden');
        // Trigger reflow for animation to work
        void showSection.offsetWidth;
        showSection.classList.add('active');
    }, 100); // Short delay for smooth feel
}

// Event Listeners

// 1. Start Button -> To Photo 1
buttons.btn1.addEventListener('click', () => {
    switchSection(stages.first, stages.second);
});

// 2. See Next -> To Photo 2
buttons.btn2.addEventListener('click', () => {
    switchSection(stages.second, stages.third);
});

// 3. One Last Thing -> To Final Paper Reveal
buttons.btn3.addEventListener('click', () => {
    switchSection(stages.third, stages.final);
    // Start confetti when final section appears
    setTimeout(startConfetti, 500);
});


// Confetti Logic (Simple Canvas Implementation)
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
        y: Math.random() * canvas.height - canvas.height, // Start above screen
        size: Math.random() * 5 + 5,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`,
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5
    };
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX; // Add slight drift
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
            // Reset to top to keep it raining gentle
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
