import moment from "moment";
import { DEV_API } from "../common/constants";
import { EventType, IEvent, IEventForm } from "../types/IEvent";

/**
 * Сервис для получения данных
 */
class ApiService {
  /**
   * Получить список мероприятий
   * @returns {Promise<IEvent[]>}
   */
  public getEvents(): Promise<IEvent[]> {
    const url = `${DEV_API}/events`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => {
          return res.json()
        })
        .then((events: IEvent[]) => {
          return result(events);
        })
        .catch((err) => {
          console.error(err);
          result([]);
        });
    });
  }

  /**
   * Добавить новое мероприятие
   * @returns {Promise<IEvent[]>}
   */
  public addEvent(data: IEventForm, access_token: string, ): Promise<IEvent[]> {
    const url = `${DEV_API}/createEvent`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-type': "application/json",
            'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json()
        })
        .then((events: IEvent[]) => {
          return result(events);
        })
        .catch((err) => {
          console.error(err);
          result([]);
        });
    });
  }

  
  /**
   * Добавить новое мероприятие
   * @returns {Promise<IEvent[]>}
   */
   public editEvents(data: IEventForm, access_token: string, ): Promise<IEvent[]> {
    const url = `${DEV_API}/createEvent`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-type': "application/json",
            'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          return res.json()
        })
        .then((events: IEvent[]) => {
          return result(events);
        })
        .catch((err) => {
          console.error(err);
          result([]);
        });
    });
  }

  /**
   * Купить билет на мероприятие
   * @returns {Promise<IEvent[]>}
   */
   public buyTicket(id: number, access_token: string, ): Promise<IEvent[]> {
    const url = `${DEV_API}/secureEvent/${id}`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "POST",
        headers: {
            'Accept': "application/json",
            'Content-type': "application/json",
            'Authorization': `Bearer ${access_token}`,
        },
      })
        .then((res) => {
          return res.json()
        })
        .then((events: IEvent[]) => {
          return result(events);
        })
        .catch((err) => {
          console.error(err);
          result([]);
        });
    });
  }
}

export default new ApiService();
