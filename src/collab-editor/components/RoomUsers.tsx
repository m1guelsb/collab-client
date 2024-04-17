import { useCurrentUser } from "../UserProvider";
import { useRoomUsersStore } from "../hooks/useRoomUsersStore";

export const RoomUsers = () => {
  const { users } = useRoomUsersStore();
  const currentUser = useCurrentUser();

  return (
    users.length > 0 && (
      <ul className="fixed bottom-1 left-1 flex flex-col gap-2 p-2 rounded-xl rounded-bl-sm bg-slate-200 border border-slate-400">
        <h3 className="text-xl font-bold">Room</h3>
        {users.map((user) => {
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
        })}
      </ul>
    )
  );
};
