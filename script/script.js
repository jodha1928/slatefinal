function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.content-container').forEach(c => c.style.display = 'none');
    const tabIndex = tabName === 'borrow' ? 1 : 2;
    document.querySelector(`.tab-container .tab:nth-child(${tabIndex})`).classList.add('active');
    document.getElementById(tabName).style.display = 'flex';
}

const sidebarItems = document.querySelectorAll('.sidebar-item');

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
    });

    const actionButtons = item.querySelectorAll('.action-item');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            actionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});


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