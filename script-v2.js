// Global state
let studiedCards = new Set();
let currentFilter = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    renderCards(flashcardsData);
    setupEventListeners();
    updateStats();
    setupModalHandlers();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('categoryFilter').addEventListener('change', handleCategoryFilter);
}

// Setup modal handlers
function setupModalHandlers() {
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('exampleModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
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
    
    const hasCodeExample = card.codeExample && card.codeExample.trim();
    const hasSimpleExplanation = card.simpleExplanation && card.simpleExplanation.trim();
    
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
                </div>
                <div class="card-actions">
                    ${hasCodeExample ? `
                        <button class="example-btn" onclick="showCodeExample(event, ${card.id})">
                            💻 Ver Código
                        </button>
                    ` : ''}
                    ${hasSimpleExplanation ? `
                        <button class="example-btn" onclick="showSimpleExplanation(event, ${card.id})">
                            💡 Explicación Simple
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Add click event for flip (only on non-button areas)
    cardDiv.addEventListener('click', (e) => {
        // Don't flip if clicking on buttons
        if (!e.target.closest('.example-btn') && !e.target.closest('.card-actions')) {
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

// Show code example in modal
function showCodeExample(event, cardId) {
    event.stopPropagation(); // Prevent card flip
    const card = flashcardsData.find(c => c.id === cardId);
    if (!card || !card.codeExample) return;
    
    const modal = document.getElementById('exampleModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.innerHTML = '💻 Ejemplo de Código';
    body.innerHTML = `
        <h3>${card.question}</h3>
        <pre><code>${escapeHtml(card.codeExample)}</code></pre>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Show simple explanation in modal
function showSimpleExplanation(event, cardId) {
    event.stopPropagation(); // Prevent card flip
    const card = flashcardsData.find(c => c.id === cardId);
    if (!card || !card.simpleExplanation) return;
    
    const modal = document.getElementById('exampleModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.innerHTML = '💡 Explicación Didáctica';
    
    // Convert line breaks to paragraphs
    const paragraphs = card.simpleExplanation
        .split('\n\n')
        .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    body.innerHTML = `
        <h3>${card.question}</h3>
        <div class="simple-explanation">
            ${paragraphs}
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('exampleModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Escape HTML for code display
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    
    if (category !== 'all') {
        filtered = filtered.filter(card => card.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(card => 
            card.question.toLowerCase().includes(searchTerm) ||
            card.answer.toLowerCase().includes(searchTerm) ||
            (card.codeExample && card.codeExample.toLowerCase().includes(searchTerm)) ||
            (card.simpleExplanation && card.simpleExplanation.toLowerCase().includes(searchTerm))
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
    
    const icon = document.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('.theme-icon');
    icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}
