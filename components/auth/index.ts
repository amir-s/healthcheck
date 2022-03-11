import { GithubAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../fire";

async function toggleSignIn() {
  if (auth.currentUser) {
    return auth.signOut();
  }

  try {
    const result = await signInWithPopup(auth, new GithubAuthProvider());
  } catch (error: any) {}
}

const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // setPersistence(auth, browserSessionPersistence);
    auth.onAuthStateChanged((user) => {
      if (!user) return setUser(null);
      setUser({
        ...user,
        displayName: user.displayName || user.email,
      });
    });
  }, []);

  return { user, toggleSignIn };
};

export { useAuthentication };
