import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, selectUser } from "../store/userSlice";
import "../styles/topBar.scss";

const TopBar = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const editSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };
  return (
    <div id="top-bar">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/user/${search}`);
        }}
      >
        <input
          id="search-bar"
          type={"text"}
          value={search}
          onChange={editSearch}
          placeholder="Search For User..."
        />
      </form>
      <h2>{user}</h2>
      <button
        type="button"
        id="logout"
        onClick={() => {
          dispatch(logout);
          fetch("http://localhost:8888/api/login", {
            method: "DELETE",
            credentials: "include",
          }).then(() => navigate("/login"));
        }}
      >
        Logout
        <img
          src="https://cdn-icons-png.flaticon.com/512/3840/3840829.png"
          alt="Logout symbol"
        />
      </button>
    </div>
  );
};

export default TopBar;
