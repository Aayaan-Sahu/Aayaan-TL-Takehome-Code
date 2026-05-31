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
  const classes = `app-button app-button--${variant} ${className}`.trim();

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
