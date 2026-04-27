import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const authForm = document.getElementById('auth-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const forgotPasswordBtn = document.getElementById('forgot-password');

let isLoginMode = true;

// Track Mode (Sync with HTML toggle)
const toggleAuth = document.getElementById('toggle-auth');
if (toggleAuth) {
    toggleAuth.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
    });
}

// Email/Password Auth
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            let userCredential;
            if (isLoginMode) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Login success");
            } else {
                const fullName = document.getElementById('full-name').value;
                const phone = document.getElementById('phone').value;
                
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("Signup success");
                
                // Store extra user details in Firestore
                await storeUserData(userCredential.user, {
                    displayName: fullName,
                    phoneNumber: phone
                });
            }
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Auth Error:", error.code, error.message);
            handleAuthError(error);
        }
    });
}

// Google Sign-In
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Store user details if they don't exist
            await storeUserData(result.user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Google Auth Error:", error.code, error.message);
            handleAuthError(error);
        }
    });
}

// Forgot Password
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) {
            alert("Please enter your email address first.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset link sent to your email!");
        } catch (error) {
            handleAuthError(error);
        }
    });
}

async function storeUserData(user, extraData = {}) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: extraData.displayName || user.displayName || '',
                phoneNumber: extraData.phoneNumber || user.phoneNumber || '',
                createdAt: serverTimestamp(),
                role: 'citizen',
                profileComplete: !!extraData.displayName
            });
            console.log("User data stored in Firestore.");
        }
    } catch (e) {
        console.error("Error storing user data:", e);
    }
}

// Unified Error Handling for Firebase
function handleAuthError(error) {
    let message = "An error occurred during authentication.";
    
    switch (error.code) {
        case 'auth/invalid-credential':
            message = "Invalid email or password. Please try again.";
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
        case 'auth/weak-password':
            message = "Password should be at least 6 characters.";
            break;
        default:
            message = error.message;
    }
    
    alert(message);
}

