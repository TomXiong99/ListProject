import { content } from "../../store/userSlice";

//Create a new list for the user
export const createNewList = async () => {
  return fetch("http://localhost:8888/api/list", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.list._id;
    });
};

export const copyNewList = async (title: string, contents: content[]) => {
  return fetch("http://localhost:8888/api/list", {
    method: "POST",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      contents: contents,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.list._id;
    });
};

//Update the current list on the backend
export const updateCurrentList = (
  id: string | undefined,
  title: string,
  contents: { content: string; checked: boolean }[]
) => {
  return fetch(`http://localhost:8888/api/list/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      contents: contents,
    }),
  });
};

export const deleteFromList = (id: string, index: number) => {
  return fetch(`http://localhost:8888/api/list/${id}/${index}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};

export const deleteList = (id: string) => {
  return fetch(`http://localhost:8888/api/list/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
