import { useMemo } from "react";
import { Doc } from "yjs";
import { Awareness } from "y-protocols/awareness.js";
import { generateColor } from "../util/generateColor";

export interface AwarenessUser {
  id: string;
  name: string;
  color?: string;
  [x: string]: any;
}

export const useYjsAwareness = (user: AwarenessUser, doc: Doc): Awareness => {
  return useMemo(() => {
    const awareness = new Awareness(doc);
    awareness.setLocalStateField("user", {
      id: user.id,
      name: user.name,
      color: generateColor(),
    });
    return awareness;
  }, [user, doc]);
};
