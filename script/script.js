function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-container').forEach(c => c.style.display = 'none');
    const tabIndex = tabName === 'borrow' ? 1 : 2;
    document.querySelector(`.tab-container .tab:nth-child(${tabIndex})`).classList.add('active');
    document.getElementById(tabName).style.display = 'flex';
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const playbackConst = isMobile ? 100 : 200;

const setHeight = document.getElementById("set-height");
const vid = document.getElementById('scrollVideo');
const contentDiv = document.querySelector('#borrow');
const sidebarItems = document.querySelectorAll('#borrow .sidebar-item');

let targetTime = 0;

vid.addEventListener('loadedmetadata', () => {
    const totalScrollHeight = Math.floor(vid.duration * playbackConst);
    setHeight.style.height = `${totalScrollHeight}px`;
});

let ticking = false;

contentDiv.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollTop = contentDiv.scrollTop;
            targetTime = scrollTop / playbackConst;

            toggleActiveItem(scrollTop);
            ticking = false;
        });
        ticking = true;
    }
});

// Smooth interpolation of video currentTime
function animateVideo() {
    if (Math.abs(vid.currentTime - targetTime) > 0.01) {
        vid.currentTime += (targetTime - vid.currentTime) * 0.1;
    }
    requestAnimationFrame(animateVideo);
}
animateVideo();

function toggleActiveItem(scrollTop) {
    const height = setHeight.offsetHeight;
    const totalItems = sidebarItems.length;
    const itemHeight = height / totalItems;

    let activeIndex = -1;

    sidebarItems.forEach((item, i) => {
        const isActive = scrollTop >= i * itemHeight && scrollTop < (i + 1) * itemHeight;
        item.classList.toggle('active', isActive);
        if (isActive) activeIndex = i;
    });

    sidebarItems.forEach((item, i) => {
        item.classList.toggle('previous', i < activeIndex);
    });
}