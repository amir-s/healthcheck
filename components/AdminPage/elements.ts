import tw from "tailwind-styled-components";

export const QuestionContainer = tw.div<{ $active?: boolean }>`
  flex flex-col
  w-full
  align-center
  my-2
  ${(p) => (p.$active ? "opacity-100" : "opacity-30")}
`;

export const QuestionTitle = tw.h3`
  pl-3
  font-semibold
`;

export const QuestionTitleContainer = tw.div`
  flex
  justify-between
  items-center
`;

export const QuestionScore = tw.div`
  pr-3
  font-semibold
  text-2xl
`;

export const QuestionSubtitle = tw.div`
  pl-3
  mb-1
`;

export const VoteContainer = tw.div<{ $active?: boolean }>`
  flex
  w-full
  items-stretch
  text-white
  justify-stretch
  space-x-2
  p-2
  rounded-md
  transition-all
  duration-300
  ${(p) => (p.$active ? "h-24 bg-fillSecondary" : "h-16")}
`;

export const VoteIndicatorContainer = tw.div`
  flex flex-1 flex-col
  w-10
  overflow-hidden
`;

export const VoterName = tw.div`
  flex
  justify-center
  text-sm
  whitespace-nowrap
`;

export const VoteIndicator = tw.div`
  flex flex-1
  items-center justify-center
  rounded-sm
  transition-all
  duration-200
  border border-gray-300 border-opacity-20
`;

export const VoteIndicatorPlaceholder = tw.div<{ $voted?: boolean }>`
  flex flex-1
  items-center justify-center
  rounded-sm
  transition-all
  duration-200
  border
  ${(p) => (p.$voted ? "bg-fillPrimary border-primary" : "border-fillPrimary")}
`;

export const QRCodeContainer = tw.div`
  p-4 m-4
  bg-fillSecondary
  rounded-xl
`;

export const ParticipantsContainer = tw.div`
  p-2 mt-6 mb-3
  rounded-xl
  text-center
`;

export const Avatar = tw.img`
  inline
  h-16 w-16
  m-2
  rounded-full
  object-cover
`;

export const StickyContainer = tw.div<{ $active?: boolean }>`
  flex fixed flex-col
  space-y-2
  bottom-0 right-0
  justify-center
  items-center
  m-5
  bg-secondary
  transition-all
  duration-300
  ${(p) =>
    p.$active ? "p-4 rounded-xl" : "p-0 h-14 w-14 rounded-full opacity-70"}
`;

export const Gear = tw.div`
  cursor-pointer
  p-5
  text-xl
`;

export const Close = tw.div`
  text-sm
  cursor-pointer
  underline
  opacity-50
`;
