import { auth, db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const complaintForm = document.getElementById('complaint-form');
const fileInput = document.getElementById('evidence-upload');

if (complaintForm) {
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const locationStr = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const isAnonymous = document.getElementById('anonymous').checked;
        
        // Premium ID Generation: TS-YYYY-RANDOM
        const year = new Date().getFullYear();
        const randomPart = Math.random().toString(36).substr(2, 6).toUpperCase();
        const complaintId = `TS-${year}-${randomPart}`;
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Processing...';
        lucide.createIcons();
        
        try {
            let evidenceUrls = [];
            
            // Upload Evidence if any
            if (fileInput.files.length > 0) {
                for (const file of fileInput.files) {
                    const storageRef = ref(storage, `complaints/${complaintId}/${file.name}`);
                    const snapshot = await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(snapshot.ref);
                    evidenceUrls.push(url);
                }
            }

            // Save to Firestore
            await addDoc(collection(db, "complaints"), {
                complaintId: complaintId,
                uid: user ? user.uid : 'Guest',
                email: user ? user.email : 'Guest',
                userName: user ? (user.displayName || 'Citizen') : 'Guest',
                title: title,
                category: category,
                location: locationStr,
                description: description,
                evidence: evidenceUrls,
                status: "Submitted",
                createdAt: serverTimestamp(),
                isAnonymous: isAnonymous
            });

            alert(`Official Complaint Registered Successfully!\n\nYour Case ID: ${complaintId}\nPlease save this for future tracking.`);
            window.location.href = `track.html?id=${complaintId}`;
            
        } catch (error) {
            console.error("Error submitting complaint: ", error);
            alert("Submission failed: " + error.message);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            lucide.createIcons();
        }
    });
}
