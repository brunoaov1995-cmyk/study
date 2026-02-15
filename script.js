// Global state
let studiedCards = new Set();
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    renderCards(flashcardsData);
    setupEventListeners();
    updateStats();
});

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);
}

// Render cards
function renderCards(cards) {
    const grid = document.getElementById('cardsGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.innerHTML = '';
    
    if (cards.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        grid.appendChild(cardElement);
    });
    
    updateStats();
}

// Create card element
function createCardElement(card) {
    const isStudied = studiedCards.has(card.id);
    
    const cardDiv = document.createElement('div');
    cardDiv.className = `flashcard ${isStudied ? 'studied' : ''}`;
    cardDiv.setAttribute('data-id', card.id);
    cardDiv.setAttribute('tabindex', '0');
    cardDiv.setAttribute('role', 'button');
    cardDiv.setAttribute('aria-label', `Flashcard ${card.id}`);
    
    cardDiv.innerHTML = `
        <div class="flashcard-inner">
            <div class="flashcard-front">
                <span class="card-category">${getCategoryName(card.category)}</span>
                <span class="card-number">#${card.id}</span>
                <div class="card-question">${card.question}</div>
                <span class="flip-indicator">🔄</span>
            </div>
            <div class="flashcard-back">
                ${isStudied ? '<span class="studied-badge">✅ Estudiada</span>' : ''}
                <div class="card-answer">
                    <p><strong>Respuesta:</strong></p>
                    <p>${card.answer}</p>
                    ${card.example ? `<hr style="margin: 15px 0; border: 1px solid var(--border-color);">
                    <p><strong>Ejemplo Didáctico:</strong></p>
                    <p style="white-space: pre-wrap;">${card.example}</p>` : ''}
                </div>
                <span class="flip-indicator">🔄</span>
            </div>
        </div>
    `;
    
    // Add click event
    cardDiv.addEventListener('click', () => flipCard(cardDiv, card.id));
    
    // Add keyboard support
    cardDiv.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard(cardDiv, card.id);
        }
    });
    
    return cardDiv;
}

// Flip card
function flipCard(cardElement, cardId) {
    cardElement.classList.toggle('flipped');
    
    // Mark as studied after flipping
    if (!studiedCards.has(cardId)) {
        setTimeout(() => {
            studiedCards.add(cardId);
            updateStats();
            
            // Add studied badge if card is still flipped
            if (cardElement.classList.contains('flipped')) {
                const backSide = cardElement.querySelector('.flashcard-back');
                if (!backSide.querySelector('.studied-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'studied-badge';
                    badge.textContent = '✅ Estudiada';
                    backSide.insertBefore(badge, backSide.firstChild);
                }
            }
        }, 300);
    }
}

// Get category name
function getCategoryName(category) {
    const names = {
        'backend': '.NET',
        'architecture': 'Clean Arch',
        'frontend': 'Frontend',
        'ml': 'ML'
    };
    return names[category] || category;
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = filterCards(searchTerm, currentFilter);
    renderCards(filtered);
}

// Handle category filter
function handleCategoryFilter(e) {
    currentFilter = e.target.value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = filterCards(searchTerm, currentFilter);
    renderCards(filtered);
}

// Filter cards
function filterCards(searchTerm, category) {
    let filtered = flashcardsData;
    
    // Filter by category
    if (category !== 'all') {
        filtered = filtered.filter(card => card.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(card => 
            card.question.toLowerCase().includes(searchTerm) ||
            card.answer.toLowerCase().includes(searchTerm) ||
            (card.example && card.example.toLowerCase().includes(searchTerm))
        );
    }
    
    return filtered;
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    currentFilter = 'all';
    renderCards(flashcardsData);
}

// Update stats
function updateStats() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = filterCards(searchTerm, currentFilter);
    
    document.getElementById('totalCards').textContent = flashcardsData.length;
    document.getElementById('visibleCards').textContent = filtered.length;
    document.getElementById('studiedCards').textContent = studiedCards.size;
}

// Theme management
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.theme-icon');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterCards, getCategoryName };
}
