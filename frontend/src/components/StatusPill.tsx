import {
  statusPillLabels,
  statusPillStyles,
  type StatusPillType,
} from "./statusPillConfig";

type StatusPillProps = {
  type: StatusPillType;
};

export function StatusPill({ type }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill--${statusPillStyles[type]}`}>
      {statusPillLabels[type]}
    </span>
  );
}
