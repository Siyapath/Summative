import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig"; 

export async function saveUserToFirestore(userId: string, userData: Record<string, any>) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    console.log("User saved to Firestore:", userId);
  } catch (error) {
    console.error("Failed to save user:", error);
  }
}