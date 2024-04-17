import { UserProvider } from "./UserProvider";
import { YRemirrorEditor } from "./YRemirrorEditor";
import { RoomUsers } from "./components/RoomUsers";

const VALID_DOC_ID = "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed";

export const CollabEditor = () => {
  return (
    <UserProvider>
      <div>
        <YRemirrorEditor documentId={VALID_DOC_ID} />
        <RoomUsers />
      </div>
    </UserProvider>
  );
};
