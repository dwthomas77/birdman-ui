type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  onClickHandler?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  buttonSize?: "small"| "large";
  variant?: "primary" | "tertiary";
};

export default function Button({
  children,
  onClickHandler = undefined,
  buttonSize = "large",
  variant = 'primary',
  ...rest
}: ButtonProps) {

  const baseButtonStyles = `
    cursor-pointer
    rounded-lg
    ${buttonSize === "small" ? "px-2" : "px-3"}
    ${buttonSize === "small" ? "py-1" : "py-2"}
    ${buttonSize === "small" ? "text-sm" : "text-base"}
    ${buttonSize === "small" ? "min-w-[80px]" : "min-w-[125px]"}
  `;

  const variantStyles = {
    primary: `
      bg-zinc-600
      border
      border-zinc-400
      text-zinc-100
      hover:bg-zinc-700
      focus:outline-none
      focus:ring
      focus:ring-zinc-400   
    `,
    tertiary: `
      bg-transparent
      border
      border-zinc-400
      text-zinc-100
      hover:bg-zinc-700
      focus:outline-none
      focus:ring
      focus:ring-zinc-400   
    `,
  };

  return (
    <button className={`${variantStyles[variant] || variantStyles.primary} ${baseButtonStyles} `} type="submit" onClick={onClickHandler} {...rest}>
      {children}
    </button>
  );
}
