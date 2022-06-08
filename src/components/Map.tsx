import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import { useEffect, useLayoutEffect, useState } from "react";
import "../Map.css";
import { EventType, IEvent } from "../types/IEvent";
import ApiService from "../services/ApiService";
import moment from "moment";
import { getTypeName } from "../common/constants";
import AuthService from "../services/AuthService";
import EditForm from "./EditForm";

let map: mapboxgl.Map | undefined;
const MAP_STYLE_URL = "mapbox://styles/mapbox/streets-v11";
const center: LngLatLike = [40.412635, 56.141972];

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FyYWthem92IiwiYSI6ImNsNDFuY2tqNDA3bmQza2tjaWpraXkxZGcifQ.RXWBqGkSgaiwiAZcriLQ_Q";

// const fitBounds: LngLatBoundsLike = [
//   [40.40655600932007, 56.149100338408924],
//   [40.417959503446, 56.140395670823484],
// ];
const Map = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [editEvent, setEditEvent] = useState<IEvent | null>(null);
  const [addEvent, setAddEvent] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<LngLat | null>(null);

  useEffect(() => {
    ApiService.getEvents().then((data) => {
      console.log("🚀 ~ file: Map.tsx ~ line 30 ~ ApiService.getEvents ~ data", data)
      setEvents(data);
    });
  }, []);

  useLayoutEffect(() => {
    const showAddEventForm = () => {
      setEditEvent(null);
      setAddEvent(true);
      map?.on('click', (e) => {
        setCoordinates(e.lngLat)
        });
    };

    map = new mapboxgl.Map({
      container: "map",
      style: MAP_STYLE_URL,
      zoom: 16,
      center: center,
      fadeDuration: 0,
      // maxBounds: fitBounds,
    });
    if (AuthService.getCurrentUser()?.role === "ROLE_ADMIN") {
      const control = document.createElement("div");
      control.className = "event event-type";

      const addEvent = new MapboxGLButtonControl({
        className: "mapbox-gl-show_add_form",
        eventHandler: showAddEventForm,
      });

      map?.addControl(addEvent, "top-right");
    }
  }, []);

  const buyTicket = (id: number) => {
    console.log("buy ticket " + id);
    ApiService.buyTicket(id, AuthService.getCurrentUser()?.token);
  };

  const handleEditEvent = (event: IEvent) => {
    map?.fire("closeAllPopups");
    setEditEvent(event);
  };

  useEffect(() => {
    if (events.length > 0) {
      events.forEach((event: IEvent) => {
        const marker = document.createElement("div");
        marker.id = `marker-${event.id}`;
        marker.className = `marker marker-${EventType[event.type]}`;

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
          position.innerHTML = `Координаты: ${[event.lng, event.lat]}`;
          htmlContent.appendChild(position);
          if (
            (AuthService.getCurrentUser()?.role === "ROLE_USER" ||
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
          if (AuthService.getCurrentUser()?.role === "ROLE_ADMIN") {
            const editButton = document.createElement("div");
            editButton.className = "button button-edit";
            editButton.innerHTML = `Редактировать`;
            editButton.addEventListener("click", () => handleEditEvent(event));
            htmlContent.appendChild(editButton);
          }
          // create the popup
          const popup = new mapboxgl.Popup({ offset: 10 }).setDOMContent(
            htmlContent
          );
          // create the marker
          new mapboxgl.Marker(marker)
            .setLngLat([event.lng, event.lat])
            .setPopup(popup) // sets a popup on this marker
            .addTo(map);

          map.on("closeAllPopups", () => {
            popup.remove();
          });
        }
      });
    }
  }, [events]);

  return (
    <div className="map-container">
      <div id="map"></div>
      {(editEvent || addEvent) && <EditForm editData={editEvent} coordinates={coordinates}></EditForm>}
    </div>
  );
};

export default Map;

class MapboxGLButtonControl {
  private _className: string;
  _eventHandler: any;
  _btn: HTMLButtonElement | undefined;
  _container!: HTMLDivElement;
  _map: undefined;

  constructor({ className = "", eventHandler = (event: any) => {} }) {
    this._className = className;
    this._eventHandler = eventHandler;
  }

  onAdd() {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon " + this._className;
    this._btn.onclick = this._eventHandler;

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    if (this?._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }
}
