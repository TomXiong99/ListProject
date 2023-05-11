import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import "../../styles/content.scss";
import "../../styles/list.scss";
import {
  checkContents,
  content,
  deleteFromContents,
  editContents,
  pushContents,
  selectCurrent,
  selectLists,
  selectMode,
  selectUpdate,
  selectUser,
  setCurrentContents,
  setCurrentIndex,
  setCurrentOwner,
  setCurrentTitle,
  setUsersLists,
  setEditMode,
  toggleUpdate,
} from "../../store/userSlice";
import { deleteFromList, updateCurrentList } from "../fetch/back";
import { getList, updateUserLists } from "../fetch/front";

const ListTitle = () => {
  const { id } = useParams();
  const ref = useRef() as MutableRefObject<HTMLInputElement>;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const current = useAppSelector(selectCurrent);
  const [titleText, setTitle] = useState("");
  const [editModeLocal, setEditMode] = useState(false);
  const editTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  //Updates the title on the back-end
  const submitTitle = async () => {
    dispatch(setCurrentTitle(titleText || "Unnamed"));
    await updateCurrentList(id, titleText || "Unnamed", current.contents).then(
      async () => {
        setTitle(titleText || "Unnamed");
        dispatch(setUsersLists(await updateUserLists(user)));
      }
    );
    setEditMode(false);
  };

  //This useEffect submits the title changes whenever there is a click outside the title input
  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target) && editModeLocal) {
        submitTitle();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });

  //whenever the title changes, update the current title
  useEffect(() => {
    if (current.title === "") setTitle("Unnamed");
    else setTitle(current.title);
  }, [current.title]);

  //Used to select the title when editing
  useEffect(() => {
    if (editModeLocal) ref.current.focus();
  }, [editModeLocal]);

  return (
    <form
      id="form-title"
      onClick={(e) => {
        setEditMode(true);
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        submitTitle();
      }}
    >
      <label htmlFor="input-title">
        <input
          id="input-title"
          ref={ref}
          type={"text"}
          value={titleText}
          onChange={editTitle}
        />
      </label>
    </form>
  );
};

const NewListEntry = () => {
  const { id } = useParams();
  const current = useAppSelector(selectCurrent);
  const dispatch = useAppDispatch();
  const [entry, setEntry] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    if (update) {
      updateCurrentList(id, current.title, current.contents);
      setUpdate(false);
    }
  }, [update]);
  const editEntry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEntry(event.currentTarget.value);
  };

  return (
    <form
      id="form-entry"
      onSubmit={async (e) => {
        e.preventDefault();
        dispatch(pushContents(entry));
        setEntry("");
        setUpdate(true);
      }}
    >
      <label htmlFor="input-new-entry">
        +
        <input
          id="input-new-entry"
          type={"text"}
          value={entry}
          placeholder="Add Item"
          onChange={editEntry}
        />
      </label>
    </form>
  );
};

const ListElement = (props: { content: content; index: number }) => {
  const ref = useRef() as MutableRefObject<HTMLInputElement>;
  const dispatch = useAppDispatch();
  const [data, setData] = useState(props.content.content);
  const [editModeLocal, setEditModeLocal] = useState(false);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(event.currentTarget.value);
  };
  const claimEdit = () => {
    if (editModeLocal === false) {
      setEditModeLocal(true);
    }
  };
  const releaseEdit = () => {
    setEditModeLocal(false);
  };

  const submitChange = () => {
    dispatch(editContents({ index: props.index, replacement: data }));
    releaseEdit();
    dispatch(toggleUpdate());
  };

  useEffect(() => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target) && editModeLocal) {
        if (props.content.content !== data) submitChange();
        else releaseEdit();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  });

  //Used to select the list element when editing
  useEffect(() => {
    if (editModeLocal) ref.current.focus();
  }, [editModeLocal]);

  return (
    <div className="list-element">
      <input
        type={"checkbox"}
        checked={props.content.checked}
        onChange={(e) => {
          dispatch(checkContents(props.index));
          dispatch(toggleUpdate());
        }}
      />
      <form
        onClick={() => {
          claimEdit();
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          submitChange();
        }}
      >
        <label>
          <input
            style={
              props.content.checked && document.activeElement !== ref.current
                ? { textDecoration: "line-through" }
                : {}
            }
            ref={ref}
            type={"text"}
            value={data}
            onChange={onChange}
          />
        </label>
      </form>
      <button
        style={{ display: editModeLocal ? "block" : "none" }}
        onClick={async () => {
          dispatch(deleteFromContents(props.index));
          releaseEdit();
          dispatch(toggleUpdate());
        }}
      >
        Delete
      </button>
    </div>
  );
};

const List = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const current = useAppSelector(selectCurrent);
  const editMode = useAppSelector(selectMode);
  const toUpdate = useAppSelector(selectUpdate);

  const update = async () => {
    updateCurrentList(id, current.title, current.contents).then(() => {
      dispatch(setCurrentContents([]));
      getList(id as string).then((data) => {
        if (!data.exists) navigate("/");
        dispatch(setCurrentOwner(data.owned));
        dispatch(setCurrentTitle(data.title));
        dispatch(setCurrentContents(data.contents));
      });
    });
  };

  useEffect(() => {
    dispatch(setCurrentContents([]));
    getList(id as string).then((data) => {
      if (!data.exists) navigate("/ListNotFound");
      dispatch(setCurrentOwner(data.owned));
      dispatch(setCurrentTitle(data.title));
      dispatch(setCurrentContents(data.contents));
    });
  }, [id]);

  useEffect(() => {
    if (toUpdate) {
      update();
      dispatch(toggleUpdate());
    }
  }, [toUpdate]);

  return (
    <div className="content">
      <div id="list">
        <ListTitle />
        <NewListEntry />
        <div id="list-contents" className="scroll">
          {current.contents.map((element, index) => (
            <ListElement content={element} index={index} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;
