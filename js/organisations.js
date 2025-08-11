/*
Copyright (C) 2025  PalindromicBreadLoaf (herbthehaircut@proton.me)

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
let allOrganisations = [];
let currentOrganisations = [];
let filteredOrganisations = [];

let currentPage = 1;
let pageSize = 9; // Number of orgs per page

function initOrganisationsPage() {
    setupEventListeners();

    const searchTerm = getURLParameter('search');
    const category = document.getElementById('categoryFilter').value;

    if (searchTerm) {
        document.getElementById('orgSearch').value = searchTerm;
        performSearch();
    } else {
        fetch('http://localhost:3000/api/organisations')
            .then(res => res.json())
            .then(data => {
                allOrganisations = data;
                currentOrganisations = [...allOrganisations];
                filteredOrganisations = [...data];
                applySorting();
                currentPage = 1;
                renderOrganisations();
                updateResultsCount();
            })
            .catch(err => {
                console.error('Error loading organisations:', err);
                showNotification('Failed to load organisations from server', 'error');
            });
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('orgSearch');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    categoryFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);
}

function performSearch() {
    const searchTerm = document.getElementById('orgSearch').value.toLowerCase().trim();
    const category = document.getElementById('categoryFilter').value;

    const url = new URL('http://localhost:3000/api/organisations/search');
    url.searchParams.append('q', searchTerm);
    url.searchParams.append('category', category);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            filteredOrganisations = data;
            currentOrganisations = [...data];
            applySorting();
            currentPage = 1;
            renderOrganisations();
            updateResultsCount();
        })
        .catch(err => {
            console.error('Search failed:', err);
            showNotification('Search failed', 'error');
        });
}

function applyFilters() {
    performSearch();
}

function applySorting() {
    const sortBy = document.getElementById('sortBy').value;

    switch(sortBy) {
        case 'name':
            filteredOrganisations.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'members':
            filteredOrganisations.sort((a, b) => b.members - a.members);
            break;
        case 'newest':
            filteredOrganisations.sort((a, b) => parseInt(b.founded) - parseInt(a.founded));
            break;
        case 'active':
            filteredOrganisations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
            break;
    }
}

function renderOrganisations() {
    const grid = document.getElementById('organisationsGrid');
    const noResults = document.getElementById('noResults');

    if (filteredOrganisations.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        document.getElementById('paginationControls').innerHTML = '';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredOrganisations.slice(start, end);

    grid.innerHTML = pageData.map(org => createOrganisationsCard(org)).join('');

    updatePaginationControls();
}

function createOrganisationsCard(org) {
    const categoryColors = {
        'academic': 'var(--secondary-teal)',
        'cultural': 'var(--secondary-coral)',
        'recreational': 'var(--primary-orange)',
        'service': 'var(--secondary-peach)',
        'professional': 'var(--primary-brown)',
        'religious': 'var(--secondary-dark-teal)',
        'sports': 'var(--primary-orange)',
        'arts': 'var(--secondary-coral)'
    };

    const categoryColor = categoryColors[org.category] || 'var(--medium-gray)';

    return `
        <div class="org-card card" onclick="viewOrganisations(${org.id})">
            <div class="org-card-header">
                <h3>${org.name}</h3>
                <span class="org-category" style="background-color: ${categoryColor}">
                    ${org.category.charAt(0).toUpperCase() + org.category.slice(1)}
                </span>
            </div>
            <p class="org-description">${org.description}</p>
            <div class="org-meta">
                <div class="org-stats">
                    <span class="org-members">👥 ${org.members} members</span>
                    <span class="org-founded">📅 Founded ${org.founded}</span>
                </div>
                <div class="org-meeting">
                    <strong>Meets:</strong> ${org.meetingTime}<br>
                    <strong>Location:</strong> ${org.location}
                </div>
            </div>
            <div class="org-tags">
                ${org.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
            <div class="org-actions">
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); joinOrganisations(${org.id})">
                    Join Organisation
                </button>
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewOrganisations(${org.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const count = currentOrganisations.length;
    const total = allOrganisations.length;
    const resultsCount = document.getElementById('resultsCount');

    if (count === total) {
        resultsCount.textContent = `Showing all ${total} organisations`;
    } else {
        resultsCount.textContent = `Showing ${count} of ${total} organisations`;
    }
}

function updatePaginationControls() {
    const totalPages = Math.ceil(filteredOrganisations.length / pageSize);
    const pagination = document.getElementById('paginationControls');

    pagination.innerHTML = `
        <button class="btn btn-secondary" onclick="prevPage()" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
        <span style="margin: 0 10px;">Page ${currentPage} of ${totalPages}</span>
        <button class="btn btn-secondary" onclick="nextPage()" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
}

function nextPage() {
    const totalPages = Math.ceil(filteredOrganisations.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderOrganisations();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderOrganisations();
    }
}

function clearFilters() {
    document.getElementById('orgSearch').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'name';

    fetch('http://localhost:3000/api/organisations')
        .then(res => res.json())
        .then(data => {
            currentOrganisations = data;
            filteredOrganisations = [...data];
            applySorting();
            currentPage = 1;
            renderOrganisations();
            updateResultsCount();
        })
        .catch(err => {
            console.error('Error reloading organisations:', err);
            showNotification('Could not reload organisations', 'error');
        });
}

function viewOrganisations(id) {
    showNotification(`Viewing organisations details for ID: ${id}. I didn't feel like it yet`, 'info');
}

function joinOrganisations(id) {
    const org = currentOrganisations.find(o => o.id === id);
    if (org) {
        // TODO: Don't just blatantly lie
        showNotification(`Join request sent to ${org.name}! You'll be notified when approved.`, 'success');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initOrganisationsPage();
});

// Override init function
window.initorganisationsPage = initOrganisationsPage;