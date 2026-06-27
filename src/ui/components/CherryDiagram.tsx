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
      <div className="cherry-parent">{parent}</div>
      <div className="branches" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="cherry-children">
        <CherryNumber active={activeTarget === "cherry_left"} value={leftValue} />
        <CherryNumber active={activeTarget === "cherry_right"} value={rightValue} />
      </div>
    </div>
  );
}

function CherryNumber({ active, value }: { active: boolean; value?: number }) {
  return (
    <div className={active ? "cherry-number active" : "cherry-number"}>
      {value ?? "?"}
    </div>
  );
}
