import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getList } from "./fetch/front";
import {
  selectCurrent,
  selectLists,
  selectUser,
  setUsersLists,
} from "../store/userSlice";
import "../styles/sideBar.scss";
import { copyNewList, createNewList, deleteList } from "./fetch/back";
import { updateUserLists } from "./fetch/front";

const NavList = (props: { id: string; title: string; index: number }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [display, setDisplay] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  const trigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (trigger.current && trigger.current.contains(e.target))
        setDisplay(true);
      else if (ref.current && !ref.current.contains(e.target))
        setDisplay(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  return (
    <div className="link-wrapper">
      <Link to={`/list/${props.id}`}>{props.title}</Link>
      <div className="link-settings" ref={trigger}>
        ...
      </div>
      <ul
        className="context-menu"
        ref={ref}
        style={display ? { display: "flex" } : { display: "none" }}
      >
        <li
          className="context-menu-item"
          onClick={() => {
            setDisplay(false);
            getList(props.id).then((ret) => {
              copyNewList(ret.title, ret.contents).then(async (id) => {
                dispatch(setUsersLists(await updateUserLists(user)));
                navigate(`/list/${id}`);
              });
            });
          }}
        >
          Copy
        </li>
        <li
          className="context-menu-item"
          onClick={async () => {
            if (props.id === id) navigate("/");
            setDisplay(false);
            deleteList(props.id).then(async () => {
              dispatch(setUsersLists(await updateUserLists(user)));
            });
          }}
        >
          Delete
        </li>
      </ul>
    </div>
  );
};

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectLists);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const funct = async () => {
      dispatch(setUsersLists(await updateUserLists(user)));
    };
    funct();
  }, [user]);

  return (
    <div id="side-bar">
      <div id="nav-container">
        <button
          type="button"
          id="createNew"
          onClick={async () => {
            const id: string = await createNewList();
            dispatch(setUsersLists(await updateUserLists(user)));
            navigate(`/list/${id}`);
          }}
        >
          Create New List
        </button>
        <div id="divider"></div>
        {lists?.map((element, index) => (
          <NavList
            id={element.id}
            title={element.title}
            index={index}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
