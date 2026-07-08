const API = 'https://property-finder-nia8.onrender.com/api';
const token = localStorage.getItem('token');
const headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };

// ─── Section Switch ───────────────────────────────────────────────
function switchSection(secId, navElement) {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById('sec-' + secId).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
}

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadTenants();
    loadOwners();
    loadProperties();
    loadBookings();
    loadReviews();
});

// ─── Stats ────────────────────────────────────────────────────────
async function loadStats() {
    const [tenants, owners, properties, bookings] = await Promise.all([
        fetch(`${API}/tenants`, { headers }).then(r => r.json()),
        fetch(`${API}/owners`, { headers }).then(r => r.json()),
        fetch(`${API}/properties`, { headers }).then(r => r.json()),
        fetch(`${API}/bookings`, { headers }).then(r => r.json())
    ]);
    document.getElementById('stat-users').textContent = tenants.length;
    document.getElementById('stat-owners').textContent = owners.length;
    document.getElementById('stat-properties').textContent = properties.length;
    const revenue = bookings.filter(b => b.status === 'Verified').length * 15000;
    document.getElementById('stat-revenue').textContent = '₹' + revenue.toLocaleString('en-IN');
}

// ─── Tenants ──────────────────────────────────────────────────────
let tenantsData = [];

async function loadTenants() {
    const res = await fetch(`${API}/tenants`, { headers });
    tenantsData = await res.json();
    const tbody = document.getElementById('tenant-table-body');
    tbody.innerHTML = '';
    tenantsData.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="display:flex;align-items:center;gap:0.8rem;">
                <img src="${t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50'}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
                ${t.name || 'N/A'}
            </td>
            <td>${t.email || 'N/A'}</td>
            <td>${t.phone || 'N/A'}</td>
            <td>${t.isBlocked ? '<span class="badge blocked">Blocked</span>' : (t.isVerified ? '<span class="badge active">Verified</span>' : '<span class="badge pending">Pending</span>')}</td>
            <td>
                <button class="action-btn" onclick="openTenantModal('${t._id}')">View</button>
                <button class="action-btn danger" onclick="blockTenant('${t._id}', ${t.isBlocked})">${t.isBlocked ? 'Unblock' : 'Block'}</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

async function openTenantModal(id) {
    const t = tenantsData.find(x => x._id === id);
    if (!t) return;
    document.getElementById('tenant-modal-body').innerHTML = `
        <div style="display:flex;align-items:center;gap:1rem;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:1rem;">
            <img src="${t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60'}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
            <div><h4 style="margin:0;">${t.name}</h4><span style="color:var(--text-muted);">${t.occupation || ''}</span></div>
        </div>
        <div><strong>Email:</strong> ${t.email}</div>
        <div><strong>Phone:</strong> ${t.phone || 'N/A'}</div>
        <div><strong>Address:</strong> ${t.address || 'N/A'}</div>
        <div><strong>Salary:</strong> ${t.salary ? '₹' + t.salary : 'N/A'}</div>
        <div><strong>Status:</strong> ${t.isVerified ? '<span style="color:var(--success-color)">Verified</span>' : '<span style="color:var(--warning-color)">Pending</span>'}</div>`;
    const btn = document.getElementById('btn-approve-tenant');
    btn.style.display = t.isVerified ? 'none' : 'block';
    btn.onclick = () => approveTenant(t._id);
    document.getElementById('tenant-modal').classList.remove('hidden');
}

async function approveTenant(id) {
    await fetch(`${API}/tenant/${id}`, { method: 'PUT', headers, body: JSON.stringify({ isVerified: true }) });
    alert('Tenant verified!');
    closeTenantModal();
    loadTenants();
}

async function blockTenant(id, isBlocked) {
    if (!confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this tenant?`)) return;
    await fetch(`${API}/tenant/${id}`, { method: 'PUT', headers, body: JSON.stringify({ isBlocked: !isBlocked }) });
    loadTenants();
    loadStats();
}

function closeTenantModal() {
    document.getElementById('tenant-modal').classList.add('hidden');
}

// ─── Owners ───────────────────────────────────────────────────────
let ownersData = [];

async function loadOwners() {
    const res = await fetch(`${API}/owners`, { headers });
    ownersData = await res.json();
    const tbody = document.getElementById('owner-table-body');
    tbody.innerHTML = '';
    ownersData.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="display:flex;align-items:center;gap:0.8rem;">
                <img src="${o.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50'}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;">
                ${o.name || 'N/A'}
            </td>
            <td>${o.email || 'N/A'}</td>
            <td>—</td>
            <td>${o.isBlocked ? '<span class="badge blocked">Blocked</span>' : (o.isVerified ? '<span class="badge active">Verified</span>' : '<span class="badge pending">Pending</span>')}</td>
            <td>
                <button class="action-btn" onclick="openOwnerModal('${o._id}')">View</button>
                <button class="action-btn danger" onclick="blockOwner('${o._id}', ${o.isBlocked})">${o.isBlocked ? 'Unblock' : 'Block'}</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

async function openOwnerModal(id) {
    const o = ownersData.find(x => x._id === id);
    if (!o) return;
    document.getElementById('owner-modal-title').textContent = o.name + "'s Profile";
    document.getElementById('owner-modal-body').innerHTML = `
        <div style="display:flex;gap:1rem;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:1rem;">
            <img src="${o.profileImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60'}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">
            <div>
                <h4 style="margin:0;">${o.name}</h4>
                <p style="margin:0;color:var(--text-muted);">${o.email}</p>
                ${!o.isVerified ? `<button class="action-btn success" style="margin-top:0.5rem;" onclick="approveOwner('${o._id}')">Approve Owner</button>` : '<span class="badge active">Verified</span>'}
            </div>
        </div>
        <div><strong>Occupation:</strong> ${o.occupation || 'N/A'}</div>
        <div><strong>Address:</strong> ${o.address || 'N/A'}</div>`;
    document.getElementById('owner-modal').classList.remove('hidden');
}

async function approveOwner(id) {
    await fetch(`${API}/owner/${id}`, { method: 'PUT', headers, body: JSON.stringify({ isVerified: true }) });
    alert('Owner verified!');
    closeOwnerModal();
    loadOwners();
}

async function blockOwner(id, isBlocked) {
    if (!confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this owner?`)) return;
    await fetch(`${API}/owner/${id}`, { method: 'PUT', headers, body: JSON.stringify({ isBlocked: !isBlocked }) });
    loadOwners();
    loadStats();
}

function closeOwnerModal() {
    document.getElementById('owner-modal').classList.add('hidden');
}

// ─── Properties ───────────────────────────────────────────────────
let propertiesData = [];

async function loadProperties() {
    const res = await fetch(`${API}/properties`, { headers });
    propertiesData = await res.json();
    renderAdminProperties(propertiesData);
}

function renderAdminProperties(list) {
    const tbody = document.getElementById('property-table-body');
    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No properties found.</td></tr>';
        return;
    }
    list.forEach(p => {
        const status = (p.approvalStatus || 'pending').toLowerCase();
        const badge = status === 'active' ? '<span class="badge active">Active</span>' : status === 'blocked' ? '<span class="badge blocked">Blocked</span>' : '<span class="badge pending">Pending</span>';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.title || p.type || 'Property'}</strong><br><span style="font-size:0.8rem;color:var(--text-muted);">${p._id}</span></td>
            <td>${p.ownerEmail || '—'}</td>
            <td>${p.type || '—'}</td>
            <td>${badge}</td>
            <td>
                <button class="action-btn" onclick="openPropertyModal('${p._id}')">View</button>
                <button class="action-btn danger" onclick="removeProperty('${p._id}')">Remove</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function filterAdminProperties() {
    const val = document.getElementById('property-type-filter').value;
    if (val === 'all') renderAdminProperties(propertiesData);
    else renderAdminProperties(propertiesData.filter(p => (p.type || '').toLowerCase() === val.toLowerCase()));
}

let currentPropertyId = null;

function openPropertyModal(id) {
    const p = propertiesData.find(x => x._id === id);
    if (!p) return;
    currentPropertyId = id;
    document.getElementById('property-modal-title').textContent = p.title || 'Property Details';
    document.getElementById('property-modal-body').innerHTML = `
        <div><strong>Owner:</strong> ${p.ownerName || p.ownerEmail || '—'}</div>
        <div><strong>Type:</strong> ${p.type || '—'}</div>
        <div><strong>City:</strong> ${p.city || p.address || '—'}</div>
        <div><strong>Price:</strong> ₹${p.price ? Number(p.price).toLocaleString('en-IN') : '—'}</div>
        <div><strong>Status:</strong> ${p.approvalStatus || 'Pending'}</div>
        <div><strong>Description:</strong> ${p.description || '—'}</div>`;
    const btn = document.getElementById('property-approve-btn');
    const isActive = (p.approvalStatus || '').toLowerCase() === 'active';
    btn.disabled = isActive;
    btn.textContent = isActive ? 'Already Approved' : 'Approve Property';
    btn.style.background = isActive ? 'rgba(255,255,255,0.1)' : 'var(--success-color)';
    document.getElementById('property-modal').classList.remove('hidden');
}

async function approveProperty() {
    if (!currentPropertyId) return;
    await fetch(`${API}/properties/${currentPropertyId}`, { method: 'PUT', headers, body: JSON.stringify({ approvalStatus: 'active', isApproved: true }) });
    alert('Property approved!');
    closePropertyModal();
    loadProperties();
    loadStats();
}

async function removeProperty(id) {
    if (!confirm('Remove this property?')) return;
    await fetch(`${API}/properties/${id}`, { method: 'DELETE', headers });
    loadProperties();
    loadStats();
}

function closePropertyModal() {
    document.getElementById('property-modal').classList.add('hidden');
    currentPropertyId = null;
}

// ─── Bookings ─────────────────────────────────────────────────────
let bookingsData = [];
let currentBookingId = null;

async function loadBookings() {
    const res = await fetch(`${API}/bookings`, { headers });
    bookingsData = await res.json();
    const tbody = document.getElementById('bookings-table-body');
    tbody.innerHTML = '';
    bookingsData.forEach((b, i) => {
        const statusBadge = b.status === 'Verified' ? '<span class="badge active">Confirmed</span>' :
            b.status === 'Pending Admin' ? '<span class="badge pending">Pending Admin</span>' :
            '<span class="badge pending">Pending Owner</span>';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${b._id.slice(-6).toUpperCase()}</td>
            <td>${b.propertyTitle || '—'}</td>
            <td>${b.tenantProfile?.name || '—'}</td>
            <td>Negotiated</td>
            <td>${statusBadge}</td>
            <td><button class="action-btn" onclick="openBookingModal(${i})">Details</button></td>`;
        tbody.appendChild(tr);
    });
}

function openBookingModal(idx) {
    const b = bookingsData[idx];
    if (!b) return;
    currentBookingId = b._id;
    document.getElementById('booking-modal-title').textContent = 'Booking: #' + b._id.slice(-6).toUpperCase();
    const t = b.tenantProfile || {};
    document.getElementById('booking-modal-body').innerHTML = `
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:8px;">
            <h4 style="margin-top:0;color:var(--primary-color);">Property</h4>
            <p><strong>Title:</strong> ${b.propertyTitle || '—'}</p>
            <p><strong>Location:</strong> ${b.propertyLoc || '—'}</p>
            <p><strong>Status:</strong> ${b.status}</p>
        </div>
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:8px;">
            <h4 style="margin-top:0;color:var(--success-color);">Tenant</h4>
            <p><strong>Name:</strong> ${t.name || '—'}</p>
            <p><strong>Email:</strong> ${t.email || '—'}</p>
            <p><strong>Phone:</strong> ${t.phone || '—'}</p>
            <p><strong>Occupation:</strong> ${t.occupation || '—'}</p>
        </div>`;
    const btn = document.getElementById('booking-approve-btn');
    const canApprove = b.status === 'Pending Admin';
    btn.disabled = !canApprove;
    btn.textContent = b.status === 'Verified' ? 'Confirmed' : canApprove ? 'Approve Request' : 'Awaiting Owner';
    btn.style.background = canApprove ? 'var(--success-color)' : 'rgba(255,255,255,0.1)';
    document.getElementById('booking-modal').classList.remove('hidden');
}

async function approveBooking() {
    if (!currentBookingId) return;
    if (!confirm('Approve this booking?')) return;
    await fetch(`${API}/bookings/${currentBookingId}`, { method: 'PUT', headers, body: JSON.stringify({ status: 'Verified' }) });
    alert('Booking approved!');
    closeBookingModal();
    loadBookings();
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
    currentBookingId = null;
}

// ─── Reviews ──────────────────────────────────────────────────────
let reviewsData = [];

async function loadReviews() {
    const res = await fetch(`${API}/reviews`, { headers });
    reviewsData = await res.json();
    const container = document.getElementById('reviews-container');
    container.innerHTML = '';
    if (reviewsData.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);">No reviews found.</p>';
        return;
    }
    reviewsData.forEach(r => {
        const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
        const flagBadge = r.isFlagged ? '<span class="badge blocked" style="margin-left:10px;font-size:0.7rem;">Flagged</span>' : '';
        const div = document.createElement('div');
        div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        div.style.paddingBottom = '1rem';
        div.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
                <strong>${r.tenantName || 'User'} → ${r.propertyTitle || 'Property'}</strong>
                <span style="color:var(--warning-color);">${stars}</span>
            </div>
            <p style="color:var(--text-muted);margin:0;">"${r.comments || ''}" ${flagBadge}</p>
            <div style="margin-top:0.5rem;">
                <button class="action-btn danger" style="font-size:0.8rem;" onclick="deleteReview('${r._id}')">Delete</button>
                ${!r.isFlagged ? `<button class="action-btn" style="font-size:0.8rem;" onclick="flagReview('${r._id}')">Flag</button>` : ''}
            </div>`;
        container.appendChild(div);
    });
}

async function deleteReview(id) {
    if (!confirm('Delete this review?')) return;
    await fetch(`${API}/reviews/${id}`, { method: 'DELETE', headers });
    loadReviews();
}

async function flagReview(id) {
    await fetch(`${API}/reviews/${id}/flag`, { method: 'PUT', headers });
    loadReviews();
}
