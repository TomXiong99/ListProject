import "../styles/app.scss";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./routes/home";
import PageNotFound from "./routes/pageNotFound";
import Login from "./routes/login";
import Template from "./routes/template";
import { useAppDispatch } from "../store/hooks";
import { login, setUsersLists, userList } from "../store/userSlice";
import List from "./routes/list";
import { updateUserLists } from "./fetch/front";
import User from "./routes/user";

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:8888/api/login", { credentials: "include" })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.loggedIn) {
          dispatch(login(data.user));
          dispatch(setUsersLists(await updateUserLists(data.user)));
        } else navigate("login");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Template />}>
          <Route path="/" element={<Home />} />
          <Route path="/list/:id" element={<List />} />
          <Route path="/user/:user" element={<User />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
