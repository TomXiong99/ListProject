import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser, setUsersLists } from "../../store/userSlice";
import "../../styles/home.scss";
import "../../styles/content.scss";
import { createNewList } from "../fetch/back";
import { updateUserLists } from "../fetch/front";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className="content">
      <div id="home">
        <h3>Create a New List</h3>
        <button
          type="button"
          onClick={async () => {
            const id: string = await createNewList();
            dispatch(setUsersLists(await updateUserLists(user)));
            console.log(id);
            navigate(`/list/${id}`);
          }}
        >
          Create New
        </button>
      </div>
    </div>
  );
};

export default Home;
