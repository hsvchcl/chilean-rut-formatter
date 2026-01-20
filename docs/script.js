/**
 * Chilean RUT Formatter - Landing Page Scripts
 */

// ========================================
// RUT Functions (fallback if CDN fails)
// ========================================

function cleanRut(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/[^0-9kK]/g, '').toUpperCase();
}

function calculateVerificationDigit(rutBody) {
    if (!/^\d+$/.test(rutBody)) return '';
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = rutBody.length - 1; i >= 0; i--) {
        sum += parseInt(rutBody[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = 11 - (sum % 11);
    
    if (remainder === 11) return '0';
    if (remainder === 10) return 'K';
    return String(remainder);
}

function isValidRut(rut) {
    const cleaned = cleanRut(rut);
    if (cleaned.length < 2) return false;
    
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    if (!/^\d+$/.test(body)) return false;
    
    const calculatedDv = calculateVerificationDigit(body);
    return calculatedDv === dv;
}

function formatRut(rut, options = {}) {
    const { dots = true, dash = true, uppercase = true } = options;
    const cleaned = cleanRut(rut);
    
    if (cleaned.length < 2) return '';
    if (!isValidRut(cleaned)) return '';
    
    const body = cleaned.slice(0, -1);
    let dv = cleaned.slice(-1);
    
    if (!uppercase) dv = dv.toLowerCase();
    
    let formatted = '';
    
    if (dots) {
        const reversed = body.split('').reverse();
        const groups = [];
        for (let i = 0; i < reversed.length; i += 3) {
            groups.push(reversed.slice(i, i + 3).reverse().join(''));
        }
        formatted = groups.reverse().join('.');
    } else {
        formatted = body;
    }
    
    return dash ? `${formatted}-${dv}` : `${formatted}${dv}`;
}

// ========================================
// DOM Elements
// ========================================

const rutInput = document.getElementById('rut-input');
const validationResult = document.getElementById('validation-result');
const formattedResult = document.getElementById('formatted-result');
const cleanResult = document.getElementById('clean-result');
const dvResult = document.getElementById('dv-result');
const exampleBtns = document.querySelectorAll('.example-btn');
const copyBtns = document.querySelectorAll('.copy-btn');
const codeTabs = document.querySelectorAll('.code-tab');
const codePanels = document.querySelectorAll('.code-panel');

// ========================================
// Demo Functionality
// ========================================

function updateResults(value) {
    const cleaned = cleanRut(value);
    
    // Clean result
    cleanResult.textContent = cleaned || '-';
    
    if (cleaned.length < 2) {
        validationResult.textContent = '-';
        validationResult.className = 'result-value';
        formattedResult.textContent = '-';
        dvResult.textContent = '-';
        return;
    }
    
    // Validation
    const isValid = isValidRut(cleaned);
    validationResult.textContent = isValid ? '✓ Válido' : '✗ Inválido';
    validationResult.className = `result-value ${isValid ? 'valid' : 'invalid'}`;
    
    // Formatted
    const formatted = formatRut(cleaned);
    formattedResult.textContent = formatted || '-';
    
    // Verification digit
    const body = cleaned.slice(0, -1);
    if (/^\d+$/.test(body)) {
        const dv = calculateVerificationDigit(body);
        const inputDv = cleaned.slice(-1);
        dvResult.textContent = dv;
        if (dv !== inputDv) {
            dvResult.textContent += ` (ingresado: ${inputDv})`;
        }
    } else {
        dvResult.textContent = '-';
    }
}

// Input event
if (rutInput) {
    rutInput.addEventListener('input', (e) => {
        updateResults(e.target.value);
    });
}

// Example buttons
exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const rut = btn.dataset.rut;
        rutInput.value = rut;
        updateResults(rut);
        rutInput.focus();
    });
});

// ========================================
// Copy to Clipboard
// ========================================

copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        
        try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            
            // Change icon to checkmark
            const originalSvg = btn.innerHTML;
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
            
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = originalSvg;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// ========================================
// Code Tabs
// ========================================

codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update tabs
        codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update panels
        codePanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === `panel-${targetTab}`) {
                panel.classList.add('active');
            }
        });
    });
});

// ========================================
// Smooth Scroll for Nav Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate feature cards
document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.6s ease ${i * 0.1}s`;
    observer.observe(card);
});

// Animate result cards
document.querySelectorAll('.result-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.6s ease ${i * 0.1}s`;
    observer.observe(card);
});

console.log('🇨🇱 Chilean RUT Formatter - Landing Page Loaded');
