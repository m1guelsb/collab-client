import * as Y from "yjs";
import { useMemo } from "react";
import { WebrtcProvider } from "y-webrtc";
import { useYjsAwareness, type AwarenessUser } from "./useYjsAwareness";

const providersMap = new Map<string, WebrtcProvider>();

export function useWebRtcProvider(user: AwarenessUser, documentId: string) {
  const ydoc = useMemo(() => new Y.Doc({ guid: documentId }), [documentId]);
  const awareness = useYjsAwareness(user, ydoc);

  const provider = useMemo(() => {
    const roomName = `room-${documentId}`;

    if (providersMap.has(documentId)) {
      return providersMap.get(documentId)!;
    }

    const provider = new WebrtcProvider(roomName, ydoc, {
      awareness,
      signaling: [import.meta.env.VITE_WSS_URL],
    });
    providersMap.set(documentId, provider);
    return provider;
  }, [awareness, ydoc, documentId]);

  return { provider, awareness };
}
