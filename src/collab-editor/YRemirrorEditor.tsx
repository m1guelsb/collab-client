import { useCallback, useEffect } from "react";
import { YjsExtension } from "remirror/extensions";
import { EditorComponent, Remirror, useRemirror } from "@remirror/react";

import { useCurrentUser } from "./UserProvider";
import { editorExtensions } from "./editor-extensions";
import { Menu } from "./components/menu/Menu";

import { type AwarenessUser } from "./hooks/useYjsAwareness";
import { useWebsocketProvider } from "./hooks/useWebsocketProvider";
import { useRoomUsersStore } from "./hooks/useRoomUsersStore";

import "./styles/rmr-base-styles.css";
import "./styles/yjs-style.css";

interface EditorProps {
  documentId: string;
}

export const YRemirrorEditor = ({ documentId }: EditorProps) => {
  const currentUser = useCurrentUser();
  const { setUsers } = useRoomUsersStore();
  const { provider, awareness } = useWebsocketProvider(currentUser, documentId);

  const createExtensions = useCallback(() => {
    return [
      new YjsExtension({
        getProvider: () => provider,
      }),
      ...editorExtensions(),
    ];
  }, [provider]);

  const { manager } = useRemirror({
    extensions: createExtensions,
    selection: "start",
    core: {
      excludeExtensions: ["history"],
    },
  });

  useEffect(() => {
    awareness.on("change", () => {
      const formattedUsers: AwarenessUser[] = Array.from(
        awareness.states.values()
      ).map(({ user }) => user);

      setUsers(formattedUsers);
    });

    return () => {
      awareness.off("change", () => {
        const formattedUsers: AwarenessUser[] = Array.from(
          awareness.states.values()
        ).map(({ user }) => user);

        setUsers(formattedUsers);
      });

      provider.disconnect();
    };
  }, []);

  return (
    <div className="remirror-theme px-4 h-screen">
      <div className="flex justify-between">
        <p>
          Synced: <b>{provider.synced ? "Yes" : "No"}</b>
        </p>
        <p>
          Document ID: <b>{documentId}</b>
        </p>
        <p>
          Room ID: <b>{provider?.roomname}</b>
        </p>
      </div>
      <Remirror manager={manager} autoFocus>
        <Menu />
        <EditorComponent />

        {/* <Annotations /> */}
      </Remirror>
    </div>
  );
};
