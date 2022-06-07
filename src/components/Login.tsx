import { Component, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../Login.css";
import AuthService from "../services/AuthService";
import IUser from "../types/IUser";

interface RouterProps {
  history: string;
}

type Props = RouteComponentProps<RouterProps>;

type State = {
  username: string;
  password: string;
  loading: boolean;
  message: string;
};
const Login = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [login, setUsername] = useState<string>();
  const [password, setpassword] = useState<string>();

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
                <label htmlFor="login">Login</label>
                <Field name="login" type="text" className="form-control" />
                <ErrorMessage
                  name="login"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
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
                  <span>Login</span>
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
