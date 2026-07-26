import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';
import { UserProfile, UserRole } from '../types';

/**
 * Creates or ensures user profile document in Cloud Firestore
 */
export const syncUserProfile = async (user: FirebaseUser, defaultRole: UserRole = 'employee', department: string = 'Engineering'): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existing = userSnap.data() as UserProfile;
    // Update online status and lastSeen timestamp
    await setDoc(userRef, {
      online: true,
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return existing;
  } else {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      fullName: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      role: defaultRole,
      department: department,
      online: true,
      lastSeen: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(userRef, newUserProfile);
    return newUserProfile;
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(res.user);
  return res;
};

export const registerWithEmail = async (email: string, pass: string, fullName: string, role: UserRole = 'employee', department: string = 'Engineering') => {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  if (res.user) {
    await firebaseUpdateProfile(res.user, {
      displayName: fullName,
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`
    });
    await syncUserProfile(res.user, role, department);
  }
  return res;
};

export const loginWithGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(res.user);
  return res;
};

export const resetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const logoutUser = async () => {
  if (auth.currentUser) {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await setDoc(userRef, {
      online: false,
      lastSeen: serverTimestamp()
    }, { merge: true }).catch(() => {});
  }
  return await firebaseSignOut(auth);
};
