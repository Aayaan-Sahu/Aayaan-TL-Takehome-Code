import type { ButtonHTMLAttributes, MouseEventHandler } from "react";

type AppButtonProps = {
  className?: string;
  disabled?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  text: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

type BaseButtonProps = AppButtonProps & {
  variant: "primary" | "cancel";
};

function BaseButton(props: BaseButtonProps) {
  const { text, variant, className = "" } = props;
  const baseClasses =
    "box-border inline-flex h-[35px] w-auto min-w-[151px] items-center justify-center rounded-md px-4 text-center font-[Roboto,sans-serif] text-base font-medium leading-normal tracking-[0.16px] no-underline transition-colors duration-[120ms] ease-in-out disabled:cursor-not-allowed disabled:opacity-70";
  const variantClasses =
    variant === "primary"
      ? "border-0 bg-[#39ae2a] text-white hover:bg-[#2f9324] disabled:hover:bg-[#39ae2a]"
      : "border border-[#9b9b9b] bg-white text-[#6c6c6c] hover:border-[#6c6c6c] hover:bg-[#f8f8f9] hover:text-[#323232] disabled:hover:border-[#9b9b9b] disabled:hover:bg-white disabled:hover:text-[#6c6c6c]";
  const classes = `${baseClasses} ${variantClasses} ${className}`.trim();

  if ("href" in props && props.href) {
    return (
      <a href={props.href} className={classes}>
        {text}
      </a>
    );
  }

  return (
    <button
      className={classes}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type}
    >
      {text}
    </button>
  );
}

export function PrimaryButton(props: AppButtonProps) {
  return <BaseButton {...props} variant="primary" />;
}

export function CancelButton(props: AppButtonProps) {
  return <BaseButton {...props} variant="cancel" />;
}
