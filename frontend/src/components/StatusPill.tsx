import {
  statusPillLabels,
  statusPillStyles,
  type StatusPillType,
} from "./statusPillConfig";

type StatusPillProps = {
  type: StatusPillType;
};

const baseClasses =
  "box-border inline-flex h-[30px] w-[126px] items-center justify-center rounded-md font-[Roboto,sans-serif] text-xs font-black uppercase leading-normal tracking-[0.12px]";

const styleClasses: Record<string, string> = {
  unsubmitted: "bg-[#ffbf05] text-[#323232]",
  submitted: "bg-[#39ae2a] text-white",
  published: "bg-[#347554] text-white",
  review: "border border-[#d0d7de] bg-[#f6f8fa] text-[#323232]",
  rejected: "border border-[#b42318] bg-white text-[#b42318]",
};

export function StatusPill({ type }: StatusPillProps) {
  return (
    <span className={`${baseClasses} ${styleClasses[statusPillStyles[type]]}`}>
      {statusPillLabels[type]}
    </span>
  );
}
