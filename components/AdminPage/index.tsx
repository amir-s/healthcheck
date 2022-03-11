import { ref, set, update } from "firebase/database";
import { useRouter } from "next/router";
import { database } from "components/fire";
import { useRealtimeValue } from "components/realtime";
import { useAppContext } from "components/AppState";
import { QUESTIONS } from "components/Questions";
import { Button } from "components/Button";
import { VOTE_COLOURS_ADMIN } from "components/VoteColours";
import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import Layout from "components/Layout";
import {
  QuestionContainer,
  QuestionTitle,
  QuestionTitleContainer,
  QuestionScore,
  QuestionSubtitle,
  VoteContainer,
  VoteIndicatorContainer,
  VoterName,
  VoteIndicator,
  VoteIndicatorPlaceholder,
  QRCodeContainer,
  ParticipantsContainer,
  Avatar,
  StickyContainer,
  Gear,
  Close,
} from "./elements";

interface Healthcheck {
  meta: {
    label: string;
    locked: boolean;
    current: number;
  };
  adminId: string;
  participants: { [key: string]: any };
}

interface QuestionProps {
  question: {
    title: string;
    subtitle: string;
  };
  active?: boolean;
  index: number;
  healthcheck: Healthcheck;
}

const DisplayName = (name: string) => {
  if (name.indexOf("@")) return name.split("@")[0];
  return name;
};

const Question = ({ question, index, healthcheck }: QuestionProps) => {
  const votes = useMemo(() => {
    return Object.values(healthcheck.participants).map((participant) => {
      const selection = participant.votes
        ? participant.votes[index]
        : { vote: -1 };
      return {
        user: participant.user,
        selection,
      };
    });
  }, [healthcheck, index]);

  const active = healthcheck.meta.current === index;

  const score = useMemo(() => {
    let total = 0;
    const voteCounts = votes.reduce((acc, vote) => {
      if (!vote.selection || vote.selection.vote < 0) return acc;
      total++;
      return acc + vote.selection.vote;
    }, 0);
    if (total === 0) return 0;
    return voteCounts / total;
  }, [votes]);

  const showScore =
    healthcheck.meta.current > index || (active && healthcheck.meta.locked);
  const showVotes = showScore || active;

  return (
    <QuestionContainer $active={active}>
      <QuestionTitleContainer>
        <QuestionTitle>
          {index + 1} / {question.title}
        </QuestionTitle>
        {showScore && (
          <QuestionScore
            style={{ color: VOTE_COLOURS_ADMIN[Math.round(score)] }}
          >
            {score.toFixed(1)}
          </QuestionScore>
        )}
      </QuestionTitleContainer>
      {active && <QuestionSubtitle>{question.subtitle}</QuestionSubtitle>}
      {showVotes && (
        <VoteContainer $active={active}>
          {votes.map((vote, index) => (
            <VoteIndicatorContainer key={index}>
              <VoterName>{DisplayName(vote.user.displayName)}</VoterName>
              {showScore ? (
                <VoteIndicator
                  style={{
                    backgroundColor: VOTE_COLOURS_ADMIN[vote.selection?.vote],
                  }}
                >
                  {active && vote.selection?.reaction}
                </VoteIndicator>
              ) : (
                <VoteIndicatorPlaceholder
                  $voted={vote.selection?.vote > 0}
                ></VoteIndicatorPlaceholder>
              )}
            </VoteIndicatorContainer>
          ))}
        </VoteContainer>
      )}
    </QuestionContainer>
  );
};

const AdminPage = () => {
  const [active, setActive] = useState(false);
  const {
    state: { user },
  } = useAppContext();
  const router = useRouter();

  const healthcheck = useRealtimeValue<Healthcheck>(
    `/healthchecks/${router.query.hcid}`
  );

  const goToNext = () => {
    if (!healthcheck) return;
    setActive(false);
    const updates = {} as any;
    updates[`/healthchecks/${router.query.hcid}/meta/current`] =
      healthcheck.meta.current + 1;
    updates[`/healthchecks/${router.query.hcid}/meta/locked`] = false;
    update(ref(database), updates);
  };

  const startHealtcheck = () => {
    if (!healthcheck) return;
    const updates = {} as any;
    updates[`/healthchecks/${router.query.hcid}/meta/current`] = 0;
    updates[`/healthchecks/${router.query.hcid}/meta/locked`] = false;
    update(ref(database), updates);
  };

  const revealAnswers = () => {
    if (!healthcheck) return;
    set(ref(database, `/healthchecks/${router.query.hcid}/meta/locked`), true);
    setActive(false);

    if (healthcheck.meta.current + 1 < QUESTIONS.length) {
      setTimeout(() => {
        setActive(true);
      }, 5000);
    }
  };

  const participants = useMemo(() => {
    if (!healthcheck || !healthcheck.participants) return [];
    return Object.values(healthcheck.participants).map(
      (participant) => participant.user
    );
  }, [healthcheck]);

  const readyForReview = useMemo(() => {
    if (!healthcheck) return false;
    if (healthcheck.meta.locked) return false;
    if (healthcheck.meta.current < 0) return false;

    const selections = Object.values(healthcheck.participants).map(
      (participant) => {
        if (!participant.votes) return { vote: -1 };
        return participant.votes[healthcheck.meta.current];
      }
    );

    return (
      selections.filter((selection) => selection && selection.vote > 0)
        .length >=
      participants.length / 2
    );
  }, [healthcheck, participants]);

  useEffect(() => {
    if (!healthcheck) return;
    if (readyForReview) {
      setActive(true);
    }
  }, [healthcheck, readyForReview]);

  if (!healthcheck) return null;

  const canReview = !healthcheck.meta.locked;
  const canGoNext =
    healthcheck.meta.current + 1 < QUESTIONS.length && healthcheck.meta.locked;

  return (
    <Layout title={healthcheck.meta.label}>
      <h1>👋</h1>
      <h2>
        Welcome to <strong>{healthcheck.meta.label}</strong>
      </h2>
      <QRCodeContainer>
        <QRCode
          value={`https://healthcheck.amirs.dev/hc/${router.query.hcid}`}
        />
      </QRCodeContainer>
      <div>
        Scan this 👆 with your phone to join
        {participants.length > 0 ? " 👇" : ""}!
      </div>
      <ParticipantsContainer>
        {participants.map((participant, index) => (
          <Avatar key={index} src={participant.photoURL} />
        ))}
      </ParticipantsContainer>
      {participants.length > 0 && healthcheck.meta.current < 0 && (
        <Button $emph onClick={startHealtcheck}>
          Start the healtcheck
        </Button>
      )}
      {healthcheck.meta.current >= 0 &&
        QUESTIONS.map((question, index) => (
          <Question
            key={index}
            question={question}
            index={index}
            healthcheck={healthcheck}
          ></Question>
        ))}
      <StickyContainer $active={active}>
        {active ? (
          <>
            {canReview && (
              <Button onClick={revealAnswers}>
                Review &quot;{QUESTIONS[healthcheck.meta.current].title}
                &quot;?
              </Button>
            )}
            {canGoNext && <Button onClick={goToNext}>Next question</Button>}
            <Close onClick={() => setActive((i) => !i)}>close</Close>
          </>
        ) : (
          <Gear onClick={() => setActive((i) => !i)}>⚙️</Gear>
        )}
      </StickyContainer>
    </Layout>
  );
};

export default AdminPage;
