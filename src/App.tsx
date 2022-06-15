import "./css/App.css";
import Map from "./components/Map";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux";
import { ReduxState } from "./types/types";
import { setRole, setToken, setUserName } from "./actions/UserActions";
import { useEffect } from "react";
import ApiService from "./services/ApiService";
import { setEvents, setMyEvents } from "./actions/EventsActions";
import MyTickets from "./components/MyTickets";
import Reports from "./components/Reports";
import Posters from "./components/FutureEvent";

const App = () => {
  const currentUser = useSelector(({ user }: ReduxState) => user);
  const token = useSelector(({ user }: ReduxState) => user?.token);

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

  useEffect(() => {
    if (token && currentUser.role === "ROLE_USER") {
      ApiService.getMyEvents(token).then((data) => {
        dispatch(setMyEvents(data));
      });
    } else {
      dispatch(setMyEvents([]));
    }
  }, [token]);

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
            <Link to={"/"} className="nav-link active">
                Главная
              </Link>
              
            {
            currentUser.role === "ROLE_USER" &&
              <Link to={"/posters"} className="nav-link">
                Афиша
              </Link>
            }
            {
            currentUser.role === "ROLE_USER" &&
              <Link to={"/my-tickets"} className="nav-link">
                Мои билеты
              </Link>
            }
            {
            currentUser.role === "ROLE_ADMIN" &&
              <Link to={"/reports"} className="nav-link">
                Отчеты
              </Link>
            }
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
        <Route exact path="/my-tickets" component={MyTickets} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/posters" component={Posters} />
      </Switch>
    </div>
  );
};

export default App;
