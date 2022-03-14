import { User } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuthentication } from "../auth";
import { database } from "../fire";
import tw from "tailwind-styled-components";
import { Button } from "../Button";
import { AppStateActions, useAppContext } from "../AppState/appState";

const Container = tw.div`
  flex flex-col
  w-screen
  flex-1
  md:w-full md:h-full
  md:min-w-[768px] md:max-w-[1024px]
  lg:min-w-[1024px] lg:max-w-[1024px]
`;

const Content = tw.div<{ $full?: boolean; $stretch?: boolean }>`
  flex flex-col flex-1
  md:w-full md:h-full md:rounded-xl items-center
  p-3 md:p-8
  shadow-xl
  bg-fillPrimary
  text-white
  ${(p) => (p.$stretch ? "justify-between" : p.$full ? "" : "justify-center")}
`;

const Header = tw.div`
  flex
  justify-between
  items-strech
  p-2
  m-0 md:mb-2
  h-16
  border-secondary
  text-white
`;

const Avatar = tw.img`
  h-12
  w-12
  rounded-full
  object-cover
  cursor-pointer
`;

const LoginButton = tw(Button)`
  mt-10
`;

const setupInitialDB = async (user: User) => {
  try {
    set(ref(database, `users/${user.uid}`), {
      displayName: user.displayName || user.email,
      email: user.email,
      photoURL: user.photoURL,
    });
  } catch (error) {
    console.error(error);
  }
};

export interface Props {
  title?: string;
  children: React.ReactNode;
  full?: boolean;
  stretch?: boolean;
}

const Layout = ({ children, title, full, stretch }: Props) => {
  const { dispatch } = useAppContext();
  const [showUserControls, setShowUserControls] = useState(false);
  const { user, toggleSignIn } = useAuthentication();

  useEffect(() => {
    setShowUserControls(false);
    if (!user) {
      dispatch({ type: AppStateActions.setUser, payload: null });
      return;
    }
    dispatch({ type: AppStateActions.setUser, payload: user });
    setupInitialDB(user);
  }, [dispatch, user]);

  return (
    <Container>
      <Header>
        {showUserControls ? (
          <Button onClick={toggleSignIn}>Sign out</Button>
        ) : (
          <p className="flex self-center text-xl">{title || "Healthcheck"}</p>
        )}
        {user && user.photoURL && (
          <Avatar
            src={user.photoURL}
            onClick={() => setShowUserControls((show) => !show)}
          />
        )}
      </Header>
      <Content $full={full} $stretch={stretch}>
        {!user ? (
          <>
            <p className="text-center">Login for a 100% chance of getting a</p>
            <h1>🍪</h1>
            <LoginButton $emph onClick={toggleSignIn}>
              Login with Github
            </LoginButton>
          </>
        ) : (
          children
        )}
      </Content>
    </Container>
  );
};

export default Layout;
