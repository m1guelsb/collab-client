import { useRemirrorContext } from "@remirror/react";
import { useEffect } from "react";
import { Popup } from "./Popup";

export const Annotations = () => {
  const { setContent, commands, helpers } = useRemirrorContext();

  useEffect(() => {
    commands.setAnnotations([
      {
        id: "a-1",
        from: 1,
        to: 10,
      },
      {
        id: "a-2",
        from: 11,
        to: 17,
      },
    ]);
  }, [setContent, commands]);

  return (
    <div>
      <Popup />
      <div>Annotations:</div>
      <pre>{JSON.stringify(helpers.getAnnotations(), null, "  ")}</pre>
    </div>
  );
};
