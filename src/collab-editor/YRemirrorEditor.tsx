import { useRef, useCallback, useState, useEffect } from "react";
import { RemirrorJSON } from "remirror";
import { YjsExtension, AnnotationExtension } from "remirror/extensions";
import { EditorComponent, Remirror, useRemirror } from "@remirror/react";
import { EditorState, Transaction } from "prosemirror-state";
import { useDebouncedCallback } from "use-debounce";

import { useCurrentUser } from "./UserProvider";
import { useWebRtcProvider } from "./hooks/useWebRtcProvider";
import { useEventListener } from "./hooks/useEventListener";
import { editorExtensions } from "./editor-extensions";
import { Menu } from "./components/menu/Menu";
import { type AwarenessUser } from "./hooks/useYjsAwareness";

import "./styles/rmr-base-styles.css";
import "./styles/yjs-style.css";

interface EditorProps {
  documentId: string;
  onFetch: (documentId: string) => Promise<string>;
  onSave: (documentId: string, body: RemirrorJSON) => void;
  onChange: (users: AwarenessUser[]) => void;
}

const TIMEOUT = 3000 + Math.floor(Math.random() * 7000);

export const YRemirrorEditor = ({
  documentId,
  onFetch,
  onSave,
  onChange,
}: EditorProps) => {
  const usedFallbackRef = useRef<boolean>(false);
  const currentUser = useCurrentUser();
  const { provider, awareness } = useWebRtcProvider(currentUser, documentId);

  const [clientCount, setClientCount] = useState<number>(0);
  const [docState, setDocState] = useState<RemirrorJSON>();

  useEffect(() => {
    console.log("provider :>> ", provider);
  }, [provider]);

  const handleChange = useCallback(
    ({ state, tr }: { state: EditorState; tr: Transaction | undefined }) => {
      if (tr?.docChanged) {
        setDocState(state.doc.toJSON());
      }
    },
    [setDocState]
  );

  const handleSave = useCallback(
    (newDocState: RemirrorJSON) => {
      if (clientCount === 0) {
        onSave(documentId, newDocState);
        const meta = provider.doc.getMap("meta");
        meta.set("lastSaved", Date.now());
      }
    },
    [onSave, documentId, provider.doc, clientCount]
  );

  const handleSaveDebounced = useDebouncedCallback(handleSave, TIMEOUT);

  useEffect(() => {
    handleSaveDebounced(docState!);
  }, [handleSaveDebounced, docState]);

  const handleYDocUpdate = useCallback(() => {
    handleSaveDebounced.cancel();
  }, [handleSaveDebounced]);

  //@ts-expect-error - provider works as observable
  useEventListener("update", handleYDocUpdate, provider.doc);

  const handlePeersChange = useCallback(
    (event: any) => {
      console.log("event.bcPeers :>> ", event.bcPeers);
      const peers: string[] = event.bcPeers;
      setClientCount(peers.length);
    },
    [setClientCount]
  );

  //@ts-expect-error - provider works as observable
  useEventListener("peers", handlePeersChange, provider);

  const createExtensions = useCallback(() => {
    return [
      new YjsExtension({
        getProvider: () => provider,
      }),
      new AnnotationExtension(),
      ...editorExtensions(),
    ];
  }, [provider]);

  const { manager, getContext } = useRemirror({
    extensions: createExtensions,
    selection: "start",
    core: {
      excludeExtensions: ["history"],
    },
  });

  awareness.on("change", () => {
    const formattedUsers: AwarenessUser[] = Array.from(
      awareness.states.values()
    ).map(({ user }) => user);

    onChange(formattedUsers);
  });

  useEffect(() => {
    if (usedFallbackRef.current) return;

    const fetchFallback = async () => {
      if (provider.connected && clientCount === 0) {
        const res = await onFetch(documentId);
        getContext()?.setContent(JSON.parse(res));
      }
      usedFallbackRef.current = true;
    };

    const timeoutId = window.setTimeout(fetchFallback, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onFetch, documentId, provider.connected, clientCount, getContext]);

  return (
    <div className="remirror-theme p-4">
      <Remirror
        manager={manager}
        onChange={({ state, tr }) => handleChange({ state, tr })}
        autoFocus
      >
        <Menu />
        <EditorComponent />

        {/* <Annotations /> */}

        <div>
          <p>
            Is connected: <b>{provider.connected ? "Yes" : "No"}</b>
          </p>
          <p>
            Document ID: <b>{documentId}</b>
          </p>
          <p>
            Room ID: <b>{provider?.room?.name}</b>
          </p>
        </div>
      </Remirror>
    </div>
  );
};
