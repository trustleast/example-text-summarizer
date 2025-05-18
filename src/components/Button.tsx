import React from "react";
import { Spinner } from "./Spinner";

type Props = {
  pressed?: boolean;
  disabled?: boolean;
  processing?: boolean;
  danger?: boolean;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: React.FunctionComponent<Props> = ({
  pressed,
  disabled,
  processing,
  danger,
  children,
  ...props
}) => {
  if (processing === true) {
    return <Spinner />;
  }

  const classNames = ["button"];
  if (pressed === true) {
    classNames.push("pressed");
  }
  if (disabled === true) {
    classNames.push("disabled");
  }
  if (danger === true) {
    classNames.push("danger");
  }

  return (
    <button className={classNames.join(" ")} {...props}>
      {children}
    </button>
  );
};
