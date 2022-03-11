import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../fire";

function useRealtimeValue<T>(path: string) {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    const reference = ref(database, path);

    const cancel = onValue(reference, (snapshot) => {
      if (!snapshot.exists()) return setValue(null);
      setValue(snapshot.val());
    });

    return () => cancel();
  }, [path]);

  return value;
}

export { useRealtimeValue };
