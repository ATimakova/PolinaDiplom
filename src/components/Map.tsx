import mapboxgl, { LngLatBoundsLike, LngLatLike } from "mapbox-gl";
import { useEffect, useLayoutEffect, useState } from "react";
import "../Map.css";
import { EventType, IEvent } from "../types/IEvent";
import ApiService from "../services/ApiService";
import moment from "moment";
import { getTypeName } from "../common/constants";
import AuthService from "../services/AuthService";

let map: mapboxgl.Map | undefined;
const MAP_STYLE_URL = "mapbox://styles/mapbox/streets-v11";
const center: LngLatLike = [40.412635, 56.141972];

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FyYWthem92IiwiYSI6ImNsNDFuY2tqNDA3bmQza2tjaWpraXkxZGcifQ.RXWBqGkSgaiwiAZcriLQ_Q";

const fitBounds: LngLatBoundsLike = [
  [40.40655600932007, 56.149100338408924],
  [40.417959503446, 56.140395670823484],
];
const Map = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    ApiService.getEvents().then((data) => {
      setEvents(data);
    });
  }, []);

  useLayoutEffect(() => {
    map = new mapboxgl.Map({
      container: "map",
      style: MAP_STYLE_URL,
      zoom: 16,
      center: center,
      fadeDuration: 0,
      // maxBounds: fitBounds,
    });
  }, []);

  const buyTicket = (id: number) => {
    console.log("buy ticket " + id);
    ApiService.buyTicket(id, AuthService.getCurrentUser()?.accessToken);
  };

  const editEvent = (id: number) => {
    console.log("edit " + id);
  };

  useEffect(() => {
    if (events.length > 0) {
      console.log("events", events);
      events.forEach((event: IEvent) => {
        const marker = document.createElement("div");
        marker.id = `marker-${event.id}`;
        marker.className=`marker marker-${EventType[event.type]}`;

        if (map) {
          const htmlContent = document.createElement("div");
          const name = document.createElement("div");
          name.className = "event event-name";
          name.innerHTML = `${event.name}`;
          htmlContent.appendChild(name);

          if (event.type === EventType.EVENT) {
            const date = document.createElement("div");
            date.className = "event event-date";
            date.innerHTML = `Дата: ${moment(event.date).format(
              "DD.MM.YYYY HH:mm"
            )}`;
            htmlContent.appendChild(date);
          }

          const description = document.createElement("div");
          description.className = "event event-description";
          description.innerHTML = `Описание: ${event.description}`;
          htmlContent.appendChild(description);

          const type = document.createElement("div");
          type.className = "event event-type";
          type.innerHTML = `Тип: ${getTypeName(event.type)}`;
          htmlContent.appendChild(type);

          const position = document.createElement("div");
          position.className = "event event-position";
          position.innerHTML = `Тип: ${[event.lng, event.lat]}`;
          htmlContent.appendChild(position);
          if (
            (AuthService.getCurrentUser()?.role === "user" ||
              AuthService.getCurrentUser() === null) &&
            (event.type === EventType.EVENT ||
              event.type === EventType.ATTRACTION)
          ) {
            const btnBuy = document.createElement("div");
            btnBuy.className = "button-buy";
            btnBuy.innerHTML = `Купить`;
            btnBuy.addEventListener("click", () => buyTicket(event.id));
            htmlContent.appendChild(btnBuy);
          }
          if (AuthService.getCurrentUser()?.role === "admin") {
            const editButton = document.createElement("div");
            editButton.className = "button button-edit";
            editButton.innerHTML = `Редактировать`;
            editButton.addEventListener("click", () => editEvent(event.id));
            htmlContent.appendChild(editButton);
          }
          // create the popup
          const popup = new mapboxgl.Popup({ offset: 10 }).setDOMContent(
            htmlContent
          );
          // create the marker
          new mapboxgl.Marker(marker)
            .setLngLat([event.lat, event.lng])
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);
        }
      });
    }
  }, [events, map]);

  return <div id="map"></div>;
};

export default Map;
