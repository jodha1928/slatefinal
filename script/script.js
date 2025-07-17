function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-container').forEach(c => c.style.display = 'none');
    const tabIndex = tabName === 'borrow' ? 1 : 2;
    document.querySelector(`.tab-container .tab:nth-child(${tabIndex})`).classList.add('active');
    document.getElementById(tabName).style.display = 'flex';
}

// Collect all unique video sources
const videoSources = new Set();

document.querySelectorAll('[data-video]').forEach(el => {
    const src = el.getAttribute('data-video');
    if (src) videoSources.add(src);
});

// Create hidden preloading container
const preloadContainer = document.createElement('div');
preloadContainer.style.display = 'none';

// Create video elements for each source
videoSources.forEach(src => {
    const video = document.createElement('video');
    video.src = src;
    video.preload = 'auto';
    preloadContainer.appendChild(video);
});

// Append preloading videos to body
document.body.appendChild(preloadContainer);

function setupSidebarVideoSync(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sidebarItems = container.querySelectorAll('.sidebar-item');
    const videoPlayer = container.querySelector('video');

    sidebarItems.forEach(item => {
        const header = item.querySelector('.sec-head');

        // Click on .sec-head
        header.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Remove active from all items in this container only
            sidebarItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            let videoSrc;

            if (item.getAttribute('data-index') === "1") {
                // Use currently active button inside item
                const activeButton = item.querySelector('.action-item.active');
                videoSrc = activeButton.getAttribute('data-video');
            } else {
                videoSrc = header.getAttribute('data-video');
            }

            if (videoSrc && videoPlayer) {
                videoPlayer.src = videoSrc;
                videoPlayer.play();
            }
        });

        // Click on action-item buttons
        const actionButtons = item.querySelectorAll('.action-item');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Remove active from all buttons in this section
                actionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const videoSrc = btn.getAttribute('data-video');
                if (videoSrc && videoPlayer) {
                    videoPlayer.src = videoSrc;
                    videoPlayer.play();
                }
            });
        });
    });
}

// Initialize both tabs
setupSidebarVideoSync('borrow');
setupSidebarVideoSync('earn');


// const playbackConst = 200;
// const setHeight = document.getElementById("set-height");
// const vid = document.getElementById('scrollVideo');
// const contentDiv = document.querySelector('#borrow');
// const sidebarItems = document.querySelectorAll('#borrow .sidebar-item');

// vid.addEventListener('loadedmetadata', () => {
//     const totalScrollHeight = Math.floor(vid.duration * playbackConst);
//     setHeight.style.height = `${totalScrollHeight}px`;
// });

// let ticking = false;

// contentDiv.addEventListener('scroll', () => {
//     if (!ticking) {
//         requestAnimationFrame(() => {
//             const scrollTop = contentDiv.scrollTop;
//             const frameNumber = scrollTop / playbackConst;

//             // Avoid unnecessary seeking for smoother video
//             if (Math.abs(vid.currentTime - frameNumber) > 0.03) {
//                 vid.currentTime = frameNumber;
//             }

//             toggleActiveItem(scrollTop);
//             ticking = false;
//         });
//         ticking = true;
//     }
// });

// function toggleActiveItem(scrollTop) {
//     const height = setHeight.offsetHeight;
//     const totalItems = sidebarItems.length;
//     const itemHeight = height / totalItems;

//     let activeIndex = -1;

//     sidebarItems.forEach((item, i) => {
//         const isActive = scrollTop >= i * itemHeight && scrollTop < (i + 1) * itemHeight;
//         item.classList.toggle('active', isActive);
//         if (isActive) activeIndex = i;
//     });

//     sidebarItems.forEach((item, i) => {
//         item.classList.toggle('previous', i < activeIndex);
//     });
// }