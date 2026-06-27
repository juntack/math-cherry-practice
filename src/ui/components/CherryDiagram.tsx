import type { VisualTarget } from "../../domain/problemTypes";

type CherryDiagramProps = {
  parent: number;
  leftValue?: number;
  rightValue?: number;
  activeTarget?: VisualTarget;
};

export function CherryDiagram({
  parent,
  leftValue,
  rightValue,
  activeTarget
}: CherryDiagramProps) {
  return (
    <div className="cherry-card" aria-label={`${parent}のさくらんぼ図`}>
      <div className="cherry-diagram">
        <svg
          className="cherry-branches"
          viewBox="0 0 360 260"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M 180 88 C 160 128, 120 150, 86 180" />
          <path d="M 180 88 C 200 128, 240 150, 274 180" />
        </svg>
        <div className="cherry-node cherry-parent">{parent}</div>
        <CherryNumber
          className="cherry-left"
          active={activeTarget === "cherry_left"}
          value={leftValue}
        />
        <CherryNumber
          className="cherry-right"
          active={activeTarget === "cherry_right"}
          value={rightValue}
        />
      </div>
    </div>
  );
}

function CherryNumber({
  active,
  className,
  value
}: {
  active: boolean;
  className: string;
  value?: number;
}) {
  const empty = value === undefined;

  return (
    <div
      className={`cherry-node cherry-number ${className} ${active ? "active" : ""} ${
        empty ? "empty" : ""
      }`}
    >
      <span>{value ?? "?"}</span>
    </div>
  );
}
