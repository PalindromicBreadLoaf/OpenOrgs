/*
Copyright (C) 2025 PalindromicBreadLoaf

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

function initSearch() {

    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            if (searchTerm.trim()) {
                // An API? Now why would I use that?
                window.location.href = `organizations.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initMobileNav() {
    // TODO: Nav stuff and mobile friendliness (even though mobile users don't deserve friendliness
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545'; // Red is bad, yeah?
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

function showLoading(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoading(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    switch(type) {
        case 'success':
            notification.style.backgroundColor = 'var(--secondary-teal)';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = 'var(--primary-orange)';
            break;
        default:
            notification.style.backgroundColor = 'var(--medium-gray)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initSmoothScrolling();
    initMobileNav();

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch(currentPage) {
        case 'index.html':
        case '':
            break;
        case 'organizations.html':
            initOrganizationsPage();
            break;
        case 'events.html':
            initEventsPage();
            break;
        case 'login.html':
        case 'signup.html':
            initAuthPage();
            break;
    }
});

function initOrganizationsPage() {
    const searchTerm = getURLParameter('search');
    if (searchTerm) {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = searchTerm;
        }
        // TODO: Don't just lie.
        console.log(`Searching for: ${searchTerm}`);
    }
}

function initEventsPage() {
    console.log('Events page initialized');
}

function initAuthPage() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                showLoading(this);
                // TODO: Form Submission Logic and such things
                setTimeout(() => {
                    hideLoading(this);
                    showNotification('Will get to eventually :?', 'info');
                }, 1000);
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        });
    });
}