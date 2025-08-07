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

// Garbage organisations data (will be replaced with database calls)
const sampleorganisations = [
    {
        id: 1,
        name: "Computer Science Society",
        description: "A community for computer science students to learn, collaborate, and network with industry professionals.",
        category: "academic",
        members: 156,
        founded: "2018",
        contactEmail: "cs.society@university.edu",
        meetingTime: "Wednesdays 6:00 PM",
        location: "Engineering Building Room 201",
        tags: ["programming", "career development"],
        isActive: true,
        lastActivity: "2025-01-15"
    },
    {
        id: 2,
        name: "Cultural Dance Ensemble",
        description: "Celebrating diversity through traditional and modern dance performances from around the world.",
        category: "cultural",
        members: 34,
        founded: "2020",
        contactEmail: "dance@university.edu",
        meetingTime: "Tuesdays & Thursdays 7:00 PM",
        location: "Student Center Dance Studio",
        tags: ["dance", "culture", "performance"],
        isActive: true,
        lastActivity: "2025-01-12"
    },
    {
        id: 3,
        name: "Environmental Action Club",
        description: "Working together to promote sustainability and environmental awareness on campus and beyond.",
        category: "service",
        members: 89,
        founded: "2017",
        contactEmail: "green@university.edu",
        meetingTime: "Mondays 5:30 PM",
        location: "Science Building Room 105",
        tags: ["environment", "sustainability", "activism"],
        isActive: true,
        lastActivity: "2025-01-10"
    },
    {
        id: 4,
        name: "Photography Club",
        description: "Capture the world through your lens. Learn techniques, share your work, and explore photography together.",
        category: "arts",
        members: 67,
        founded: "2019",
        contactEmail: "photo@university.edu",
        meetingTime: "Saturdays 2:00 PM",
        location: "Arts Building Studio 3",
        tags: ["photography", "art", "creativity"],
        isActive: true,
        lastActivity: "2025-01-08"
    },
    {
        id: 5,
        name: "Business Leaders Association",
        description: "Developing future business leaders through networking, mentorship, and professional development opportunities.",
        category: "professional",
        members: 124,
        founded: "2016",
        contactEmail: "business@university.edu",
        meetingTime: "Fridays 4:00 PM",
        location: "Business Building Conference Room",
        tags: ["business", "leadership", "networking"],
        isActive: true,
        lastActivity: "2025-01-14"
    },
    {
        id: 6,
        name: "Ultimate Frisbee Club",
        description: "Fun, competitive ultimate frisbee for all skill levels. Join us for practices, tournaments, and good times!",
        category: "recreational",
        members: 43,
        founded: "2021",
        contactEmail: "frisbee@university.edu",
        meetingTime: "Tuesdays & Sundays 3:00 PM",
        location: "Campus Recreation Fields",
        tags: ["sports", "fitness", "competition"],
        isActive: true,
        lastActivity: "2025-01-11"
    },
    {
        id: 7,
        name: "Debate Society",
        description: "Sharpen your critical thinking and public speaking skills through structured debates and competitions.",
        category: "academic",
        members: 28,
        founded: "2019",
        contactEmail: "debate@university.edu",
        meetingTime: "Thursdays 6:30 PM",
        location: "Library Conference Room B",
        tags: ["debate", "public speaking", "critical thinking"],
        isActive: true,
        lastActivity: "2025-01-09"
    },
    {
        id: 8,
        name: "International Won't Shut Up Association",
        description: "Who can talk the longest? Find out here!.",
        category: "cultural",
        members: 92,
        founded: "2015",
        contactEmail: "international@university.edu",
        meetingTime: "Wednesdays 7:00 PM",
        location: "International Center",
        tags: ["international", "culture", "support"],
        isActive: true,
        lastActivity: "2025-01-13"
    }
];

let currentorganisations = [...sampleorganisations];
let filteredorganisations = [...sampleorganisations];

function initorganisationsPage() {
    renderorganisations();
    setupEventListeners();

    const searchTerm = getURLParameter('search');
    if (searchTerm) {
        document.getElementById('orgSearch').value = searchTerm;
        performSearch();
    }

    updateResultsCount();
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

    filteredorganisations = sampleorganisations.filter(org => {
        const matchesSearch = !searchTerm ||
            org.name.toLowerCase().includes(searchTerm) ||
            org.description.toLowerCase().includes(searchTerm) ||
            org.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = !category || org.category === category;

        return matchesSearch && matchesCategory;
    });

    applySorting();
    renderorganisations();
    updateResultsCount();
}

// Yeah, I good programmer
function applyFilters() {
    performSearch();
}

function applySorting() {
    const sortBy = document.getElementById('sortBy').value;

    switch(sortBy) {
        case 'name':
            filteredorganisations.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'members':
            filteredorganisations.sort((a, b) => b.members - a.members);
            break;
        case 'newest':
            filteredorganisations.sort((a, b) => parseInt(b.founded) - parseInt(a.founded));
            break;
        case 'active':
            filteredorganisations.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
            break;
    }
}

function renderorganisations() {
    const grid = document.getElementById('organisationsGrid');
    const noResults = document.getElementById('noResults');

    if (filteredorganisations.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    grid.innerHTML = filteredorganisations.map(org => createOrganisationsCard(org)).join('');
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
                    Join Organisations
                </button>
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewOrganisations(${org.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
}

function updateResultsCount() {
    const count = filteredorganisations.length;
    const total = sampleorganisations.length;
    const resultsCount = document.getElementById('resultsCount');

    if (count === total) {
        resultsCount.textContent = `Showing all ${total} organisations`;
    } else {
        resultsCount.textContent = `Showing ${count} of ${total} organisations`;
    }
}

function clearFilters() {
    document.getElementById('orgSearch').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('sortBy').value = 'name';

    filteredorganisations = [...sampleorganisations];
    applySorting();
    renderorganisations();
    updateResultsCount();
}

// Still a placeholder
function viewOrganisations(id) {
    showNotification(`Viewing organisations details for ID: ${id}. I didn't feel like it yet`, 'info');
}

// Join organisations (also a placeholder)
function joinOrganisations(id) {
    const org = sampleorganisations.find(o => o.id === id);
    if (org) {
        showNotification(`Join request sent to ${org.name}! You'll be notified when approved.`, 'success');
        // TODO: Make API call to join organisations
    }
}

// Override the initorganisationsPage function from scripts.js
window.initorganisationsPage = initorganisationsPage;

document.addEventListener("DOMContentLoaded", () => {
    initorganisationsPage();
});