import { DEV_API } from "../common/constants";
import { IUser } from "../types/IUser";

/**
 * Сервис для авторизации
 */
class AuthService {
  /**
   * Логин
   * @returns {Promise<IUser>}
   */
  public login(data: {login: string, password: string}): Promise<IUser> {
    const url = `${DEV_API}/auth`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "POST",
        headers: {
          'Accept': "application/json",
          'Content-type': "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response: any) => {
          return response.json();
        })
        .then((response: IUser) => {
          return result(response);
        })
        .catch((err) => {
          console.error(err);
          return err
        });
    });
  }

  //   public register(username: string, email: string, password: string) {
  //     return axios.post(API_URL + "signup", {
  //       username,
  //       email,
  //       password
  //     });
  //   }

}

export default new AuthService();
