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
          // return res.ok
           // ? res.json()
              return [
                {
                  id: 1,
                  name: "event1",
                  date: new Date(),
                  description: "description 1",
                  lng: 56.141272,
                  lat: 40.412635,
                  type: EventType.ACTIVITY,
                },
                {
                  id: 2,
                  name: "event2",
                  date: new Date(),
                  description: "description 2",
                  lng: 56.141372,
                  lat: 40.412235,
                  type: EventType.ADMINISTRATION,
                },
                
                {
                  id: 3,
                  name: "event3",
                  date: new Date(),
                  description: "description 3",
                  lng: 56.141372,
                  lat: 40.413235,
                  type: EventType.EVENT,
                  price: 10
                },
              ];
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
  public addEvents(data: IEventForm, access_token: string, ): Promise<IEvent[]> {
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
