import { EventType } from "../types/IEvent";

export const DEV_API = "http://localhost:8080";

export const getTypeName = (type: EventType): string => {
  switch (type) {
    case "EVENT":
      return "Мероприятие";
    case "ATTRACTION":
      return "Аттракцион";
    case "ADMINISTRATION":
      return "Администрация";
    case "ACTIVITY":
      return "Спорт/активность";
    default:
      return "Мероприятие";
  }
};
