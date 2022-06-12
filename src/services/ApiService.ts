import { DEV_API } from "../common/constants";
import { IEvent, IEventForm } from "../types/IEvent";
import { IReportEvent } from "../types/IReportEvent";

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
   * Отредактировать мероприятие
   * @returns {Promise<IEvent[]>}
   */
   public editEvent(data: IEventForm, access_token: string, ): Promise<IEvent[]> {
    const url = `${DEV_API}/updateEvent/${data.id}`;
    return new Promise((result, error) => {
      fetch(url, {
        method: "PUT",
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
   public buyTicket(id: number, access_token: string, ): Promise<Response> {
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
          return result(res)
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

    /**
   * Получить список мероприятий юзера
   * @returns {Promise<IEvent[]>}
   */
     public getMyEvents(access_token: string): Promise<IEvent[]> {
      const url = `${DEV_API}/myEvents`;
      return new Promise((result, error) => {
        fetch(url, {
          method: "GET",
          headers: {
            'Accept': "application/json",
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

    
    /**
   * Получить список мероприятий юзера
   * @returns {Promise<IEvent[]>}
   */
     public getEventsReport(access_token: string, type: string, from: string, to: string): Promise<IReportEvent[]> {
      const url = `${DEV_API}/report?type=${type}&from=${from}&to=${to}`;
      return new Promise((result, error) => {
        fetch(url, {
          method: "GET",
          headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${access_token}`,
          },
        })
          .then((res) => {
            return res.json()
          })
          .then((events: IReportEvent[]) => {
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
