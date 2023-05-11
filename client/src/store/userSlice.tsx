import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface content {
  checked: boolean;
  content: string;
}

export interface userList {
  id: string;
  title: string;
}

interface currentList {
  owned: boolean;
  index: number | undefined;
  title: string;
  contents: content[];
}

export interface userState {
  user: string;
  usersLists: userList[];
  current: currentList;
  editMode: boolean;
  toUpdate: boolean;
}

const initialState: userState = {
  user: "",
  usersLists: [],
  current: {
    owned: false,
    index: undefined,
    title: "",
    contents: [],
  },
  editMode: false,
  toUpdate: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, credentials: PayloadAction<string>) => {
      state.user = credentials.payload;
    },
    logout: (state) => {
      state.user = "";
      state.usersLists = [];
    },
    setUsersLists: (state, inputList: PayloadAction<userList[]>) => {
      state.usersLists = inputList.payload;
    },
    setCurrentIndex: (state, index: PayloadAction<number | undefined>) => {
      state.current.index = index.payload;
    },
    setCurrentOwner: (state, owned: PayloadAction<boolean>) => {
      state.current.owned = owned.payload;
    },
    setCurrentTitle: (state, title: PayloadAction<string>) => {
      state.current.title = title.payload;
    },
    setCurrentContents: (state, contents: PayloadAction<content[]>) => {
      state.current.contents = contents.payload;
    },
    deleteFromContents: (state, deletion: PayloadAction<number>) => {
      state.current.contents.splice(deletion.payload, 1);
    },
    editContents: (
      state,
      edit: PayloadAction<{ index: number; replacement: string }>
    ) => {
      state.current.contents[edit.payload.index].content =
        edit.payload.replacement;
    },
    checkContents: (state, index: PayloadAction<number>) => {
      state.current.contents[index.payload].checked =
        !state.current.contents[index.payload].checked;
    },
    pushContents: (state, append: PayloadAction<string>) => {
      state.current.contents.push({ content: append.payload, checked: false });
    },
    setEditMode: (state, bool: PayloadAction<boolean>) => {
      state.editMode = bool.payload;
    },
    toggleUpdate: (state) => {
      state.toUpdate = !state.toUpdate;
    },
  },
});

export const {
  login,
  logout,
  setUsersLists,
  setCurrentIndex,
  setCurrentOwner,
  setCurrentTitle,
  setCurrentContents,
  deleteFromContents,
  editContents,
  checkContents,
  pushContents,
  setEditMode,
  toggleUpdate,
} = userSlice.actions;

export const selectAll = (state: RootState) => state.user;

export const selectUser = (state: RootState) => state.user.user;

export const selectLists = (state: RootState) => state.user.usersLists;

export const selectCurrent = (state: RootState) => state.user.current;

export const selectMode = (state: RootState) => state.user.editMode;

export const selectUpdate = (state: RootState) => state.user.toUpdate;
