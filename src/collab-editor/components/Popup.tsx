import {
  PositionerPortal,
  usePositioner,
  useRemirrorContext,
} from "@remirror/react";
import { createCenteredAnnotationPositioner } from "remirror/extensions";

export const Popup = () => {
  const { helpers, getState } = useRemirrorContext();

  const positioner = usePositioner(
    createCenteredAnnotationPositioner(helpers.getAnnotationsAt),
    []
  );

  if (!positioner.active) {
    return null;
  }

  const sel = getState().selection;
  const annotations = helpers.getAnnotationsAt(sel.from);
  const label = annotations.map((annotation) => annotation.text).join("\n");

  return (
    <PositionerPortal>
      <div
        style={{
          top: positioner.y + positioner.height,
          left: positioner.x,
          position: "absolute",
          border: "1px solid black",
          whiteSpace: "pre-line",
          background: "white",
        }}
        title="Floating annotation"
        ref={positioner.ref}
      >
        {label}
      </div>
    </PositionerPortal>
  );
};
