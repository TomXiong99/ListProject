import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  content,
  selectUser,
  setUsersLists,
  userList,
} from "../../store/userSlice";
import { copyNewList } from "../fetch/back";
import { getList, getUser, updateUserLists } from "../fetch/front";
import "../../styles/content.scss";
import "../../styles/user.scss";

const getListfunc = async (id: string) => {
  return await getList(id).then((data) => data.contents);
};

const UserList = (props: { title: string; id: string }) => {
  const currentUser = useAppSelector(selectUser);
  const [list, setList] = useState<content[]>();
  const { user } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    getListfunc(props.id).then((data) => setList(data));
  }, []);
  return (
    <div className="listElement">
      <h3>{props.title}</h3>
      <ul className="scroll">
        {list?.map((element, index) => (
          <li key={index}>{element.content}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyNewList(props.title, list as content[]).then(async (id) => {
              dispatch(setUsersLists(await updateUserLists(currentUser)));
              navigate(`/list/${id}`);
            });
          }}
        >
          copy
        </button>
      </div>
    </div>
  );
};

const User = () => {
  const navigate = useNavigate();
  const { user } = useParams();
  const [lists, setLists] = useState<userList[]>();
  useEffect(() => {
    getUser(user as string)
      .then((data) => {
        if (data.message) navigate("/UserNotFound");
        return data.lists as userList[];
      })
      .then((data) => {
        setLists(data);
      });
  }, [user]);
  return (
    <div className="content">
      <div id="user-lists" className="scroll">
        <h2>{user}'s lists</h2>

        {lists?.map((element) => (
          <UserList title={element.title} id={element.id} key={element.id} />
        ))}
      </div>
    </div>
  );
};

export default User;
