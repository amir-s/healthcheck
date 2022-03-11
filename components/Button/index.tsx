import tw from "tailwind-styled-components";

export const Button = tw.button<{
  $emph?: boolean;
}>`
    py-2 px-4
    rounded-full
    text-white
    bg-primary
    text-fillPrimary
    hover:text-white
    hover:bg-secondary
    focus:outline-none
    box-border
    border-2
    border-transparent
    hover:border-primary
    focus:border-primary
    transition-all
    duration-200
    transform
    ${(p) => (p.$emph ? "mt-1 hover:-translate-y-1 focus:-translate-y-1" : "")}
`;
