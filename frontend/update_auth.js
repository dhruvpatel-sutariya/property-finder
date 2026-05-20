
const fs = require('fs');
const path = require('path');

const newAuthModal = `    <!-- Auth Modal -->
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
    </div>`;

function replaceAuthModal(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // RegExp to replace from <!-- Auth Modal --> to the end of the div
    const pattern = /<!-- Auth Modal -->[\s\S]*?(?=<script src="|\s*<\/body>)/;

    if (pattern.test(content)) {
        content = content.replace(pattern, newAuthModal + '\n\n    ');
        fs.writeFileSync(filePath, content);
    }
}

function processDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (['ahmedabad', 'surat', 'jamnagar', 'mehsana', 'gandhinagar', 'rajkot', 'bhavnagar'].includes(file)) {
                processDirectory(fullPath);
            }
        } else if (fullPath.endsWith('.html') && !fullPath.includes('owner-') && !fullPath.includes('tenant-profile')) {
            replaceAuthModal(fullPath);
        } else if (fullPath.endsWith('generate_villas.js') || fullPath.endsWith('generate_houses.js') || fullPath.endsWith('generate_pgs.js')) {
            replaceAuthModal(fullPath);
        }
    });
}

const rootDir = __dirname;
processDirectory(rootDir);
