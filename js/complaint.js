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
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const isAnonymous = document.getElementById('anonymous').checked;
        
        const complaintId = 'TS' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
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
            const docRef = await addDoc(collection(db, "complaints"), {
                complaintId: complaintId,
                uid: isAnonymous ? null : (user ? user.uid : 'Guest'),
                email: isAnonymous ? null : (user ? user.email : 'Guest'),
                title: title,
                category: category,
                location: location,
                description: description,
                evidence: evidenceUrls,
                status: "Submitted",
                createdAt: serverTimestamp(),
                isAnonymous: isAnonymous
            });

            console.log("Complaint saved with ID: ", docRef.id);
            alert(`Complaint Submitted! ID: ${complaintId}`);
            window.location.href = `track.html?id=${complaintId}`;
            
        } catch (error) {
            console.error("Error submitting complaint: ", error);
            alert("Submission failed: " + error.message);
        }
    });
}
