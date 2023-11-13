import classNames from "classnames";
import React from "react";

type Props = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type"
>;

export const RangeInput: React.FunctionComponent<Props> = ({
  className,
  ...rest
}) => {
  return (
    <input type="range" className={classNames("slider", className)} {...rest} />
  );
};

export default RangeInput;
