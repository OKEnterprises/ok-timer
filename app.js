// OK Timer - Timer Management Application

const STORAGE_KEY = 'ok-timers';
let timers = [];
let updateInterval = null;

// ========================================
// Data Management
// ========================================

function loadTimers() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading timers from localStorage:', error);
        return [];
    }
}

function saveTimers(timersToSave) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timersToSave));
    } catch (error) {
        console.error('Error saving timers to localStorage:', error);
        alert('Failed to save timer. Storage may be full.');
    }
}

function addTimer(title, date) {
    const timer = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        date: date || new Date().toISOString()
    };

    timers.push(timer);
    saveTimers(timers);
    return timer;
}

function deleteTimer(id) {
    timers = timers.filter(timer => timer.id !== id);
    saveTimers(timers);
}

function resetTimer(id) {
    const timer = timers.find(t => t.id === id);
    if (timer) {
        timer.date = new Date().toISOString();
        saveTimers(timers);
        updateTimerDisplay(id);

        // Also update the date display
        const card = document.querySelector(`[data-timer-id="${id}"]`);
        if (card) {
            const dateElement = card.querySelector('.timer-date');
            dateElement.textContent = formatDate(timer.date);
        }
    }
}

// ========================================
// Timer Calculations
// ========================================

function calculateDuration(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now;
    const isPast = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);

    const seconds = Math.floor(absDiffMs / 1000) % 60;
    const minutes = Math.floor(absDiffMs / (1000 * 60)) % 60;
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60)) % 24;
    const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, isPast };
}

function formatDuration(duration) {
    const parts = [];

    if (duration.days > 0) {
        parts.push(`${duration.days}d`);
    }
    if (duration.hours > 0 || duration.days > 0) {
        parts.push(`${duration.hours}h`);
    }
    if (duration.minutes > 0 || duration.hours > 0 || duration.days > 0) {
        parts.push(`${duration.minutes}m`);
    }
    parts.push(`${duration.seconds}s`);

    return parts.join(' ');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// ========================================
// Display & Update
// ========================================

function createTimerCard(timer) {
    const card = document.createElement('div');
    card.className = 'timer-card';
    card.dataset.timerId = timer.id;

    const duration = calculateDuration(timer.date);
    const durationText = formatDuration(duration);
    const displayClass = duration.isPast ? 'countup' : 'countdown';
    const suffix = duration.isPast ? ' ago' : '';

    card.innerHTML = `
        <div class="timer-header">
            <div class="timer-title">${escapeHtml(timer.title)}</div>
            <div class="timer-actions">
                <button class="btn-delete" onclick="handleDeleteTimer('${timer.id}')">×</button>
                <button class="btn-reset" onclick="handleResetTimer('${timer.id}')" title="Reset to current time">↻</button>
            </div>
        </div>
        <div class="timer-display ${displayClass}">
            ${durationText}${suffix}
        </div>
        <div class="timer-date">
            ${formatDate(timer.date)}
        </div>
    `;

    return card;
}

function renderTimers() {
    const container = document.getElementById('timers-container');

    if (timers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-text">press + to begin</div>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    timers.forEach(timer => {
        const card = createTimerCard(timer);
        container.appendChild(card);
    });
}

function updateTimerDisplay(timerId) {
    const card = document.querySelector(`[data-timer-id="${timerId}"]`);
    if (!card) return;

    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    const duration = calculateDuration(timer.date);
    const durationText = formatDuration(duration);
    const displayClass = duration.isPast ? 'countup' : 'countdown';
    const suffix = duration.isPast ? ' ago' : '';

    const displayElement = card.querySelector('.timer-display');
    displayElement.className = `timer-display ${displayClass}`;
    displayElement.textContent = `${durationText}${suffix}`;
}

function startTimerUpdates() {
    // Clear any existing interval
    if (updateInterval) {
        clearInterval(updateInterval);
    }

    // Update all timers every second
    updateInterval = setInterval(() => {
        timers.forEach(timer => {
            updateTimerDisplay(timer.id);
        });
    }, 1000);
}

// ========================================
// Event Handlers
// ========================================

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const titleInput = form.elements.title;
    const dateInput = form.elements.date;

    const title = titleInput.value;
    const date = dateInput.value || null;

    if (!title.trim()) {
        return;
    }

    addTimer(title, date);
    renderTimers();
    startTimerUpdates();

    // Reset form and close overlay
    form.reset();
    closeFormOverlay();
}

function handleDeleteTimer(id) {
    deleteTimer(id);
    renderTimers();

    // Stop updates if no timers left
    if (timers.length === 0 && updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function handleResetTimer(id) {
    resetTimer(id);
}

function openFormOverlay() {
    const overlay = document.getElementById('timer-form-overlay');
    overlay.classList.add('active');
    // Focus title input after animation
    setTimeout(() => {
        document.getElementById('title').focus();
    }, 100);
}

function closeFormOverlay() {
    const overlay = document.getElementById('timer-form-overlay');
    overlay.classList.remove('active');
}

// ========================================
// Utilities
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Initialization
// ========================================

function init() {
    // Load timers from localStorage
    timers = loadTimers();

    // Render initial timers
    renderTimers();

    // Start updates if we have timers
    if (timers.length > 0) {
        startTimerUpdates();
    }

    // Setup event handlers
    const form = document.getElementById('timer-form');
    const newTimerBtn = document.getElementById('new-timer-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const overlay = document.getElementById('timer-form-overlay');

    form.addEventListener('submit', handleFormSubmit);
    newTimerBtn.addEventListener('click', openFormOverlay);
    cancelBtn.addEventListener('click', closeFormOverlay);

    // Close overlay on background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeFormOverlay();
        }
    });

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeFormOverlay();
        }
    });
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
