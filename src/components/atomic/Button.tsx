type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  onClickHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  buttonSize?: "small"| "large";
};

export default function Button({
  children,
  onClickHandler = undefined,
  buttonSize = "large",
  ...rest
}: ButtonProps) {
  const styles = `
    cursor-pointer
    rounded-lg
    bg-zinc-700
    ${buttonSize === "small" ? "px-2" : "px-3"}
    ${buttonSize === "small" ? "py-1" : "py-2"}
    text-zinc-100
    transition-colors
    hover:bg-zinc-600
    focus:outline-none
    focus:ring
    focus:ring-zinc-500
    ${buttonSize === "small" ? "text-sm" : "text-base"}
   
    `;

  return (
    <button className={styles} type="submit" onClick={onClickHandler} {...rest}>
      {children}
    </button>
  );
}
