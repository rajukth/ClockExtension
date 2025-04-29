// Create clockWrapper
const clockWrapper = document.createElement('div');
clockWrapper.className = 'clockWrapper';
clockWrapper.id = 'clockWrapper';
document.body.appendChild(clockWrapper);

// Create floatingWrapper
const floatingWrapper = document.createElement('div');
floatingWrapper.className = 'floatingWrapper';
floatingWrapper.id = 'draggableDiv';
clockWrapper.appendChild(floatingWrapper);

const savedPosition = JSON.parse(localStorage.getItem('clockPosition'));
if (savedPosition) {
    clockWrapper.style.top = savedPosition.top;
    clockWrapper.style.bottom = 'auto';

    if (savedPosition.right !== undefined) {
        clockWrapper.style.right = savedPosition.right;
        clockWrapper.style.left = 'auto';
        floatingWrapper.classList.add('direction-right');
    } else {
        clockWrapper.style.left = savedPosition.left;
        clockWrapper.style.right = 'auto';
        floatingWrapper.classList.remove('direction-right');
    }
}

// Create clockIcon
const clockIcon = document.createElement('div');
clockIcon.id = 'clockIcon';
clockIcon.className = 'clock clockRounded border-1';
clockIcon.textContent = '🕰️';
floatingWrapper.appendChild(clockIcon);

// Create dateTime
const dateTime = document.createElement('div');
dateTime.id = 'dateTime';
dateTime.className = 'date-time clockRounded border-1';
dateTime.textContent = 'Loading date...';
floatingWrapper.appendChild(dateTime);

const dragHandle = document.getElementById('draggableDiv');

let isVisible = false;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let dragStartX = 0;
let dragStartY = 0;
let dragged = false;

function updateDateTime() {
    const now = new Date();
    const time = getNepaliTime ? getNepaliTime() : now.toLocaleTimeString(); // fallback
    const bsDate = convertEnglishDateToNepali
        ? convertEnglishDateToNepali(now.getFullYear(), now.getMonth() + 1, now.getDate())
        : [now.getFullYear(), now.toLocaleDateString()];
    const nepaliDate = `${bsDate[1]}`;
    dateTime.innerHTML = `${nepaliDate} | <b>${time}</b>`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

clockIcon.addEventListener('click', () => {
    if (!dragged) {
        isVisible = !isVisible;
        dateTime.classList.toggle('show', isVisible);
        clockIcon.textContent = isVisible ? '✖' : '🕰️';
    }
    dragged = false;
});

dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragged = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = clockWrapper.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = 'none';
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = 'auto';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = Math.abs(e.clientX - dragStartX);
        const dy = Math.abs(e.clientY - dragStartY);
        if (dx > 5 || dy > 5) dragged = true;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const newLeft = e.clientX - offsetX;
        const newTop = e.clientY - offsetY;

        const maxLeft = screenWidth - clockWrapper.offsetWidth;
        const maxTop = screenHeight - clockWrapper.offsetHeight;

        const clampedLeft = Math.max(0, Math.min(newLeft, maxLeft));
        const clampedTop = Math.max(0, Math.min(newTop, maxTop));

        clockWrapper.style.top = `${clampedTop}px`;
        clockWrapper.style.bottom = 'auto';

        const mid = screenWidth / 2;

        if (e.clientX > mid) {
            // From the right side
            const fromRight = screenWidth - (clampedLeft + 25); // 25 = half clock width
            clockWrapper.style.left = 'auto';
            clockWrapper.style.right = `${fromRight}px`;
            floatingWrapper.classList.add('direction-right');
        } else {
            // From the left side
            clockWrapper.style.left = `${clampedLeft}px`;
            clockWrapper.style.right = 'auto';
            floatingWrapper.classList.remove('direction-right');
        }
        saveClockPosition();
    }
});

// Save position
function saveClockPosition() {
    const style = window.getComputedStyle(clockWrapper);
    const data = {
        top: style.top
    };

    if (floatingWrapper.classList.contains('direction-right')) {
        data.right = style.right;
    } else {
        data.left = style.left;
    }

    localStorage.setItem('clockPosition', JSON.stringify(data));
}