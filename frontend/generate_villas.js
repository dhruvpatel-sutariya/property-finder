const fs = require('fs');
const path = require('path');

const baseHtml = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{CITY_CAP}} Villas - Property Finder</title>
    <link rel="stylesheet" href="../tenant-styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="brand-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <a href="../index.html" style="text-decoration:none; color:inherit;"><h2>Property Finder</h2></a>
        </div>
        <div class="nav-links">
            <a href="../tenant-home.html" class="nav-link active">Home</a>
            <a href="../tenant-chat.html" class="nav-link">Chat</a>
            <a href="#" class="nav-link saved-link">Saved <span class="badge-count hidden" id="saved-count">0</span></a>
        </div>
        <div class="nav-auth">
            <button class="btn-ghost auth-trigger">Log In</button>
            <button class="btn-solid auth-trigger">Sign Up</button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Search & Filter Section -->
        <section class="search-section">
            <div class="search-header">
                <h1>Villas in {{CITY_CAP}}</h1>
                <p>Discover luxurious and spacious villas in your selected area.</p>
            </div>

            <div class="filter-bar">
                <div class="filter-group">
                    <label for="location">Location</label>
                    <select id="location" class="filter-select">
                        <option value="">Any Location</option>
                        <option value="ahmedabad" {{ahmedabad_selected}}>Ahmedabad</option>
                        <option value="gandhinagar" {{gandhinagar_selected}}>Gandhinagar</option>
                        <option value="surat" {{surat_selected}}>Surat</option>
                        <option value="rajkot" {{rajkot_selected}}>Rajkot</option>
                        <option value="jamnagar" {{jamnagar_selected}}>Jamnagar</option>
                        <option value="bhavnagar" {{bhavnagar_selected}}>Bhavnagar</option>
                        <option value="mehsana" {{mehsana_selected}}>Mehsana</option>
                    </select>
                </div>



                <div class="separator"></div>

                <div class="filter-group">
                    <label for="price">Price Range</label>
                    <select id="price" class="filter-select">
                        <option value="">Any Price</option>
                        <option value="0-10000">Under ₹10,000</option>
                        <option value="10000-25000">₹10,000 - ₹25,000</option>
                        <option value="25000-50000">₹25,000 - ₹50,000</option>
                        <option value="50000+">₹50,000+</option>
                    </select>
                </div>

                <div class="separator"></div>

                <div class="filter-group">
                    <label for="bedrooms">Bedrooms</label>
                    <select id="bedrooms" class="filter-select">
                        <option value="">Any Beds</option>
                        <option value="1bhk">1 BHK</option>
                        <option value="2bhk">2 BHK</option>
                        <option value="3bhk">3 BHK</option>
                        <option value="4bhk">4+ BHK</option>
                    </select>
                </div>

                <button class="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search
                </button>
            </div>
        </section>

        <!-- Properties Grid Section -->
        <section class="properties-section">
            <h2 class="section-title">{{CITY_CAP}} Villas</h2>
            <div class="properties-grid">
                
                <!-- Villa 1 -->
                <div class="property-card" data-owner-name="Arjun Mehta" data-owner-avatar="https://i.pravatar.cc/150?u=12">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                        <span class="badge">Featured</span>
                    </div>
                    <div class="property-details">
                        <div class="price">₹1,50,000<span>/mo</span></div>
                        <h3>The Grand Imperial Villa</h3>
                        <p class="location">VIP Road, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 5500 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Private Pool</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>

                <!-- Villa 2 -->
                <div class="property-card" data-owner-name="Rakesh Joshi" data-owner-avatar="https://i.pravatar.cc/150?u=13">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                    </div>
                    <div class="property-details">
                        <div class="price">₹95,000<span>/mo</span></div>
                        <h3>Oasis Garden Retreat</h3>
                        <p class="location">Green Valley, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 4200 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> Garden</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>

                <!-- Villa 3 -->
                <div class="property-card" data-owner-name="Sunil Dutt" data-owner-avatar="https://i.pravatar.cc/150?u=14">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1613490908653-b95dafebfc21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                        <span class="badge">New</span>
                    </div>
                    <div class="property-details">
                        <div class="price">₹1,20,000<span>/mo</span></div>
                        <h3>Silver Crest Estate</h3>
                        <p class="location">Hillsview, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 4800 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg> 24/7 Security</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>

                 <!-- Villa 4 -->
                <div class="property-card" data-owner-name="Neha Patel" data-owner-avatar="https://i.pravatar.cc/150?u=15">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                    </div>
                    <div class="property-details">
                        <div class="price">₹1,80,000<span>/mo</span></div>
                        <h3>The Golden Manor</h3>
                        <p class="location">Heritage Road, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 6 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 6500 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Private Theater</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>
                
                 <!-- Villa 5 -->
                <div class="property-card" data-owner-name="Kabir Singh" data-owner-avatar="https://i.pravatar.cc/150?u=11">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                    </div>
                    <div class="property-details">
                        <div class="price">₹85,000<span>/mo</span></div>
                        <h3>Whispering Pines Villa</h3>
                        <p class="location">Ring Road, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 3 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 3200 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg> Smart Home</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>
                
                 <!-- Villa 6 -->
                <div class="property-card" data-owner-name="Sneha Desai" data-owner-avatar="https://i.pravatar.cc/150?u=18">
                    <div class="property-image"
                        style="background-image: url('https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');">
                    </div>
                    <div class="property-details">
                        <div class="price">₹1,10,000<span>/mo</span></div>
                        <h3>Crystal Waters Mansion</h3>
                        <p class="location">Lakeview, {{CITY_CAP}}</p>
                        <div class="amenities">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 4 BHK</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 4500 sqft</span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> Lake View</span>
                        </div>
                        <button class="btn-outline">View Contact</button>
                    </div>
                </div>

            </div>
        </section>
    </main>

    <!-- Property Details Modal -->
    <div id="property-modal" class="modal-overlay hidden">
        <div class="modal-content property-modal-content">
            <button class="modal-close" id="prop-close" aria-label="Close modal">&times;</button>
            <div class="modal-body">
                <div class="property-images-gallery">
                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Main Property" class="main-gallery-img" id="modal-main-img">
                    <div class="gallery-thumbnails">
                        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Thumbnail 1">
                        <img src="https://images.unsplash.com/photo-1613490908653-b95dafebfc21?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Thumbnail 2">
                        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Thumbnail 3">
                    </div>
                </div>
                <div class="property-modal-details">
                    <h2 class="modal-title" id="modal-title">Property Title</h2>
                    <p class="modal-location" id="modal-loc">Property Location</p>
                    <span id="modal-listing-type" style="display:inline-block; margin-top:0.5rem; padding:0.2rem 0.6rem; font-size:0.85rem; font-weight:600; border-radius:4px;">For Rent</span>
                    <div class="modal-amenities">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> 5 BHK</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> 5500 sqft</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> Private Pool</span>
                    </div>
                    <div class="modal-description">
                        <h3>About this property</h3>
                        <p>Enjoy the pinnacle of luxury living in this exquisite standalone villa. Featuring expansive living areas, premium finishes, a private garden, and top-tier security. Ideal for families seeking comfort and exclusivity.</p>
                    </div>
                    <div class="owner-section">
                        <div class="owner-info">
                            <div class="owner-avatar">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Owner">
                            </div>
                            <div class="owner-details">
                                <span class="owner-label">Property Owner</span>
                                <h4 class="owner-name">Ramesh Patel</h4>
                            </div>
                        </div>
                        <div class="owner-actions">
                            <button class="action-icon call-icon" aria-label="Call Owner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </button>
                            <button class="action-icon message-icon auth-trigger" aria-label="Message Owner">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                    <button class="btn-solid btn-book auth-trigger" style="width: 100%; margin-top: 1.5rem; padding: 0.8rem; font-size: 1.1rem;">Book Now</button>
                </div>
            </div>
        </div>
    </div>

                <!-- Auth Modal -->
    <div id="auth-modal" class="modal-overlay hidden">
        <div class="modal-content auth-modal-content" style="max-width: 650px; width: 90%; max-height: 90vh; overflow-y: auto;">
            <button class="modal-close auth-close" aria-label="Close modal">&times;</button>
            <div class="auth-header">
                <h2>Welcome</h2>
                <p>Log in or sign up to continue</p>
                <div class="auth-tabs" style="display: flex; gap: 1rem; margin-top: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
                    <button class="auth-tab active" id="tab-login" style="background:none; border:none; color: var(--primary-color); font-weight: 600; font-size: 1.1rem; cursor: pointer;">Log In</button>
                    <button class="auth-tab" id="tab-signup" style="background:none; border:none; color: var(--text-muted); font-size: 1.1rem; cursor: pointer;">Sign Up</button>
                </div>
            </div>
            
            <!-- Login Form -->
            <form id="form-login" class="auth-form">
                <div class="form-group">
                    <label for="login-email">Email Address</label>
                    <input type="email" id="login-email" placeholder="Enter your email" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-top:1rem;">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" placeholder="Enter your password" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                </div>
                <button type="submit" class="btn-solid" style="width: 100%; padding: 0.8rem; font-size: 1.1rem; margin-top: 1.5rem;">Log In</button>
            </form>

            <!-- Signup Form -->
            <form id="form-signup" class="auth-form hidden">
                <div id="signup-step-1">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label for="signup-name">Full Name</label>
                            <input type="text" id="signup-name" placeholder="John Doe" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" placeholder="john@example.com" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div class="form-group">
                            <label for="signup-phone">Phone Number</label>
                            <input type="tel" id="signup-phone" placeholder="+91 9876543210" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div class="form-group">
                            <label for="signup-dob">Date of Birth</label>
                            <input type="date" id="signup-dob" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="signup-occupation">Occupation</label>
                        <input type="text" id="signup-occupation" placeholder="e.g. Software Engineer" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                    </div>
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="signup-address">Current Address</label>
                        <textarea id="signup-address" rows="2" placeholder="Your current full address" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;"></textarea>
                    </div>

                    <h3 style="margin: 1.5rem 0 1rem 0; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; color: var(--text-light);">Rental Preferences</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label for="signup-locations">Preferred Locations</label>
                            <input type="text" id="signup-locations" placeholder="e.g. Ahmedabad, Surat" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div class="form-group">
                            <label for="signup-type">Property Types</label>
                            <select id="signup-type" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                                <option value="">Select Type</option>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="villa">Villa</option>
                                <option value="pg">PG</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="signup-budget">Monthly Budget (₹)</label>
                            <input type="number" id="signup-budget" placeholder="e.g. 15000" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                        <div class="form-group">
                            <label for="signup-movein">Move in by (Days)</label>
                            <input type="number" id="signup-movein" placeholder="e.g. 15" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 1rem;">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" placeholder="Create a password" required style="width: 100%; padding: 0.8rem 1rem; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: var(--surface-color); color: var(--text-light); font-family: inherit; font-size: 1rem; box-sizing: border-box;">
                    </div>

                    <button type="button" id="btn-next-step" class="btn-solid" style="width: 100%; padding: 0.8rem; font-size: 1.1rem; margin-top: 1.5rem;">Next Step</button>
                </div>
                
                <div id="signup-step-2" class="hidden">
                    <h3 style="margin: 1.5rem 0 1rem 0; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; color: var(--text-light);">Upload Profile Picture</h3>
                    <div class="form-group" style="text-align: center; margin: 2rem 0;">
                        <label for="signup-avatar" style="cursor: pointer; display: inline-block; width: 120px; height: 120px; border-radius: 50%; border: 2px dashed rgba(255,255,255,0.3); overflow: hidden; position: relative;">
                            <img id="avatar-preview" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 0.8rem; padding: 0.2rem 0;">Upload</div>
                        </label>
                        <input type="file" id="signup-avatar" accept="image/*" style="display: none;">
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                        <button type="button" id="btn-prev-step" class="btn-outline" style="flex: 1; padding: 0.8rem; font-size: 1.1rem;">Back</button>
                        <button type="submit" class="btn-solid" style="flex: 1; padding: 0.8rem; font-size: 1.1rem;">Create Account</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script src="../tenant-script.js"></script>
</body>
</html>`;

const cities = ['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'];

cities.forEach(city => {
    const CityName = city.charAt(0).toUpperCase() + city.slice(1);

    let content = baseHtml.replace(/\{\{CITY_CAP\}\}/g, CityName);

    // Set selected city
    content = content.replace(/\{\{[a-z]+_selected\}\}/g, (match) => {
        if (match === `{{${city}_selected}}`) return 'selected';
        return '';
    });

    const dir = path.join(__dirname, city);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'villa.html'), content);
    console.log(`Created ${city}/villa.html`);
});