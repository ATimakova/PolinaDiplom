import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../css/Login.css";
import AuthService from "../services/AuthService";
import { IUser } from "../types/IUser";
import { useDispatch } from "react-redux";
import { setRole, setToken, setUserName } from "../actions/UserActions";

const Login = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const history = useHistory();
  
  const initialValues = {
    login: "",
    password: "",
  };

  const validationSchema = () => {
    return Yup.object().shape({
      login: Yup.string().required("Это поле обязательное!"),
      password: Yup.string().required("Это поле обязательное!"),
    });
  };

  const handleLogin = (formValue: { login: string; password: string }) => {
    setMessage("");
    setLoading(true);
    const userData = { login: formValue.login, password: formValue.password };
    AuthService.login(userData)
      .then((response: IUser) => {
        if (response.token) {
          localStorage.setItem("user", JSON.stringify(response));
          dispatch(setToken(response.token));
          dispatch(setRole(response.role));
          dispatch(
            setUserName(
              response.surname + " " + response.name + " " + response.middleName
            )
          );
          history.push("/home");
        }
        setLoading(false);
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        setMessage("");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-3">
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(formValue) => handleLogin(formValue)}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="login">Логин</label>
                <Field name="login" type="text" className="form-control" />
                <ErrorMessage
                  name="login"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Войти</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default Login;
