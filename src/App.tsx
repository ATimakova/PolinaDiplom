import "./css/App.css";
import Map from "./components/Map";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "./types/types";
import { setRole, setToken, setUserName } from "./actions/UserActions";
import { useEffect } from "react";
import ApiService from "./services/ApiService";
import { setEvents } from "./actions/EventsActions";

const App = () => {
  const currentUser = useSelector(({ user }: ReduxState) => user);

  const dispatch = useDispatch();

  useEffect(() => {
    ApiService.getEvents().then((data) => {
      dispatch(setEvents(data));
    });
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      dispatch(setToken(user.token));
      dispatch(setRole(user.role));
      dispatch(
        setUserName(user.surname + " " + user.name + " " + user.middleName)
      );
    }
  }, []);

  const logout = () => {
    dispatch(setToken(undefined));
    dispatch(setRole(undefined));
    dispatch(setUserName(""));
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {currentUser.token ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <div className="nav-link">
                {currentUser.userName}
              </div>
            </li>
            <li className="nav-item">
              <div className="nav-link logout btn-primary" onClick={logout}>
                Выйти
              </div>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link btn-primary">
                Войти
              </Link>
            </li>
          </div>
        )}
      </nav>

      <Switch>
        <Route exact path={["/", "/home"]} component={Map} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </div>
  );
};

export default App;
