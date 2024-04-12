import { useCurrentUser } from "../UserProvider";
import { type AwarenessUser } from "../hooks/useYjsAwareness";

interface RoomUsersProps {
  roomUsers: AwarenessUser[];
}

export const RoomUsers = ({ roomUsers }: RoomUsersProps) => {
  const currentUser = useCurrentUser();

  return (
    <ul className="fixed bottom-1 left-1 flex flex-col gap-2 p-2 rounded-xl rounded-bl-sm bg-slate-200 border border-slate-400">
      <h3 className="text-xl font-bold">Room</h3>
      {roomUsers.length > 0 ? (
        roomUsers.map((user) => {
          const itsMe = user.name === currentUser.name;
          return (
            <li className="flex items-center gap-1" key={user.name}>
              <span
                className={"h-6 w-6 flex rounded-full"}
                style={{ backgroundColor: user.color }}
              />
              <p
                style={{
                  fontWeight: itsMe ? "bold" : "normal",
                  color: user.color,
                }}
              >
                {user.name} {itsMe ? "(You)" : ""}
              </p>
            </li>
          );
        })
      ) : (
        <p>Loading...</p>
      )}
    </ul>
  );
};
