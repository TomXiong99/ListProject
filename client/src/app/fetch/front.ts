import { content, userList } from "../../store/userSlice";

export const updateUserLists = async (user: string) => {
  const ret: userList[] = await fetch(`http://localhost:8888/api/users/${user}`)
    .then((response) => response.json())
    .then((data): userList[] => data.lists);
  return ret;
};

export const getUser = async (user: string) => {
  return fetch(`http://localhost:8888/api/users/${user}`).then((response) =>
    response.json()
  );
};

export const getList = async (id: string) => {
  const ret: {
    exists: boolean;
    contents: content[];
    title: string;
    owned: boolean;
  } = await fetch(`http://localhost:8888/api/list/${id}`, {
    credentials: "include",
  }).then((response) => response.json());
  return ret;
};
