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
console.log(sidebarItems);


vid.addEventListener('loadedmetadata', () => {
    setHeight.style.height = `${Math.floor(vid.duration) * playbackConst}px`;
});

function scrollPlay() {
    let frameNumber = contentDiv.scrollTop / playbackConst;
    vid.currentTime = frameNumber;
    toggleActiveItem(contentDiv.scrollTop);
    requestAnimationFrame(scrollPlay);
}

function toggleActiveItem(scrollTop) {
    const height = setHeight.offsetHeight;
    const totalItems = sidebarItems.length;
    const itemHeight = height / totalItems;

    sidebarItems.forEach((item, i) => {
        item.classList.toggle('active', scrollTop >= i * itemHeight && scrollTop < (i + 1) * itemHeight);
    });
}

requestAnimationFrame(scrollPlay);
