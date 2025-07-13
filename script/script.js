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

vid.addEventListener('loadedmetadata', () => {
    const totalScrollHeight = Math.floor(vid.duration * playbackConst);
    setHeight.style.height = `${totalScrollHeight}px`;
    if (isMobileDevice()) {
        contentDiv.addEventListener('scroll', scrollPlay);

    } else {
        requestAnimationFrame(scrollPlay)

    }
});

let ticking = false;

let lastScrollTop = 0;

function isMobileDevice() {
    return /Mobile|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent) || window.innerWidth < 768;
}
function scrollPlay() {
    const scrollTop = contentDiv.scrollTop;

    // Only sync window scroll direction with contentDiv on mobile devices
    if (isMobileDevice()) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            window.scrollBy({ top: 50, behavior: 'smooth' });
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up
            window.scrollBy({ top: -50, behavior: 'smooth' });
        }
    }
    lastScrollTop = scrollTop;

    if (!ticking) {
        requestAnimationFrame(() => {
            const frameNumber = scrollTop / playbackConst;

            // Avoid unnecessary seeking for smoother video
            if (Math.abs(vid.currentTime - frameNumber) > 0.03) {
                vid.currentTime = frameNumber;
            }

            toggleActiveItem(scrollTop);
            ticking = false;
        });
        ticking = true;
    }
    requestAnimationFrame(scrollPlay)
};

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