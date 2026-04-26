import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Select the login/dashboard button in the navbar
    const authNavItem = document.querySelector('.nav-links a[href="auth.html"], .nav-links a[href="dashboard.html"].btn-outline, .nav-links a.btn-outline');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Global Auth: User is logged in", user.email);
            // If logged in, change the Login button to Dashboard
            if (authNavItem) {
                authNavItem.href = "dashboard.html";
                authNavItem.innerHTML = '<i data-lucide="user"></i> Dashboard';
                if(window.lucide) window.lucide.createIcons();
            }
        } else {
            console.log("Global Auth: No user");
            if (authNavItem && authNavItem.innerText.includes('Dashboard')) {
                authNavItem.href = "auth.html";
                authNavItem.innerText = "Login";
            }
        }
    });

    // Handle logout functionality if a logout button exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }
});
