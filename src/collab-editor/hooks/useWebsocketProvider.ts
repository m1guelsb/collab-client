import * as Y from "yjs";
import { useMemo } from "react";
import { WebsocketProvider } from "y-websocket";
import { useYjsAwareness, type AwarenessUser } from "./useYjsAwareness";

const providersMap = new Map<string, WebsocketProvider>();

export function useWebsocketProvider(user: AwarenessUser, documentId: string) {
  const ydoc = useMemo(() => new Y.Doc({ guid: documentId }), [documentId]);
  const awareness = useYjsAwareness(user, ydoc);

  const provider = useMemo(() => {
    const roomName = `room-${documentId}`;

    if (providersMap.has(documentId)) {
      return providersMap.get(documentId)!;
    }

    const provider = new WebsocketProvider(
      import.meta.env.VITE_WSS_URL,
      roomName,
      ydoc,
      {
        awareness,
      }
    );
    providersMap.set(documentId, provider);
    return provider;
  }, [awareness, ydoc, documentId]);

  return { provider, awareness };
}
