import { push, ref, set } from "firebase/database";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { database } from "../components/fire";
import Layout from "../components/Layout";
import { Button } from "../components/Button";
import { useAppContext } from "../components/AppState/appState";
import { TextInput, useTextInput } from "components/TextInput";

const Home: NextPage = () => {
  const {
    state: { user },
  } = useAppContext();
  const router = useRouter();

  const [creating, setCreating] = useState(false);
  const textInput = useTextInput("");

  const createHealthcheck = useCallback(
    async (label: string) => {
      if (!user) return;
      setCreating(true);
      const newHealthcheck = push(ref(database, "healthchecks"));

      await set(newHealthcheck, {
        meta: {
          label,
          current: -1,
          locked: true,
        },
        adminId: user.uid,
        participants: {},
      });

      router.push(`/admin/${newHealthcheck.key}`);
    },
    [router, user]
  );

  const name = useMemo(() => {
    if (!user) return "";
    return user.displayName ? user.displayName : user.email?.split("@")[0];
  }, [user]);

  return (
    <Layout>
      {user && <p className="p-5">👋 {name}</p>}

      <TextInput type={"text"} {...textInput} placeholder="title ..." />
      <Button
        $emph
        $disabled={creating}
        className="mt-4"
        onClick={() => createHealthcheck(textInput.value)}
      >
        Create a healthcheck
      </Button>
    </Layout>
  );
};

export default Home;
