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

// Append preloading videos to bodyasdas
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


fetch('./header.html') // Ensure the path to header.html is correct
    .then(res => {
        if (!res.ok) {
            throw new Error(`Failed to fetch header.html: ${res.status} ${res.statusText}`);
        }
        return res.text();
    })
    .then(data => {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = data;
        } else {
            console.error('Element with ID "header-placeholder" not found.');
        }
    })
    .catch(err => console.error('Error loading header:', err));