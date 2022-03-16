import { ref, set } from "firebase/database";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "components/AppState";
import { database } from "components/fire";
import { useRealtimeValue } from "components/realtime";
import Layout from "components/Layout";
import { QUESTIONS } from "components/Questions";
import { VOTE_COLOURS } from "components/VoteColours";
import {
  Item,
  ItemTitle,
  ItemSubtitle,
  VoteContainer,
  SelectedVote,
  SelectedReaction,
  ReactionContainer,
  Reaction,
  BottomContainer,
  VoteIndicator,
} from "./elements";

const Vote = ({
  vote,
  onClick,
  type,
}: {
  vote: 1 | 2 | 3;
  onClick: (id: 1 | 2 | 3) => unknown;
  type?: "first" | "last";
}) => {
  return (
    <VoteIndicator
      onClick={() => onClick(vote)}
      style={{ backgroundColor: VOTE_COLOURS[vote] }}
      $first={type === "first"}
      $last={type === "last"}
    ></VoteIndicator>
  );
};

const VotePage = () => {
  const {
    state: { user },
  } = useAppContext();

  const [vote, setVote] = useState<-1 | 1 | 2 | 3>(-1);
  const [reaction, setReaction] = useState("");
  const router = useRouter();

  const healthcheck = useRealtimeValue<{
    label: string;
    current: number;
    locked: boolean;
  }>(`/healthchecks/${router.query.hcid}/meta`);

  useEffect(() => {
    if (!user || !healthcheck) return;
    set(
      ref(
        database,
        `/healthchecks/${router.query.hcid}/participants/${user.uid}/user`
      ),
      {
        displayName: user.displayName,
        photoURL: user.photoURL,
      }
    );
  }, [user, healthcheck, router.query.hcid]);

  const current = healthcheck?.current;

  const updateVote = useCallback(
    (vote, reaction) => {
      if (!user || current === undefined) return;
      set(
        ref(
          database,
          `/healthchecks/${router.query.hcid}/participants/${user.uid}/votes/${current}`
        ),
        {
          vote,
          reaction,
        }
      );
    },
    [current, router.query.hcid, user]
  );

  useEffect(() => {
    setVote(-1);
    setReaction("");
  }, [current]);

  const handleVote = useCallback(
    (vote: 1 | 2 | 3) => {
      if (!healthcheck || healthcheck.locked) return;

      setVote(vote);
      updateVote(vote, reaction);
    },
    [reaction, updateVote, healthcheck]
  );

  const updateReaction = useCallback(
    (newReaction: string) => {
      if (newReaction === reaction) {
        updateVote(vote, "");
        setReaction("");
        return;
      }
      setReaction(newReaction);
      updateVote(vote, newReaction);
    },
    [reaction, updateVote, vote]
  );

  if (!healthcheck || current === undefined) return <Layout>🚀</Layout>;

  const title = current >= 0 ? `${QUESTIONS[current].title}` : "Ready?";
  const subtitle =
    current >= 0
      ? QUESTIONS[current].subtitle
      : "The champion will start the healthcheck shortly! Meanwhile, practice your emoji game!";

  return (
    <Layout title={healthcheck.label} stretch>
      <Item>
        <ItemTitle>{title}</ItemTitle>
        <ItemSubtitle>{subtitle}</ItemSubtitle>
      </Item>

      <SelectedVote style={{ backgroundColor: VOTE_COLOURS[vote] }}>
        <SelectedReaction>{reaction}</SelectedReaction>
      </SelectedVote>
      <BottomContainer>
        <ReactionContainer>
          {["❤️", "💔", "👍", "🚀", "🫒", "🚢"].map((r, id) => (
            <Reaction
              $active={reaction === r}
              key={id}
              onClick={() => updateReaction(r)}
            >
              {r}
            </Reaction>
          ))}
        </ReactionContainer>
        <VoteContainer>
          <Vote onClick={handleVote} vote={1} type="first" />
          <Vote onClick={handleVote} vote={2} />
          <Vote onClick={handleVote} vote={3} type="last" />
        </VoteContainer>
      </BottomContainer>
    </Layout>
  );
};

export default VotePage;
