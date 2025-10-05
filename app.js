// Concord Motors Website - Professional Automotive Diagnostics
// Advanced functionality for automotive engineering website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all website functionality
    initNavigation();
    initDiagnosticForm();
    initInteractiveElements();
    initScrollEffects();
});

// Navigation and Smooth Scrolling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNav(this);
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', handleNavScroll);
}

function updateActiveNav(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
    });
    
    activeLink.style.color = 'var(--color-teal-300)';
    activeLink.style.background = 'rgba(var(--color-teal-300-rgb), 0.1)';
}

function handleNavScroll() {
    const sections = document.querySelectorAll('section, footer');
    const navLinks = document.querySelectorAll('.nav__link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = '#' + section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        
        if (link.getAttribute('href') === currentSection) {
            link.style.color = 'var(--color-teal-300)';
            link.style.background = 'rgba(var(--color-teal-300-rgb), 0.1)';
        }
    });
}

// Diagnostic Form Handling
function initDiagnosticForm() {
    const diagnosticForm = document.querySelector('.diagnostic-form');
    
    if (diagnosticForm) {
        diagnosticForm.addEventListener('submit', handleFormSubmission);
        
        // Add real-time DTC validation
        const dtcInput = diagnosticForm.querySelector('input[placeholder*="P0XXX"]');
        if (dtcInput) {
            dtcInput.addEventListener('input', validateDTCInput);
        }
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const vehicleInfo = formData.get('vehicle') || e.target.querySelector('input[placeholder*="Year"]').value;
    const dtcCodes = formData.get('dtc') || e.target.querySelector('input[placeholder*="P0XXX"]').value;
    const symptoms = formData.get('symptoms') || e.target.querySelector('textarea').value;
    
    // Create diagnostic summary
    const diagnosticSummary = {
        vehicle: vehicleInfo,
        codes: dtcCodes,
        symptoms: symptoms,
        timestamp: new Date().toLocaleString(),
        priority: calculatePriority(dtcCodes)
    };
    
    // Show confirmation message
    showDiagnosticConfirmation(diagnosticSummary);
    
    // Reset form
    e.target.reset();
}

function validateDTCInput(e) {
    const input = e.target;
    const value = input.value.toUpperCase();
    
    // Basic DTC pattern validation (P0XXX, C0XXX, B0XXX, U0XXX)
    const dtcPattern = /^[PCBU]\d{4}$/;
    const codes = value.split(',').map(code => code.trim());
    
    let isValid = true;
    codes.forEach(code => {
        if (code && !dtcPattern.test(code)) {
            isValid = false;
        }
    });
    
    // Visual feedback
    if (isValid || !value) {
        input.style.borderColor = 'var(--color-border)';
    } else {
        input.style.borderColor = 'var(--color-error)';
    }
    
    input.value = value; // Keep uppercase
}

function calculatePriority(dtcCodes) {
    if (!dtcCodes) return 'Standard';
    
    const codes = dtcCodes.split(',').map(code => code.trim());
    
    // Critical codes
    const criticalCodes = ['U0100', 'U0101', 'C0561', 'P0601'];
    // High priority codes
    const highPriorityCodes = ['P0420', 'P0300', 'C0710'];
    
    for (let code of codes) {
        if (criticalCodes.includes(code)) return 'Critical';
        if (highPriorityCodes.includes(code)) return 'High Priority';
    }
    
    return 'Standard';
}

function showDiagnosticConfirmation(summary) {
    // Create modal-like confirmation
    const modal = document.createElement('div');
    modal.className = 'diagnostic-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Diagnostic Request Submitted</h3>
            <div class="diagnostic-summary">
                <div class="summary-item">
                    <span class="summary-label">Vehicle:</span>
                    <span class="summary-value">${summary.vehicle || 'Not specified'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Diagnostic Codes:</span>
                    <span class="summary-value">${summary.codes || 'None provided'}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Priority Level:</span>
                    <span class="summary-value priority-${summary.priority.toLowerCase().replace(' ', '-')}">${summary.priority}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Timestamp:</span>
                    <span class="summary-value">${summary.timestamp}</span>
                </div>
            </div>
            <p class="confirmation-message">Our ASE certified technicians will contact you within 24 hours to schedule your diagnostic appointment.</p>
            <button class="btn btn--primary close-modal">Close</button>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        .diagnostic-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: var(--color-surface);
            padding: var(--space-32);
            border-radius: var(--radius-lg);
            max-width: 500px;
            width: 90%;
            box-shadow: var(--shadow-lg);
        }
        
        .modal-content h3 {
            color: var(--color-primary);
            margin-bottom: var(--space-20);
            text-align: center;
        }
        
        .diagnostic-summary {
            margin-bottom: var(--space-20);
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: var(--space-8);
            padding: var(--space-8);
            background: var(--color-bg-1);
            border-radius: var(--radius-sm);
        }
        
        .summary-label {
            font-weight: var(--font-weight-semibold);
            color: var(--color-text);
        }
        
        .summary-value {
            color: var(--color-text-secondary);
            font-family: var(--font-family-mono);
        }
        
        .priority-critical { color: var(--color-error); font-weight: bold; }
        .priority-high-priority { color: var(--color-warning); font-weight: bold; }
        .priority-standard { color: var(--color-success); }
        
        .confirmation-message {
            text-align: center;
            color: var(--color-text-secondary);
            margin-bottom: var(--space-20);
        }
        
        .close-modal {
            width: 100%;
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(styleSheet);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        }
    });
}

// Interactive Elements
function initInteractiveElements() {
    // Service cards hover effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-sm)';
        });
    });
    
    // DTC code interactions
    const dtcItems = document.querySelectorAll('.dtc-item');
    dtcItems.forEach(item => {
        item.addEventListener('click', function() {
            const code = this.querySelector('.dtc-code').textContent;
            const description = this.querySelector('.dtc-desc').textContent;
            showDTCDetails(code, description);
        });
        
        // Add cursor pointer style
        item.style.cursor = 'pointer';
    });
    
    // Equipment cards expansion
    const equipmentCards = document.querySelectorAll('.equipment-card');
    equipmentCards.forEach(card => {
        card.addEventListener('click', function() {
            toggleEquipmentDetails(this);
        });
        
        card.style.cursor = 'pointer';
    });
}

function showDTCDetails(code, description) {
    // Create detailed DTC information popup
    const dtcDetails = {
        'P0101': {
            system: 'Engine Management',
            component: 'Mass Airflow Sensor',
            causes: ['Dirty/faulty MAF sensor', 'Air intake leaks', 'Clogged air filter'],
            diagnostic: 'Check MAF sensor voltage, inspect air intake system'
        },
        'P0420': {
            system: 'Emissions',
            component: 'Catalytic Converter',
            causes: ['Catalyst efficiency below threshold', 'O2 sensor malfunction', 'Engine misfires'],
            diagnostic: 'Test catalyst efficiency, check O2 sensor operation'
        },
        'C0561': {
            system: 'Chassis/ABS',
            component: 'ABS Control Module',
            causes: ['ABS system disabled', 'Wheel speed sensor fault', 'Hydraulic issues'],
            diagnostic: 'Scan ABS module, test wheel sensors, check brake fluid'
        },
        'U0100': {
            system: 'Network Communication',
            component: 'ECM/PCM',
            causes: ['CAN bus communication loss', 'Wiring issues', 'Module failure'],
            diagnostic: 'Check CAN bus integrity, test module communication'
        }
    };
    
    const details = dtcDetails[code] || {
        system: 'Unknown System',
        component: 'Unknown Component',
        causes: ['Requires professional diagnosis'],
        diagnostic: 'Contact certified technician for detailed analysis'
    };
    
    alert(`DTC: ${code}\nSystem: ${details.system}\nComponent: ${details.component}\n\nCommon Causes:\n• ${details.causes.join('\n• ')}\n\nDiagnostic Procedure:\n${details.diagnostic}`);
}

function toggleEquipmentDetails(card) {
    const existingDetails = card.querySelector('.equipment-details');
    
    if (existingDetails) {
        existingDetails.remove();
    } else {
        const title = card.querySelector('.equipment-card__title').textContent;
        const details = createEquipmentDetails(title);
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'equipment-details';
        detailsDiv.innerHTML = details;
        
        card.appendChild(detailsDiv);
    }
}

function createEquipmentDetails(equipmentName) {
    const equipmentSpecs = {
        'Professional OBD2 Scanner': `
            <div class="equipment-detail">
                <h4>Advanced Features:</h4>
                <ul>
                    <li>Real-time data streaming</li>
                    <li>Bi-directional control capabilities</li>
                    <li>Freeze frame data capture</li>
                    <li>Component activation testing</li>
                    <li>Multi-language support</li>
                </ul>
            </div>
        `,
        'Automotive Oscilloscope': `
            <div class="equipment-detail">
                <h4>Measurement Capabilities:</h4>
                <ul>
                    <li>CAN High/Low signal analysis</li>
                    <li>Ignition waveform capture</li>
                    <li>Fuel injector pulse width</li>
                    <li>Sensor voltage patterns</li>
                    <li>Communication protocol decoding</li>
                </ul>
            </div>
        `,
        'Digital Multimeter': `
            <div class="equipment-detail">
                <h4>Precision Measurements:</h4>
                <ul>
                    <li>Voltage: ±0.01V accuracy</li>
                    <li>Current: µA to 10A range</li>
                    <li>Resistance: 0.1Ω to 100MΩ</li>
                    <li>Frequency: 0.01Hz to 1MHz</li>
                    <li>Temperature: -40°C to 1000°C</li>
                </ul>
            </div>
        `
    };
    
    return equipmentSpecs[equipmentName] || '<p>Advanced diagnostic capabilities available.</p>';
}

// Scroll Effects
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards, capabilities, and equipment
    const animatedElements = document.querySelectorAll('.service-card, .capability, .equipment-card, .dtc-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Console message for developers
console.log('🔧 Concord Motors - Professional Automotive Diagnostics System Loaded');
console.log('📊 Advanced diagnostic capabilities initialized');
console.log('⚙️ For technical support: concordmotors@gmail.com');