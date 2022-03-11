import { useState } from "react";
import tw from "tailwind-styled-components";

export const TextInput = tw.input<{
  $emph?: boolean;
}>`
  w-full
  h-12
  p-2
  rounded-lg
  outline-none
  border-2
  border-primary
  text-primary
  bg-fillPrimary
  text-center
  text-xl
  font-bold
  hover:bg-fillSecondary
  focus:bg-fillSecondary
  focus:text-white
  transition-all
  duration-200
  transform
  ${(p) => (p.$emph ? "mt-1 hover:-translate-y-1  focus:-translate-y-1" : "")}
`;

export const useTextInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return { value, onChange };
};
