import { push, ref, set } from "firebase/database";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
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

  const textInput = useTextInput("");

  const createHealthcheck = (label: string) => {
    if (!user) return;
    const newHealthcheck = push(ref(database, "healthchecks"));

    set(newHealthcheck, {
      meta: {
        label,
        current: -1,
        locked: true,
      },
      adminId: user.uid,
      participants: {},
    });

    // set(
    //   ref(database, `users/${user.uid}/healthchecks/${newHealthcheck.key}`),
    //   true
    // );

    router.push(`/admin/${newHealthcheck.key}`);
  };

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
        className="mt-10"
        onClick={() => createHealthcheck(textInput.value)}
      >
        Create a healthcheck
      </Button>
    </Layout>
  );
};

export default Home;
