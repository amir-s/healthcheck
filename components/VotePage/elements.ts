import tw from "tailwind-styled-components";

export const Item = tw.div`
  w-full
  text-white
`;

export const ItemTitle = tw.div`
  font-bold
  text-5xl
  mb-2
  text-left
  opacity-95
`;

export const ItemSubtitle = tw.div`
  text-lg
  my-2
  opacity-75
`;

export const VoteContainer = tw.div`
  flex
  h-24
  w-full
  justify-between
  mb-2
  text-white
`;

export const SelectedVote = tw.div`
  flex
  flex-1
  w-full
  justify-center
  items-center
  rounded-xl
  mb-3
  p-10
  shadow-xl
`;

export const SelectedReaction = tw.div`
  text-8xl
  p-4
`;

export const ReactionContainer = tw.div`
  flex
  w-full
  justify-stretch
  text-3xl
  mb-4
  px-2
  bg-secondary
  rounded-xl
`;

export const Reaction = tw.div`
  flex-1
  flex
  align-center
  py-5
  cursor-pointer
  rounded-full
  items-center
  justify-center
  transition-all
  duration-200
  transform
  hover:-translate-y-1 focus:-translate-y-1
`;

export const BottomContainer = tw.div`
  flex flex-col
  w-full
  justify-between
`;

export const VoteIndicator = tw.div<{ $first?: boolean; $last: boolean }>`
  self-strech
  h-full
  w-full
  bg-primary
  cursor-pointer
  opacity-90
  hover:opacity-100 hover:drop-shadow-xl

  ${(p) => (p.$first ? "rounded-l-xl" : p.$last ? "rounded-r-xl" : "")}
`;
