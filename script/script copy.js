function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-container').forEach(c => c.style.display = 'none');

    document.querySelector(`.tab-container .tab:nth-child(${tabName === 'borrow' ? 1 : 2})`).classList.add('active');
    document.getElementById(tabName).style.display = 'flex';
}


const video = document.getElementById('scrollVideo');
const items = document.querySelectorAll('.sidebar-item');
const totalSteps = 5;
const stepDuration = 6;
let currentStep = 0;
let isAnimating = false;
let animationActivated = false; // prevent early scroll action

video.pause();
video.currentTime = 0;

// Activate list item
function activateItem(index) {
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

// Ease function
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Smooth video scrub
function animateScrub(start, end, duration = 3000, onMid, onComplete) {
    const startTime = performance.now();
    let midDone = false;

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = easeInOutQuad(t);
        video.currentTime = start + (end - start) * eased;

        // Midpoint activation (e.g. 40% of animation done)
        if (!midDone && t >= 0.4) {
            midDone = true;
            if (onMid) onMid();
        }

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            if (onComplete) onComplete();
        }
    }

    requestAnimationFrame(step);
}


// Go to step logic
function goToStep(step) {
    if (!animationActivated || isAnimating || step < 0 || step >= totalSteps) return;

    isAnimating = true;
    const from = video.currentTime;
    const to = step * stepDuration;
    currentStep = step;

    animateScrub(
        from,
        to,
        stepDuration * 1000,
        () => activateItem(currentStep), // Mid-point callback
        () => { isAnimating = false; } // Final callback
    );
}

// Lock scroll sensitivity
let scrollLocked = false;
window.addEventListener('wheel', (e) => {
    if (!animationActivated || scrollLocked || isAnimating) return;

    scrollLocked = true;
    const direction = e.deltaY > 0 ? 1 : -1;
    goToStep(currentStep + direction);

    setTimeout(() => {
        scrollLocked = false;
    }, 400);
});

window.addEventListener('keydown', (e) => {
    if (!animationActivated) return;
    if (e.key === 'ArrowDown') goToStep(currentStep + 1);
    if (e.key === 'ArrowUp') goToStep(currentStep - 1);
});

// Touch for mobile
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});
window.addEventListener('touchend', (e) => {
    if (!animationActivated) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
        const direction = diff > 0 ? 1 : -1;
        goToStep(currentStep + direction);
    }
});


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio === 1) {
            animationActivated = true;
        }
    });
}, {
    threshold: 1.0 // fully visible
});

// Start observing
const targetSection = document.querySelector('.content-container');
if (targetSection) {
    observer.observe(targetSection);
}

window.addEventListener('wheel', (e) => {
    if (!animationActivated || isAnimating) return;

    const direction = e.deltaY > 0 ? 1 : -1;

    // Trap scroll if we are not at boundaries
    if ((direction === -1 && currentStep > 0) || (direction === 1 && currentStep < totalSteps - 1)) {
        e.preventDefault(); // Block default scroll
        goToStep(currentStep + direction);
    } else if (direction === -1 && currentStep === 0) {
        // Let page scroll up beyond .content-container
        animationActivated = false; // Optional: re-lock animation if user scrolls up
    }
}, { passive: false }); // <- Important to allow e.preventDefault()