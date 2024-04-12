import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { RemirrorJSON } from "remirror";
import { v4 as uuid } from "uuid";
import { AwarenessUser } from "./hooks/useYjsAwareness";
import { UserProvider, type User } from "./UserProvider";
import { getRandomUserName } from "./util/getRandomUserName";
import { YRemirrorEditor } from "./YRemirrorEditor";
import { RoomUsers } from "./components/RoomUsers";

interface Document {
  body: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const VALID_DOC_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

export const CollabEditor = () => {
  const [roomUsers, setRoomUsers] = useState<AwarenessUser[]>([]);

  const currentUser: User = useMemo(() => {
    const id = uuid();
    return {
      id,
      name: getRandomUserName(id),
    };
  }, []);

  const handleFetch = useCallback(async (id: string) => {
    const { data } = await api.get<Document>(`documents/${id}`);
    console.log("onFetch :>>", JSON.parse(data.body));
    return data.body;
  }, []);

  const handleSave = useCallback(async (id: string, body: RemirrorJSON) => {
    const { status, data } = await api.put(`/documents/${id}`, {
      doc: JSON.stringify(body),
    });
    console.log("onEdit :>>", { status, data });
  }, []);

  return (
    <UserProvider.Provider value={currentUser}>
      <div>
        <YRemirrorEditor
          documentId={VALID_DOC_ID}
          onFetch={handleFetch}
          onSave={handleSave}
          onChange={(data) => setRoomUsers(data)}
        />
        <RoomUsers roomUsers={roomUsers} />
      </div>
    </UserProvider.Provider>
  );
};
