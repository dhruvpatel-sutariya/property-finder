function switchSection(secId, navElement) {
            // Remove active class from all sections
            document.querySelectorAll('.section').forEach(el => {
                el.classList.remove('active');
            });
            // Show target section
            document.getElementById('sec-' + secId).classList.add('active');

            // Update Nav styling
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.remove('active');
            });
            navElement.classList.add('active');
        }

        function loadDynamicStats() {
            // Set hardcoded defaults per instructions before backend is wired
            document.getElementById('stat-users').textContent = '0';
            document.getElementById('stat-revenue').textContent = '₹0';

            // Start with base static dataset (Count of all PGs, Apartments, Villas, Houses across all cities)
            let propertiesCount = 147;
            let ownerSet = new Set();

            // Adding default static owners from the templates
            const defaultOwners = ["Arjun Mehta", "Rakesh Joshi", "Sunil Dutt", "Neha Patel", "Kabir Singh", "Sneha Desai", "Kiran Patel", "Manoj Shah", "Kavita Kulkarni"];
            defaultOwners.forEach(owner => ownerSet.add(owner));

            const storedPropsStr = localStorage.getItem('ownerProperties');
            if (storedPropsStr) {
                try {
                    const props = JSON.parse(storedPropsStr);
                    propertiesCount += props.length; // Add dynamic to static base

                    // Add dynamically created property owner to unique set (fallback to default if anonymous)
                    const sessionOwner = localStorage.getItem('ownerName') || 'System Owner';

                    if (props.length > 0) {
                        ownerSet.add(sessionOwner);
                    }
                } catch (e) {
                    console.error("Error parsing properties", e);
                }
            }

            document.getElementById('stat-properties').textContent = propertiesCount;
            document.getElementById('stat-owners').textContent = ownerSet.size;

            // Load Tenants, Owners & Properties dynamically
            loadTenants();
            loadOwners();
            loadProperties();
            loadBookings();
            loadReviews();
        }

        function loadOwners() {
            const tbody = document.getElementById('owner-table-body');
            tbody.innerHTML = '';

            const defaultOwners = ["Arjun Mehta", "Rakesh Joshi", "Sunil Dutt", "Neha Patel", "Kabir Singh", "Sneha Desai", "Kiran Patel", "Manoj Shah", "Kavita Kulkarni"];
            let ownersHtml = '';

            defaultOwners.forEach((owner, idx) => {
                ownersHtml += `
                    <tr>
                        <td style="display: flex; align-items: center; gap: 0.8rem;">
                            <img src="https://i.pravatar.cc/150?u=${10 + idx}" style="width: 30px; height: 30px; border-radius: 50%;">
                            ${owner}
                        </td>
                        <td>${owner.toLowerCase().replace(' ', '.')}@example.com</td>
                        <td>Multiple</td>
                        <td><span class="badge active">Verified</span></td>
                        <td>
                            <button class="action-btn" onclick="openOwnerModal('${owner.replace(/'/g, "\\'")}', false)">View</button>
                            <button class="action-btn danger">Block</button>
                        </td>
                    </tr>
                `;
            });

            // fetch from local storage if any
            const ownerProfileStr = localStorage.getItem('ownerProfile');
            if (ownerProfileStr) {
                try {
                    const dynamicOwner = JSON.parse(ownerProfileStr);
                    const properties = JSON.parse(localStorage.getItem('ownerProperties') || '[]');
                    const isVerified = dynamicOwner.isVerified === true;
                    const safeName = (dynamicOwner.fullname || 'Unknown Owner').replace(/'/g, "\\'");

                    ownersHtml += `
                        <tr>
                            <td style="display: flex; align-items: center; gap: 0.8rem;">
                                <img src="${dynamicOwner.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">
                                ${dynamicOwner.fullname || 'Unknown Owner'}
                            </td>
                            <td>${dynamicOwner.email || 'N/A'}</td>
                            <td>${properties.length}</td>
                            <td>${dynamicOwner.isBlocked ? '<span class="badge blocked">Blocked</span>' : (isVerified ? '<span class="badge active">Verified</span>' : '<span class="badge pending">Pending</span>')}</td>
                            <td>
                                <button class="action-btn" onclick="openOwnerModal('${safeName}', true)">View</button>
                                <button class="action-btn danger" onclick="blockOwner('${dynamicOwner.email}')">Block</button>
                            </td>
                        </tr>
                    `;
                } catch (e) { console.error('Error parsing owner profile', e); }
            }

            tbody.innerHTML = ownersHtml;
        }

        let currentActiveTenantEmail = null;
        let tenantsData = [];

        function loadTenants() {
            const tbody = document.getElementById('tenant-table-body');
            tbody.innerHTML = '';

            // Hardcoded example tenant
            const exampleTenant = {
                name: 'John Doe (Example)',
                email: 'john.doe@example.com',
                phone: '+91 98765 43210',
                address: '123 Fake Street, Ahmedabad',
                occupation: 'Software Engineer',
                salary: '80000',
                isVerified: false,
                avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
                id: 'dummy'
            };

            tenantsData = [exampleTenant];

            // For now, we fetch a single tenant logic mapped directly from 'tenantProfile'
            const tenantStr = localStorage.getItem('tenantProfile');
            let totalUsers = 1; // Start with 1 for the example tenant

            if (tenantStr) {
                try {
                    const dynamicTenant = JSON.parse(tenantStr);
                    dynamicTenant.id = 'dynamic';
                    tenantsData.push(dynamicTenant);
                    totalUsers = 2;
                } catch (e) { console.error('Error loading tenant', e); }
            }

            if (tenantsData.length > 0) {
                tenantsData.forEach(tenant => {
                    const avatarSrc = tenant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80';
                    const isVerified = tenant.isVerified === true;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="display: flex; align-items: center; gap: 0.8rem;">
                            <img src="${avatarSrc}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">
                            ${tenant.name || 'Unknown User'}
                        </td>
                        <td>${tenant.email || 'N/A'}</td>
                        <td>${tenant.phone || 'N/A'}</td>
                        <td id="status-${tenant.id}">${tenant.isBlocked ? '<span class="badge blocked">Blocked</span>' : (isVerified ? '<span class="badge active">Verified</span>' : '<span class="badge pending">Pending</span>')}</td>
                        <td>
                            <button class="action-btn" onclick="openTenantModal('${tenant.id}')">View Details</button>
                            <button class="action-btn danger" onclick="blockTenant('${tenant.id}')">Block</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No tenants registered yet.</td></tr>';
            }

            document.getElementById('stat-users').textContent = totalUsers;
        }

        function openTenantModal(tenantId) {
            const tenant = tenantsData.find(t => t.id === tenantId);
            if (tenant) {
                currentActiveTenantEmail = tenant.email;

                let modalBody = document.getElementById('tenant-modal-body');
                const isVerified = tenant.isVerified;

                modalBody.innerHTML = `
                    <div style="display:flex; align-items:center; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                        <img src="${tenant.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80'}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <h4 style="margin: 0; font-size: 1.2rem;">${tenant.name || 'N/A'}</h4>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">${tenant.occupation || 'N/A'}</span>
                        </div>
                    </div>
                    <div><strong>Email:</strong> ${tenant.email || 'N/A'}</div>
                    <div><strong>Phone:</strong> ${tenant.phone || 'N/A'}</div>
                    <div><strong>Address:</strong> ${tenant.address || 'N/A'}</div>
                    <div><strong>Salary:</strong> ${tenant.salary ? '₹' + tenant.salary : 'N/A'}</div>
                    <div id="modal-status"><strong>Status:</strong> ${isVerified ? '<span style="color:var(--success-color);">Verified</span>' : '<span style="color:var(--warning-color);">Pending Approval</span>'}</div>
                    
                    <div style="margin-top: 1rem;">
                        <label style="display:block; margin-bottom: 0.5rem; color: var(--text-muted);">Uploaded ID Proof</label>
                        <div style="width: 100%; height: 120px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: var(--text-muted); font-size: 0.9rem;">ID_Document_${tenant.name.split(' ')[0]}.pdf</span>
                        </div>
                    </div>
                `;

                const btnApprove = document.getElementById('btn-approve-tenant');
                if (isVerified) {
                    btnApprove.style.display = 'none';
                } else {
                    btnApprove.style.display = 'block';
                    btnApprove.onclick = () => {
                        tenant.isVerified = true;

                        // Update UI directly for the example
                        document.getElementById('modal-status').innerHTML = '<strong>Status:</strong> <span style="color:var(--success-color);">Verified</span>';
                        document.getElementById('status-' + tenant.id).innerHTML = '<span class="badge active">Verified</span>';
                        btnApprove.style.display = 'none';

                        if (tenant.id === 'dynamic') {
                            localStorage.setItem('tenantProfile', JSON.stringify(tenant));
                        }
                        alert('Tenant verified automatically!');
                    };
                }

                document.getElementById('tenant-modal').classList.remove('hidden');
            }
        }

        function closeTenantModal() {
            document.getElementById('tenant-modal').classList.add('hidden');
        }

        function closeOwnerModal() {
            document.getElementById('owner-modal').classList.add('hidden');
        }

        function openOwnerModal(ownerName, isDynamic) {
            document.getElementById('owner-modal-title').textContent = ownerName + "'s Profile Details";
            const modalBody = document.getElementById('owner-modal-body');
            modalBody.innerHTML = '';

            let propsToShow = [];
            let ownerHeaderHtml = '';

            if (isDynamic) {
                const ownerProfileStr = localStorage.getItem('ownerProfile');
                if (ownerProfileStr) {
                    try {
                        const dynamicOwner = JSON.parse(ownerProfileStr);
                        const isVerified = dynamicOwner.isVerified === true;

                        ownerHeaderHtml = `
                            <div style="display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                                <img src="${dynamicOwner.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                                <div style="flex-grow: 1;">
                                    <h4 style="margin: 0; font-size: 1.2rem;">${dynamicOwner.fullname || ownerName}</h4>
                                    <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">${dynamicOwner.email || 'No email'}</p>
                                    <div id="modal-owner-status" style="margin-top: 0.5rem;">
                                        ${isVerified ? '<span class="badge active">Verified</span>' : '<span class="badge pending">Pending Approval</span>'}
                                    </div>
                                </div>
                                <div id="modal-owner-actions" style="display: flex; gap: 0.5rem; flex-direction: column;">
                                    ${!isVerified ? `
                                        <button class="action-btn success" onclick="approveDynamicOwner()">Approve / Verify</button>
                                        <button class="action-btn danger" onclick="rejectDynamicOwner()">Reject Owner</button>
                                    ` : ''}
                                </div>
                            </div>
                            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                                <div><strong>Occupation:</strong> ${dynamicOwner.occupation || 'N/A'}</div>
                                <div><strong>Address:</strong> ${dynamicOwner.address || 'N/A'}</div>
                                
                                <div style="margin-top: 1rem;">
                                    <label style="display:block; margin-bottom: 0.5rem; color: var(--text-muted);">Uploaded ID Proof</label>
                                    <div style="width: 100%; height: 120px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <span style="color: var(--text-muted); font-size: 0.9rem;">ID_Document_${(dynamicOwner.fullname || dynamicOwner.name || ownerName).split(' ')[0]}.pdf</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (e) { }
                }

                const storedPropsStr = localStorage.getItem('ownerProperties');
                if (storedPropsStr) {
                    try {
                        const allProps = JSON.parse(storedPropsStr);
                        propsToShow = allProps; // For now assuming all dynamic properties belong to this active owner
                    } catch (e) { }
                }
            } else {
                // Mock properties and details for static owners
                ownerHeaderHtml = `
                    <div style="display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; font-size: 1.2rem;">${ownerName}</h4>
                            <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">${ownerName.toLowerCase().replace(' ', '.')}@example.com</p>
                            <div id="modal-owner-status" style="margin-top: 0.5rem;">
                                <span class="badge active">Verified</span>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">
                        <div><strong>Occupation:</strong> Property Investor</div>
                        <div><strong>Address:</strong> High Street, Business Park, India</div>
                        
                        <div style="margin-top: 1rem;">
                            <label style="display:block; margin-bottom: 0.5rem; color: var(--text-muted);">Uploaded ID Proof</label>
                            <div style="width: 100%; height: 120px; background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: var(--text-muted); font-size: 0.9rem;">ID_Document_${ownerName.split(' ')[0]}.pdf</span>
                            </div>
                        </div>
                    </div>
                `;

                propsToShow = [
                    { title: 'Luxury Villa', type: 'Villa', address: 'Surat, Gujarat', price: '₹45,000/mo', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
                    { title: 'Modern Apartment', type: 'Apartment', address: 'Ahmedabad, Gujarat', price: '₹25,000/mo', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
                ];
            }

            let propertiesHtml = '';
            if (propsToShow.length === 0) {
                propertiesHtml = '<p style="color: var(--text-muted); text-align: center;">No properties found for this owner.</p>';
            } else {
                let gridHtml = '<h4 style="margin: 0;">Uploaded Properties</h4><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">';
                propsToShow.forEach(prop => {
                    const img = prop.image || (prop.images && prop.images[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
                    const title = prop.title || 'Property';
                    const addr = prop.address || prop.location || 'Location Not Provided';
                    const type = prop.type ? (prop.type.charAt(0).toUpperCase() + prop.type.slice(1)) : 'Property';
                    gridHtml += `
                        <div style="background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="height: 140px; background-image: url('${img}'); background-size: cover; background-position: center;"></div>
                            <div style="padding: 1rem;">
                                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: var(--text-light); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${title}</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${addr}</p>
                                <div style="margin-top: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-size: 0.75rem; background: rgba(52, 152, 219, 0.2); color: var(--primary-color); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600;">${type}</span>
                                    <span style="font-weight: 600; font-size: 0.9rem; color: var(--success-color);">${prop.price || '₹15,000/mo'}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
                gridHtml += '</div>';
                propertiesHtml = gridHtml;
            }

            modalBody.innerHTML = ownerHeaderHtml + propertiesHtml;
            document.getElementById('owner-modal').classList.remove('hidden');
        }

        function approveDynamicOwner() {
            const ownerProfileStr = localStorage.getItem('ownerProfile');
            if (ownerProfileStr) {
                let dynamicOwner = JSON.parse(ownerProfileStr);
                dynamicOwner.isVerified = true;
                localStorage.setItem('ownerProfile', JSON.stringify(dynamicOwner));

                document.getElementById('modal-owner-status').innerHTML = '<span class="badge active">Verified</span>';
                document.getElementById('modal-owner-actions').innerHTML = ''; // Clear actions since approved

                loadOwners(); // Refresh parent table behind modal
                alert("Owner verified successfully!");
            }
        }

        function rejectDynamicOwner() {
            if (confirm('Are you sure you want to reject and block this owner? This action cannot be undone.')) {
                // Remove owner entirely or set status. For demo, we just clear the dynamic user.
                localStorage.removeItem('ownerProfile');
                localStorage.removeItem('ownerProperties');

                closeOwnerModal();
                loadOwners();
                loadProperties(); // Their properties wipe out too
                loadDynamicStats();
                alert('Owner and their properties have been rejected and removed from system.');
            }
        }

        let adminAllProperties = [];
        let currentModalPropertyId = null;

        function generateMockProperties() {
            const defaultOwners = ["Arjun Mehta", "Rakesh Joshi", "Sunil Dutt", "Neha Patel", "Kabir Singh", "Sneha Desai", "Kiran Patel", "Manoj Shah", "Kavita Kulkarni"];
            const types = ['Apartment', 'House', 'Villa', 'PG'];
            const cities = ['Ahmedabad', 'Surat', 'Jamnagar', 'Mehsana', 'Gandhinagar', 'Rajkot', 'Bhavnagar'];
            const prefixes = ['Premium', 'Luxury', 'Cozy', 'Affordable', 'Modern', 'Spacious', 'Classic', 'Royal'];

            for (let i = 1; i <= 152; i++) {
                // Ensure a relatively even distribution of types, but lots of apartments
                let typeIndex = i % 10;
                let type = 'Apartment';
                if (typeIndex >= 4 && typeIndex < 6) type = 'House';
                else if (typeIndex >= 6 && typeIndex < 8) type = 'Villa';
                else if (typeIndex >= 8) type = 'PG';

                const city = cities[i % cities.length];
                const prefix = prefixes[i % prefixes.length];
                const owner = defaultOwners[i % defaultOwners.length];
                const status = (i % 7 === 0) ? 'Pending' : (i % 15 === 0 ? 'Blocked' : 'Active');

                adminAllProperties.push({
                    id: 'PROP-' + (1000 + i),
                    name: `${prefix} ${type} in ${city}`,
                    owner: owner,
                    type: type,
                    status: status
                });
            }
        }

        function loadProperties() {
            if (adminAllProperties.length === 0) {
                generateMockProperties();
            }

            // Dynamically add properties from ownerProperties
            const storedPropsStr = localStorage.getItem('ownerProperties');
            let realDynamicIds = [];
            if (storedPropsStr) {
                try {
                    const allProps = JSON.parse(storedPropsStr);
                    allProps.forEach((prop, idx) => {
                        let pId = prop.id ? prop.id.toString() : ('DYN-' + idx);
                        let finalId = pId.startsWith('PROP-') ? pId : ('PROP-' + pId);
                        realDynamicIds.push(finalId);
                        const normalizedStatus = (prop.approvalStatus || '').toLowerCase();
                        const finalStatus = (prop.isApproved === true || normalizedStatus === 'active' || normalizedStatus === 'approved') ? 'Active' : 'Pending';

                        if (!adminAllProperties.some(p => p.id === finalId)) {
                            adminAllProperties.unshift({
                                id: finalId,
                                name: prop.type ? (prop.type + (prop.location ? ' in ' + prop.location : '')) : 'Dynamic Property',
                                owner: localStorage.getItem('ownerName') || 'System Owner',
                                type: prop.type || 'Property',
                                status: finalStatus
                            });
                        } else {
                            const existing = adminAllProperties.find(p => p.id === finalId);
                            if (existing) existing.status = finalStatus;
                        }
                    });
                } catch (e) { }
            }

            // Re-filter out removed dynamic properties just to be safe if they got out of sync
            adminAllProperties = adminAllProperties.filter(p => !p.id.includes('DYN-') && (!p.id.startsWith('PROP-') || realDynamicIds.includes(p.id) || p.id.split('-')[1] > 0));

            renderAdminProperties(adminAllProperties);
        }

        function renderAdminProperties(propertiesToRender) {
            const tbody = document.getElementById('property-table-body');
            tbody.innerHTML = '';

            if (propertiesToRender.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No properties found.</td></tr>';
                return;
            }

            let html = '';
            propertiesToRender.forEach(prop => {
                let statusBadge = '<span class="badge active">Active</span>';
                if (prop.status === 'Pending') statusBadge = '<span class="badge pending">Pending</span>';
                else if (prop.status === 'Blocked') statusBadge = '<span class="badge blocked">Blocked</span>';

                html += `
                    <tr>
                        <td style="display: flex; gap: 0.8rem; align-items: center;">
                            <div style="width: 40px; height: 40px; background-color: var(--surface-light); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-muted);">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            </div>
                            <div>
                                <strong style="display: block;">${prop.name}</strong>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">${prop.id}</span>
                            </div>
                        </td>
                        <td>${prop.owner}</td>
                        <td>${prop.type}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="action-btn" onclick="openPropertyModal('${prop.id}')">View</button>
                            <button class="action-btn danger" onclick="removeProperty('${prop.id}')">Remove</button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        }

        function filterAdminProperties() {
            const filterValue = document.getElementById('property-type-filter').value;
            if (filterValue === 'all') {
                renderAdminProperties(adminAllProperties);
            } else {
                const filtered = adminAllProperties.filter(p => p.type === filterValue);
                renderAdminProperties(filtered);
            }
        }

        function openPropertyModal(propId) {
            const prop = adminAllProperties.find(p => p.id === propId);
            if (!prop) return;
            currentModalPropertyId = propId;

            document.getElementById('property-modal-title').textContent = prop.name;
            const modalBody = document.getElementById('property-modal-body');

            // Mock owner details based on owner name
            const ownerEmail = prop.owner.toLowerCase().replace(' ', '.') + '@example.com';
            const ownerPhone = '+91 ' + Math.floor(1000000000 + Math.random() * 9000000000);

            modalBody.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1.5rem;">
                    <div>
                        <h4 style="margin-top: 0; color: var(--text-light); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Property Info</h4>
                        <p style="margin: 0.5rem 0;"><strong>ID:</strong> ${prop.id}</p>
                        <p style="margin: 0.5rem 0;"><strong>Type:</strong> ${prop.type}</p>
                        <p style="margin: 0.5rem 0;"><strong>Status:</strong> ${prop.status === 'Active' ? '<span style="color:var(--success-color)">Active</span>' : (prop.status === 'Pending' ? '<span style="color:var(--warning-color)">Pending</span>' : '<span style="color:var(--danger-color)">Blocked</span>')}</p>
                        <p style="margin: 0.5rem 0;"><strong>Rent:</strong> ₹${15000 + Math.floor(Math.random() * 30000)}/mo</p>
                    </div>
                    <div>
                        <h4 style="margin-top: 0; color: var(--text-light); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">Owner Info</h4>
                        <div style="display:flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                            <img src="https://i.pravatar.cc/150?u=${prop.owner.replace(' ', '')}" style="width: 40px; height: 40px; border-radius: 50%;">
                            <div>
                                <strong style="display: block;">${prop.owner}</strong>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">${ownerEmail}</span>
                            </div>
                        </div>
                        <p style="margin: 0.5rem 0;"><strong>Phone:</strong> ${ownerPhone}</p>
                        <p style="margin: 0.5rem 0;"><strong>Verification:</strong> <span class="badge active" style="font-size: 0.7rem; padding: 0.2rem 0.4rem;">Verified</span></p>
                    </div>
                </div>
                
                <div>
                    <h4 style="margin-top: 0; color: var(--text-light); margin-bottom: 1rem;">Submitted Documents</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        
                        <!-- Owner ID Proof -->
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3498db; margin-bottom: 0.5rem;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <h5 style="margin: 0 0 0.2rem 0;">Owner's Aadhar Card</h5>
                            <span style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Verified ID Proof</span>
                            <button class="action-btn" style="font-size: 0.8rem; padding: 0.3rem 0.8rem; margin: 0;">View Document</button>
                        </div>
                        
                        <!-- Electricity Bill -->
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #f1c40f; margin-bottom: 0.5rem;"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                            <h5 style="margin: 0 0 0.2rem 0;">Electricity Bill</h5>
                            <span style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Recent Utility Bill</span>
                            <button class="action-btn" style="font-size: 0.8rem; padding: 0.3rem 0.8rem; margin: 0;">View Document</button>
                        </div>
                        
                        <!-- Tax Receipt -->
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--success-color); margin-bottom: 0.5rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            <h5 style="margin: 0 0 0.2rem 0;">Tax Receipt</h5>
                            <span style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">Property Tax Record</span>
                            <button class="action-btn" style="font-size: 0.8rem; padding: 0.3rem 0.8rem; margin: 0;">View Document</button>
                        </div>
                    </div>
                </div>
            `;

            const approveBtn = document.getElementById('property-approve-btn');
            if (approveBtn) {
                if (prop.status === 'Pending') {
                    approveBtn.style.display = 'inline-block';
                    approveBtn.disabled = false;
                    approveBtn.textContent = 'Approve Property';
                    approveBtn.style.cursor = 'pointer';
                    approveBtn.style.background = 'var(--success-color)';
                } else {
                    approveBtn.style.display = 'inline-block';
                    approveBtn.disabled = true;
                    approveBtn.textContent = (prop.status === 'Active') ? 'Already Approved' : 'Cannot Approve';
                    approveBtn.style.cursor = 'not-allowed';
                    approveBtn.style.background = 'rgba(255,255,255,0.2)';
                }
            }

            document.getElementById('property-modal').classList.remove('hidden');
        }

        function closePropertyModal() {
            document.getElementById('property-modal').classList.add('hidden');
            currentModalPropertyId = null;
        }

        function approveProperty() {
            if (!currentModalPropertyId) return;

            const prop = adminAllProperties.find(p => p.id === currentModalPropertyId);
            if (!prop || prop.status !== 'Pending') return;

            prop.status = 'Active';

            const storedPropsStr = localStorage.getItem('ownerProperties');
            if (storedPropsStr) {
                try {
                    const allProps = JSON.parse(storedPropsStr);
                    const updated = allProps.map((p, idx) => {
                        const rawId = p.id ? p.id.toString() : ('DYN-' + idx);
                        const compareId = rawId.startsWith('PROP-') ? rawId : ('PROP-' + rawId);
                        if (compareId === currentModalPropertyId) {
                            return { ...p, approvalStatus: 'active', isApproved: true };
                        }
                        return p;
                    });
                    localStorage.setItem('ownerProperties', JSON.stringify(updated));
                } catch (e) { }
            }

            loadProperties();
            closePropertyModal();
            alert('Property approved successfully. It is now visible on tenant side.');
        }

        let adminAllBookings = [];

        function loadBookings() {
            const tbody = document.getElementById('bookings-table-body');
            tbody.innerHTML = '';

            if (adminAllBookings.length === 0) {
                adminAllBookings = [
                    { id: 'REQ-551', prop: 'Luxury Villa Surat', tenantName: 'Alexander Doe', tenantEmail: 'alexander.doe@example.com', tenantPhone: '+91 98765 11111', occupation: 'Businessman', rent: '₹45,000', status: 'Pending Admin' },
                    { id: 'REQ-552', prop: 'Premium Apartment Ahmedabad', tenantName: 'Raj Patel', tenantEmail: 'raj.patel@example.com', tenantPhone: '+91 98765 22222', occupation: 'Software Engineer', rent: '₹25,000', status: 'Pending Admin' },
                    { id: 'REQ-553', prop: 'Cozy PG Room', tenantName: 'Samantha Smith', tenantEmail: 'samantha.smith@example.com', tenantPhone: '+91 98765 33333', occupation: 'Student', rent: '₹8,000', status: 'Verified' }
                ];
            }

            const ownerBookingsStr = localStorage.getItem('ownerBookings');
            let dynamicBookings = [];
            if (ownerBookingsStr) {
                const storedBookings = JSON.parse(ownerBookingsStr);
                dynamicBookings = storedBookings.map((b, idx) => ({
                    id: b.id || ('REQ-DYN-' + idx),
                    prop: b.propertyTitle || 'Unknown',
                    tenantName: b.tenantProfile?.name || 'Unknown',
                    tenantEmail: b.tenantProfile?.email || 'N/A',
                    tenantPhone: b.tenantProfile?.phone || 'N/A',
                    occupation: b.tenantProfile?.occupation || 'N/A',
                    rent: b.rent || 'Negotiated',
                    status: b.status || 'Pending Owner',
                    originalIndex: idx,
                    rawBooking: b
                }));
            }
            
            const allToDisplay = [...dynamicBookings, ...adminAllBookings];
            window.renderedBookingsForAdmin = allToDisplay;

            let html = '';
            allToDisplay.forEach((booking, idx) => {
                let statusHtml = '';
                if (booking.status === 'Pending Owner') statusHtml = '<span class="badge pending">Pending Owner</span>';
                else if (booking.status === 'Pending Admin' || booking.status === 'Pending') statusHtml = '<span class="badge warning" style="background:#f39c12; color:#fff;">Pending Admin</span>';
                else if (booking.status === 'Verified') statusHtml = '<span class="badge active">Confirmed</span>';

                html += `
                        <tr>
                            <td>#${booking.id}</td>
                            <td>${booking.prop}</td>
                            <td>${booking.tenantName}</td>
                            <td>${booking.rent}</td>
                            <td>${statusHtml}</td>
                            <td>
                                <button class="action-btn" onclick="openBookingModal(${idx})">Details</button>
                            </td>
                        </tr>
                    `;
            });

            tbody.innerHTML = html;
        }

        let currentBookingId = null;

        function openBookingModal(idx) {
            const booking = window.renderedBookingsForAdmin[idx];
            if (!booking) return;

            currentBookingId = idx;

            document.getElementById('booking-modal-title').textContent = 'Booking Request: #' + booking.id;
            const modalBody = document.getElementById('booking-modal-body');

            modalBody.innerHTML = `
                    <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <h4 style="margin-top: 0; color: var(--primary-color);">Property Information</h4>
                        <p style="margin: 0.5rem 0;"><strong>Property Name:</strong> ${booking.prop}</p>
                        <p style="margin: 0.5rem 0;"><strong>Offered Rent:</strong> ${booking.rent}</p>
                        <p style="margin: 0.5rem 0;"><strong>Request Status:</strong> ${booking.status}</p>
                    </div>

                    <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <h4 style="margin-top: 0; color: var(--success-color);">Tenant Identification</h4>
                        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                            <div style="width: 50px; height: 50px; background-color: var(--surface-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; color: var(--text-light); border: 2px solid var(--primary-color);">
                                ${(booking.tenantName || 'U').charAt(0)}
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem;">${booking.tenantName}</h4>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">${booking.occupation}</span>
                            </div>
                        </div>
                        <p style="margin: 0.5rem 0;"><strong>Email address:</strong> ${booking.tenantEmail}</p>
                        <p style="margin: 0.5rem 0;"><strong>Phone number:</strong> ${booking.tenantPhone}</p>
                        <div style="margin-top: 1rem; padding: 1rem; border: 1px dashed rgba(255,255,255,0.2); border-radius: 8px; text-align: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #3498db; margin-bottom: 0.5rem;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">Tenant's Profile Document (Generated)</p>
                            <button class="action-btn" style="margin-top: 0.5rem; font-size: 0.8rem;">View Document</button>
                        </div>
                    </div>
                `;

            const approveBtn = document.getElementById('booking-approve-btn');
            if (booking.status === 'Verified') {
                approveBtn.textContent = 'Confirmed';
                approveBtn.style.background = 'rgba(255,255,255,0.1)';
                approveBtn.disabled = true;
                approveBtn.style.cursor = 'not-allowed';
            } else if (booking.status === 'Pending Owner') {
                approveBtn.textContent = 'Awaiting Owner Confirmation';
                approveBtn.style.background = 'rgba(255,255,255,0.2)';
                approveBtn.style.color = '#fff';
                approveBtn.disabled = true;
                approveBtn.style.cursor = 'not-allowed';
            } else {
                approveBtn.textContent = 'Approve Request';
                approveBtn.style.background = 'var(--success-color)';
                approveBtn.style.color = '#fff';
                approveBtn.disabled = false;
                approveBtn.style.cursor = 'pointer';
            }

            document.getElementById('booking-modal').classList.remove('hidden');
        }

        function closeBookingModal() {
            document.getElementById('booking-modal').classList.add('hidden');
        }

        function approveBooking() {
            if (currentBookingId === null) return;
            if (confirm('Are you sure you want to approve this booking request?')) {
                const booking = window.renderedBookingsForAdmin[currentBookingId];
                if (booking) {
                    booking.status = 'Verified';

                    if (booking.rawBooking && booking.originalIndex !== undefined) {
                        const ownerBookingsStr = localStorage.getItem('ownerBookings');
                        if (ownerBookingsStr) {
                            let storedBookings = JSON.parse(ownerBookingsStr);
                            storedBookings[booking.originalIndex].status = 'Verified';
                            localStorage.setItem('ownerBookings', JSON.stringify(storedBookings));
                        }
                        
                        let approvedTenants = JSON.parse(localStorage.getItem('approvedTenants') || '[]');
                        booking.rawBooking.status = 'Verified';
                        approvedTenants.push(booking.rawBooking);
                        localStorage.setItem('approvedTenants', JSON.stringify(approvedTenants));
                        
                        let tenantNotifs = JSON.parse(localStorage.getItem('tenantNotifications') || '[]');
                        tenantNotifs.push({
                            id: Date.now(),
                            title: "Owner Approved Booking",
                            body: `The property owner has approved your booking for ${booking.rawBooking.propertyTitle || booking.prop}!`,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            read: false
                        });
                        localStorage.setItem('tenantNotifications', JSON.stringify(tenantNotifs));

                        let tenantChats = JSON.parse(localStorage.getItem('tenantChats') || '[]');
                        const ownerName = booking.rawBooking.ownerName || 'Property Owner';
                        const ownerId = ownerName.replace(/\s+/g, '-').toLowerCase();
                        const ownerAvatar = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80';
                        
                        let chat = tenantChats.find(c => c.id === ownerId);
                        if (!chat) {
                            chat = { id: ownerId, name: ownerName, avatar: ownerAvatar, messages: [] };
                            tenantChats.push(chat);
                        }
                        
                        chat.messages.push({
                            text: `Hello! I have approved your booking request for ${booking.rawBooking.propertyTitle}. Let me know if you have any questions!`,
                            sender: 'owner',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                        
                        chat.messages.push({
                            text: `Please submit a 10% token payment amount to officially confirm and lock in your property booking.`,
                            sender: 'owner',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                        localStorage.setItem('tenantChats', JSON.stringify(tenantChats));

                    } else {
                        const bStatic = adminAllBookings.find(b => b.id === booking.id);
                        if (bStatic) bStatic.status = 'Verified';
                    }

                    let tenantChats = JSON.parse(localStorage.getItem('tenantChats') || '[]');
                    let sysChat = tenantChats.find(c => c.id === 'sysAdmin');
                    if (!sysChat) {
                        sysChat = {
                            id: "sysAdmin",
                            name: "Platform Administrator",
                            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                            messages: []
                        };
                        tenantChats.push(sysChat);
                    }
                    
                    sysChat.messages.push({
                        text: `Your booking request #${booking.id} for ${booking.prop} has been Confirmed by the administrator!`,
                        sender: "owner",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                    localStorage.setItem('tenantChats', JSON.stringify(tenantChats));

                    let tenantNotifs = JSON.parse(localStorage.getItem('tenantNotifications') || '[]');
                    tenantNotifs.push({
                        id: Date.now(),
                        title: "Admin Verified Booking",
                        body: `Admin confirmed your booking request #${booking.id} for ${booking.prop}!`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        read: false
                    });
                    localStorage.setItem('tenantNotifications', JSON.stringify(tenantNotifs));

                    loadBookings();

                    const approveBtn = document.getElementById('booking-approve-btn');
                    if (approveBtn) {
                        approveBtn.textContent = 'Confirmed';
                        approveBtn.style.background = 'rgba(255,255,255,0.1)';
                        approveBtn.disabled = true;
                        approveBtn.style.cursor = 'not-allowed';
                    }

                    alert('Booking Request Approved successfully! Message sent to tenant.');
                }
            }
        }

        let adminAllReviews = [
            { id: 'REV-01', user: 'Alexander Doe', property: 'Luxury Villa Surat', rating: 5, text: '"Amazing property and very helpful owner. Had a great stay!"', isFlagged: false },
            { id: 'REV-02', user: 'Unknown User', property: 'Cozy PG Room', rating: 1, text: '"Fake listing, completely different from photos..."', isFlagged: true }
        ];

        function loadReviews() {
            const container = document.getElementById('reviews-container');
            container.innerHTML = '';

            // Allow adding new reviews generically from localStorage if needed
            const newReviews = JSON.parse(localStorage.getItem('dynamicReviews') || '[]');
            const displayReviews = [...newReviews, ...adminAllReviews];

            let html = '';
            displayReviews.forEach(rev => {
                let stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
                let flagBadge = rev.isFlagged ? `<span class="badge blocked" style="margin-left: 10px; font-size: 0.7rem;">Flagged</span>` : '';

                let actionButtons = `<button class="action-btn danger" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="deleteReview('${rev.id}')">Delete Content</button>`;

                if (rev.isFlagged) {
                    actionButtons += `
                        <button class="action-btn danger" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;" onclick="banReviewUser('${rev.user}')">Ban User & Review</button>
                        <button class="action-btn warning" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.5rem;" onclick="investigateReview('${rev.id}')">Investigate Listing</button>
                    `;
                }

                html += `
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <strong>${rev.user} -> ${rev.property}</strong>
                            <span style="color: var(--warning-color);">${stars}</span>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0;">${rev.text} ${flagBadge}</p>
                        <div style="margin-top: 0.5rem;">
                            ${actionButtons}
                        </div>
                    </div>
                `;
            });

            if (displayReviews.length === 0) {
                container.innerHTML = '<p style="color: var(--text-muted);">No reviews found.</p>';
            } else {
                container.innerHTML = html;
            }
        }

        function deleteReview(id) {
            if (confirm('Are you sure you want to permanently delete this review?')) {
                // remove from array
                adminAllReviews = adminAllReviews.filter(r => r.id !== id);

                // also remove from localstorage
                let dynamicReviews = JSON.parse(localStorage.getItem('dynamicReviews') || '[]');
                dynamicReviews = dynamicReviews.filter(r => r.id !== id);
                localStorage.setItem('dynamicReviews', JSON.stringify(dynamicReviews));

                loadReviews();
                alert('Review content deleted successfully.');
            }
        }

        function banReviewUser(user) {
            if (confirm(`Are you sure you want to ban the user "${user}"? This will restrict their account access.`)) {
                alert(`User "${user}" has been banned and their associated reviews are hidden.`);
            }
        }

        function investigateReview(id) {
            alert(`An investigation process has been initiated for property related to Review ID: ${id}. The owner will be notified.`);
        }

        function blockOwner(email) {
            if (confirm('Are you sure you want to block this owner? They will not be able to log in.')) {
                const ownerProfileStr = localStorage.getItem('ownerProfile');
                if (ownerProfileStr) {
                    let dynamicOwner = JSON.parse(ownerProfileStr);
                    if (dynamicOwner.email === email) {
                        dynamicOwner.isBlocked = true;
                        localStorage.setItem('ownerProfile', JSON.stringify(dynamicOwner));
                        alert('Owner has been blocked.');
                        loadOwners();
                    }
                }
            }
        }

        function blockTenant(id) {
            if (id === 'dynamic') {
                if (confirm('Are you sure you want to block this tenant? They will not be able to log in.')) {
                    const tenantStr = localStorage.getItem('tenantProfile');
                    if (tenantStr) {
                        let dynamicTenant = JSON.parse(tenantStr);
                        dynamicTenant.isBlocked = true;
                        localStorage.setItem('tenantProfile', JSON.stringify(dynamicTenant));
                        alert('Tenant has been blocked.');
                        loadTenants();
                    }
                }
            } else {
                alert('Static tenant cannot be blocked.');
            }
        }

        function removeProperty(propId) {
            if (confirm('Are you sure you want to remove this property? It will be removed for both owner and tenant.')) {
                // Remove from adminAllProperties (static demo)
                const index = adminAllProperties.findIndex(p => p.id === propId);
                if (index !== -1) {
                    adminAllProperties.splice(index, 1);
                }

                // Remove from ownerProperties (dynamic)
                const storedPropsStr = localStorage.getItem('ownerProperties');
                if (storedPropsStr) {
                    let allProps = JSON.parse(storedPropsStr);
                    // Match id ignoring 'PROP-' prefix
                    let filteredProps = allProps.filter((p, idx) => {
                        const rawId = p.id ? p.id.toString() : ('DYN-' + idx);
                        const compareId = rawId.startsWith('PROP-') ? rawId : ('PROP-' + rawId);
                        return compareId !== propId;
                    });
                    localStorage.setItem('ownerProperties', JSON.stringify(filteredProps));
                }

                alert('Property removed successfully.');
                loadProperties();
                loadDynamicStats();
            }
        }

        // Mock authentication check & data init
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('adminLoggedIn') !== 'true') {
                // To force auth: window.location.href = 'admin-login.html';
                // Leaving out explicit redirect for testing flexibility, but the architecture is ready.
            }

            loadDynamicStats();
        });