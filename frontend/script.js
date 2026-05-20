document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.role-card');
    const actionContainer = document.getElementById('action-container');
    const getStartedBtn = document.getElementById('get-started-btn');
    let selectedRole = null;

    
    fetch("http://localhost:5000/api/properties")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert("Signup successful"); // works here ✅
        });

    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove active class from all
            cards.forEach(c => c.classList.remove('active'));

            // Add active class to clicked card
            this.classList.add('active');
            selectedRole = this.querySelector('h2').innerText;

            // Add a click animation effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // Show 'Get Started' button
            actionContainer.classList.remove('hidden');
            actionContainer.classList.add('visible');
        });
    });

    getStartedBtn.addEventListener('click', () => {
        if (selectedRole === 'Tenant') {
            window.location.href = 'tenant-login.html';
        } else if (selectedRole === 'Owner') {
            window.location.href = 'owner-login.html';
        } else if (selectedRole === 'Admin') {
            window.location.href = 'admin-login.html';
        }
    });
});