export type Props = {
  size?: "small" | "large";
  gap?: "medium";
  center?: boolean;
  color?: "brand" | "secondary" | "red";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>;

export const TextContent: React.FunctionComponent<Props> = ({
  children,
  className,
  size,
  gap,
  center,
  color,
  ...props
}) => {
  const classes = ["text"];
  if (size === "small") {
    classes.push("small");
  }
  if (size === "large") {
    classes.push("large");
  }
  if (gap === "medium") {
    classes.push("gap-medium");
  }
  if (center === true) {
    classes.push("center-text");
  }
  if (className !== undefined) {
    classes.push(className);
  }
  if (color !== undefined) {
    classes.push(color);
  }
  const finalClasses = classes.join(" ");

  return (
    <p className={finalClasses} {...props}>
      {children}
    </p>
  );
};
