import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const toggleAuth = document.getElementById('toggle-auth');
const authTitle = document.getElementById('auth-title');
const submitBtn = document.querySelector('button[type="submit"]');

let isLoginMode = true;

// Handle UI Toggle & Mode Sync
if (toggleAuth) {
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        
        // Update UI
        authTitle.innerText = isLoginMode ? 'Secure Citizen Login' : 'Create New Account';
        submitBtn.innerText = isLoginMode ? 'Sign In' : 'Create Account';
        toggleAuth.innerText = isLoginMode ? 'Create Account' : 'Sign In';
    });
}

// Email/Password Auth
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (password.length < 6) {
            alert("Password should be at least 6 characters.");
            return;
        }

        try {
            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Login success");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log("Signup success");
            }
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Auth Error:", error.code, error.message);
            handleAuthError(error);
        }
    });
}

// Unified Error Handling for Firebase
function handleAuthError(error) {
    let message = "An error occurred during authentication.";
    
    switch (error.code) {
        case 'auth/configuration-not-found':
            message = "Firebase Configuration Error: Please ensure 'Email/Password' sign-in method is enabled in your Firebase Console (Authentication > Sign-in method).";
            break;
        case 'auth/invalid-api-key':
            message = "Invalid API Key: Please check your firebase-config.js file.";
            break;
        case 'auth/network-request-failed':
            message = "Network error: Please check your internet connection.";
            break;
        case 'auth/user-not-found':
            message = "No user found with this email.";
            break;
        case 'auth/wrong-password':
            message = "Incorrect password.";
            break;
        case 'auth/email-already-in-use':
            message = "This email is already registered. Try signing in.";
            break;
        default:
            message = error.message;
    }
    
    alert(message);
}

// Check Session
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop();
    if (user) {
        if (currentPage === 'auth.html') window.location.href = 'dashboard.html';
    } else {
        if (['dashboard.html', 'complaint.html', 'admin.html'].includes(currentPage)) {
            // Protected routes
            // window.location.href = 'auth.html';
        }
    }
});
