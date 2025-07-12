function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-container').forEach(c => c.style.display = 'none');
    const tabIndex = tabName === 'borrow' ? 1 : 2;
    document.querySelector(`.tab-container .tab:nth-child(${tabIndex})`).classList.add('active');
    document.getElementById(tabName).style.display = 'flex';
}

const playbackConst = 200;
const setHeight = document.getElementById("set-height");
const vid = document.getElementById('scrollVideo');
const contentDiv = document.querySelector('#borrow');
const sidebarItems = document.querySelectorAll('#borrow .sidebar-item');

let isUsingWindowScroll = false;

vid.addEventListener('loadedmetadata', () => {
    // Set scroll height to drive video duration
    const scrollLength = Math.floor(vid.duration) * playbackConst;
    setHeight.style.height = `${scrollLength}px`;

    // Detect if scroll is on window or contentDiv
    const hasOverflowScroll = getComputedStyle(contentDiv).overflowY === 'auto' || getComputedStyle(contentDiv).overflowY === 'scroll';
    isUsingWindowScroll = !hasOverflowScroll;
});

function scrollPlay() {
    // Decide scroll source
    const scrollTop = isUsingWindowScroll ? window.scrollY : contentDiv.scrollTop;

    // Sync video playback
    const frameNumber = scrollTop / playbackConst;
    vid.currentTime = frameNumber;

    // Sync sidebar item active class
    toggleActiveItem(scrollTop);

    requestAnimationFrame(scrollPlay);
}

function toggleActiveItem(scrollTop) {
    const height = setHeight.offsetHeight;
    const totalItems = sidebarItems.length;
    const itemHeight = height / totalItems;

    sidebarItems.forEach((item, i) => {
        const start = i * itemHeight;
        const end = (i + 1) * itemHeight;
        item.classList.toggle('active', scrollTop >= start && scrollTop < end);
    });
}

requestAnimationFrame(scrollPlay);