import "./App.css";
import Map from "./components/Map";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthService from "./services/AuthService";

const App = () => {

  const currentUser = AuthService.getCurrentUser()
  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.surname + " " + currentUser.name + " " + currentUser.middleName}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={()=>AuthService.logout()}>
                  Выйти
                </a>
              </li>
            </div>
          ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Войти
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Зарегистрироваться
              </Link>
            </li> */}
          </div>
          )
        }
      </nav>

        <Switch>
          <Route exact path={["/", "/home"]} component={Map} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
    </div>
  );
};

export default App;
