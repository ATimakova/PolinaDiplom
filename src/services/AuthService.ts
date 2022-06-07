import { DEV_API } from "../common/constants";
import { EventType, IEvent } from "../types/IEvent";

/**
 * Сервис для авторизации
 */
class AuthService {
  /**
   * Логин
   * @returns {Promise<any>}
   */
  public login(data: any): Promise<any> {
    console.log("🚀 ~ file: AuthService.ts ~ line 13 ~ AuthService ~ login ~ data", data)
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
          return result(response);
        })
        .catch((err) => {
          console.error(err);
          return err
        });
    });
  }

  public logout() {
    localStorage.removeItem("user");
  }

  //   public register(username: string, email: string, password: string) {
  //     return axios.post(API_URL + "signup", {
  //       username,
  //       email,
  //       password
  //     });
  //   }

  public getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
