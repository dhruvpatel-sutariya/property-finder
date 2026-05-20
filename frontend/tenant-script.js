document.addEventListener('DOMContentLoaded', () => {
    const propertiesGrid = document.querySelector('.properties-grid');

    // Inject owner properties from localStorage
    if (propertiesGrid) {
        const storedOwnerProps = JSON.parse(localStorage.getItem('ownerProperties') || '[]');
        const ownerProfile = JSON.parse(localStorage.getItem('ownerProfile') || '{}');
        const isOwnerApproved = ownerProfile.isVerified === true && ownerProfile.isBlocked !== true;
        const displayOwnerName = localStorage.getItem('ownerName') || 'Property Owner';
        
        const typeSelect = document.getElementById('property-type');
        const currentType = (typeSelect && typeSelect.value) ? typeSelect.value.toLowerCase() : '';

        const locSelect = document.getElementById('location');
        const currentLoc = (locSelect && locSelect.value) ? locSelect.value.toLowerCase() : '';

        storedOwnerProps.forEach(prop => {
            const propApproved = prop.isApproved === true || (prop.approvalStatus || '').toLowerCase() === 'active';
            if (!isOwnerApproved || !propApproved) {
                return;
            }
            if (currentType && prop.type && prop.type.toLowerCase() !== currentType) {
                return;
            }
            if (currentLoc && prop.address && !prop.address.toLowerCase().includes(currentLoc)) {
                return;
            }
            const card = document.createElement('div');
            card.className = 'property-card';
            card.setAttribute('data-owner-name', displayOwnerName);
            card.setAttribute('data-owner-avatar', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80');

            const imagesArr = prop.images || (prop.image ? [prop.image] : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80']);
            const mainImgSrc = imagesArr[0];

            const listingSuffix = (prop.listingType === 'sell' || prop.type === 'house') ? '' : '<span>/mo</span>';
            const defaultSuffix = (prop.listingType === 'sell' || prop.type === 'house') ? ' for Sale' : ' for Rent';
            
            card.innerHTML = `
                <div class="property-image" style="background-image: url('${mainImgSrc}');">
                    <span class="badge" style="background-color: var(--primary-color);">New</span>
                </div>
                <div class="property-details">
                    <div class="price">₹${prop.price ? Number(prop.price).toLocaleString('en-IN') : Math.floor(Math.random() * 20 + 10) + ',000'}${listingSuffix}</div>
                    <h3>${prop.title || (prop.type ? prop.type.charAt(0).toUpperCase() + prop.type.slice(1) + defaultSuffix : 'Premium Property')}</h3>
                    <p class="location">${prop.address || 'Address not provided'}</p>
                    <div class="amenities">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> ${(prop.type || '').toLowerCase() === 'pg' ? '1 Bed' : '2 BHK'}</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21H3V3h18v18z"></path><path d="M8 8h8v8H8z"></path></svg> 1 Bath</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 800 sqft</span>
                    </div>
                    <button class="btn-outline">View Contact</button>
                    <div class="extra-images" style="display:none;">${imagesArr.join(',')}</div>
                </div>
            `;
            propertiesGrid.insertBefore(card, propertiesGrid.firstChild);
        });
    }

    const propertyImages = document.querySelectorAll('.property-image');
    const savedCountBadge = document.getElementById('saved-count');
    const savedLink = document.querySelector('.saved-link');
    const homeLink = document.querySelector('.nav-link.active');
    const sectionTitle = document.querySelector('.section-title');
    const searchSection = document.querySelector('.search-section');

    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.style.cursor = 'pointer';
        navBrand.addEventListener('click', () => {
            const path = window.location.pathname;
            const cities = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
            // If we are in a city folder, we need to go up one level
            if (cities.some(c => path.includes('/' + c + '/'))) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    let savedCount = 0;
    let isShowingSaved = false;

    // The heart SVG icon
    const heartSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    `;

    propertyImages.forEach(imageContainer => {
        // Create the save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.setAttribute('aria-label', 'Save property');
        saveBtn.innerHTML = heartSvg;

        // Add to image container
        imageContainer.appendChild(saveBtn);

        // Handle click event (toggle saved state)
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent clicking the card underneath

            const isSaved = saveBtn.classList.toggle('saved');

            // Toggle 'has-saved' on the parent property-card to easily filter it via CSS later
            const propertyCard = saveBtn.closest('.property-card');
            propertyCard.classList.toggle('has-saved', isSaved);

            // Update count
            if (isSaved) {
                savedCount++;
            } else {
                savedCount--;
            }

            updateSavedBadge();

            // if we are currently looking at the saved properties, we might want to hide it immediately if unsubscribed
            if (isShowingSaved && !isSaved) {
                propertyCard.style.display = 'none';
            }

            // tiny pop animation on the button itself
            saveBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                saveBtn.style.transform = '';
            }, 150);
        });
    });

    function updateSavedBadge() {
        savedCountBadge.textContent = savedCount;

        if (savedCount > 0) {
            savedCountBadge.classList.remove('hidden');

            // Pop animation on the badge
            savedCountBadge.style.transform = 'scale(1.3)';
            setTimeout(() => {
                savedCountBadge.style.transform = '';
            }, 200);
        } else {
            savedCountBadge.classList.add('hidden');
        }
    }

    // Toggle showing only saved properties
    savedLink.addEventListener('click', (e) => {
        e.preventDefault();

        isShowingSaved = true;

        // Update UI state
        homeLink.classList.remove('active');
        savedLink.classList.add('active');
        sectionTitle.textContent = 'Saved Properties';
        searchSection.style.display = 'none'; // hide the search while in saved view

        // Filter the grid
        document.querySelectorAll('.property-card').forEach(card => {
            if (card.classList.contains('has-saved')) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Handle empty state gracefully
        if (savedCount === 0) {
            sectionTitle.textContent = "You haven't saved any properties yet.";
        }
    });

    // Go back to Home / Properties
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            if (isShowingSaved) {
                e.preventDefault();

                isShowingSaved = false;

                // Update UI state
                savedLink.classList.remove('active');
                homeLink.classList.add('active');
                if (window.location.pathname.includes('apartments')) {
                    sectionTitle.textContent = 'Ahmedabad Apartments';
                } else {
                    sectionTitle.textContent = 'Featured Properties';
                }

                if (searchSection) {
                    searchSection.style.display = 'block';
                }

                // Show all cards
                document.querySelectorAll('.property-card').forEach(card => {
                    card.style.display = 'block';
                });
            }
        });
    }

    // Modal logic
    const propertyModal = document.getElementById('property-modal');
    const authModal = document.getElementById('auth-modal');
    const propClose = document.getElementById('prop-close');

    const pathUrl = window.location.pathname;
    const citiesLoc = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
    const isSub = citiesLoc.some(c => pathUrl.includes('/' + c + '/'));
    const profileHref = isSub ? '../tenant-profile.html' : 'tenant-profile.html';

    const navAuthDiv = document.querySelector('.nav-auth');
    if (navAuthDiv) {
        const isTenantLoggedIn = localStorage.getItem('tenantLoggedIn') === 'true';
        if (isTenantLoggedIn) {
            let userAvatarStr = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
            const profileDataStr = localStorage.getItem('tenantProfile');
            if (profileDataStr) {
                try {
                    const profileData = JSON.parse(profileDataStr);
                    if (profileData.avatar) {
                        userAvatarStr = profileData.avatar;
                    }
                } catch (e) { }
            }
            navAuthDiv.innerHTML = `
                <a href="${profileHref}" aria-label="Tenant Profile">
                    <div class="user-avatar"
                        style="width: 35px; height: 35px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid var(--primary-color);">
                        <img src="${userAvatarStr}"
                            alt="User" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                </a>
            `;
        } else {
            navAuthDiv.innerHTML = `
                <button class="btn-outline auth-trigger" style="padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; font-size: 0.9rem;" onclick="window.location.href='${isSub ? '../tenant-login.html' : 'tenant-login.html'}'">Log In / Sign Up</button>
            `;
        }
    }

    const viewButtons = document.querySelectorAll('.btn-outline');
    const authTriggers = document.querySelectorAll('.auth-trigger');
    const navAuthButtons = document.querySelectorAll('.nav-auth button');

    // Open property modal
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.property-card');
            if (card) {
                const title = card.querySelector('h3').textContent;
                const loc = card.querySelector('.location').textContent;
                const bgImage = card.querySelector('.property-image').style.backgroundImage;
                const ownerName = card.getAttribute('data-owner-name') || 'Property Owner';
                const ownerAvatar = card.getAttribute('data-owner-avatar') || 'https://i.pravatar.cc/150?img=11';

                // Extract URL from background-image: url('...');
                let urlMatch = bgImage.match(/url\(["']?([^"']*)["']?\)/);
                let url = urlMatch ? urlMatch[1] : '';

                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-loc').textContent = loc;
                if (url) {
                    document.getElementById('modal-main-img').src = url;
                }

                // Dynamically update modal listing type based on price display
                const priceText = card.querySelector('.price').textContent.toLowerCase();
                const listingTypeText = priceText.includes('/mo') ? 'For Rent' : 'For Sale';
                const modalListingType = document.getElementById('modal-listing-type');
                if (modalListingType) {
                    modalListingType.textContent = listingTypeText;
                    if (listingTypeText === 'For Sale') {
                        modalListingType.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                        modalListingType.style.color = '#2ecc71';
                    } else {
                        modalListingType.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                        modalListingType.style.color = '#3498db';
                    }
                }

                // Update owner details
                document.querySelector('.owner-name').textContent = ownerName;
                document.querySelector('.owner-avatar img').src = ownerAvatar;

                propertyModal.classList.remove('hidden');
            }
        });
    });

    // Close property modal
    if (propClose) {
        propClose.addEventListener('click', () => {
            propertyModal.classList.add('hidden');
        });
    }

    // Open auth modal / Handle booking if logged in
    const openAuthModal = (e) => {
        e.preventDefault();

        const isLoggedIn = localStorage.getItem('tenantLoggedIn') === 'true';

        if (isLoggedIn) {
            const btn = e.currentTarget;
            if (btn.classList.contains('btn-book')) {
                const ownerName = document.querySelector('.owner-name').textContent || 'the property owner';
                const propertyTitle = document.getElementById('modal-title').textContent || 'Property';
                const propertyLoc = document.getElementById('modal-loc').textContent || 'Location';
                const propertyImage = document.getElementById('modal-main-img').src;

                // Save to bookings
                let bookings = JSON.parse(localStorage.getItem('ownerBookings') || '[]');
                bookings.push({
                    id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
                    ownerName: ownerName,
                    propertyTitle: propertyTitle,
                    propertyLoc: propertyLoc,
                    propertyImage: propertyImage,
                    tenantProfile: JSON.parse(localStorage.getItem('tenantProfile') || '{}'),
                    date: new Date().toISOString(),
                    status: 'Pending Owner'
                });
                localStorage.setItem('ownerBookings', JSON.stringify(bookings));

                alert(`Booking request successfully sent to ${ownerName}! They will review it shortly.`);

                // Close modal
                const modal = document.getElementById('property-modal');
                if (modal) modal.classList.add('hidden');
                return;
            } else if (btn.closest('.message-icon') || btn.classList.contains('message-icon')) {
                const ownerName = document.querySelector('.owner-name').textContent || 'Property Owner';
                const ownerAvatar = document.querySelector('.owner-avatar img').src;
                const ownerId = ownerName.replace(/\s+/g, '-').toLowerCase();

                // Save to local storage for chat
                let chats = JSON.parse(localStorage.getItem('tenantChats') || '[]');

                // Only push if not already exists
                if (!chats.find(c => c.id === ownerId)) {
                    chats.push({
                        id: ownerId,
                        name: ownerName,
                        avatar: ownerAvatar,
                        messages: []
                    });
                    localStorage.setItem('tenantChats', JSON.stringify(chats));
                }

                // Redirect to chat
                const citiesList = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
                const isSubdir = citiesList.some(c => window.location.pathname.includes('/' + c + '/'));
                window.location.href = isSubdir ? `../tenant-chat.html?owner=${ownerId}` : `tenant-chat.html?owner=${ownerId}`;
                return;
            }
        }

        const citiesList = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
        const isSubdir = citiesList.some(c => window.location.pathname.includes('/' + c + '/'));
        window.location.href = isSubdir ? '../tenant-login.html' : 'tenant-login.html';
    };

    authTriggers.forEach(btn => btn.addEventListener('click', openAuthModal));
    navAuthButtons.forEach(btn => btn.addEventListener('click', openAuthModal));

    // Close property modal if user clicks outside
    window.addEventListener('click', (e) => {
        if (propertyModal && e.target === propertyModal) {
            propertyModal.classList.add('hidden');
        }
    });

                                                                        // Handle search redirection
    const searchBtn = document.querySelector('.btn-search');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const loc = document.getElementById('location')?.value;
            let type = document.getElementById('property-type')?.value;
            
            if (!type) {
                const urlPath = window.location.pathname.toLowerCase();
                if (urlPath.includes('pg.html')) type = 'pg';
                else if (urlPath.includes('house.html')) type = 'house';
                else if (urlPath.includes('villa.html')) type = 'villa';
                else if (urlPath.includes('apartments.html')) type = 'apartment';
            }

            if (loc && (type === 'apartment' || type === 'pg' || type === 'house' || type === 'villa')) {
                const cities = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];
                if (cities.includes(loc)) {
                    const currentPath = window.location.pathname;
                    let targetFile = 'apartments.html';
                    if (type === 'pg') targetFile = 'pg.html';
                    if (type === 'house') targetFile = 'house.html';
                    if (type === 'villa') targetFile = 'villa.html';
                    
                    if (cities.some(c => currentPath.includes('/' + c + '/'))) {
                         if (currentPath.includes('/' + loc + '/')) {
                             window.location.href = targetFile;
                         } else {
                             window.location.href = '../' + loc + '/' + targetFile;
                         }
                    } else {
                         window.location.href = loc + '/' + targetFile;
                    }
                } else {
                    alert('Location missing. Select a valid city.');
                }
            } else {
                alert('No properties found for this specific filter in this demo. Try Apartment, PG, House, or Villa.');
            }
        });
    }

});