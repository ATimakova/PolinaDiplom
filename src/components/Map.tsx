import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "../css/Map.css";
import { EventType, IEvent } from "../types/IEvent";
import moment from "moment";
import { getTypeName } from "../common/constants";
import EditForm from "./EditForm";
import { useSelector } from "react-redux";
import { ReduxState } from "../types/types";
import InformPopup from "./InformPopup";

let map: mapboxgl.Map;
const MAP_STYLE_URL = "mapbox://styles/mapbox/streets-v11";
const center: LngLatLike = [40.412635, 56.141972];

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FyYWthem92IiwiYSI6ImNsNDFuY2tqNDA3bmQza2tjaWpraXkxZGcifQ.RXWBqGkSgaiwiAZcriLQ_Q";

const Map = () => {
  const role = useSelector(({ user }: ReduxState) => user?.role);
  const userName = useSelector(({ user }: ReduxState) => user?.userName);
  const events = useSelector(({ events }: ReduxState) => events?.events);
  const myEvents = useSelector(({ events }: ReduxState) => events?.myEvents);
  const [event, setEvent] = useState<number | null>(null);

  const [editEvent, setEditEvent] = useState<IEvent | null>(null);
  const [addEvent, setAddEvent] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<LngLat | null>(null);

  useLayoutEffect(() => {
    map = new mapboxgl.Map({
      container: "map",
      style: MAP_STYLE_URL,
      zoom: 16,
      center: center,
      fadeDuration: 0,
    });
    map?.on("load", () => {
      requestAnimationFrame(() => {
        const getBoundsFromViewport = map.getBounds();
        map.setMaxBounds(getBoundsFromViewport);
      });
    });
  }, []);

  useEffect(() => {
    if (role === "ROLE_ADMIN") {
      const addEvent = new MapboxGLButtonControl({
        className: "mapbox-gl-show_add_form",
        eventHandler: showAddEventForm,
      });
      map?.addControl(addEvent, "top-right");
    } else {
      document
        .querySelectorAll(".mapbox-gl-show_add_form")
        .forEach((el) => el.remove());
    }
  }, [role]);

  const setMarker = useCallback(
    (e: any) => {
      if (addEvent) {
        setCoordinates(e.lngLat);
        const markerAddElement = document.createElement("div");
        markerAddElement.id = `marker-add`;
        const markerAdd = new mapboxgl.Marker(markerAddElement, {
          draggable: true,
        })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map);

        markerAdd.on("dragend", () => {
          const lngLat = markerAdd.getLngLat();
          setCoordinates(lngLat);
        });
      }
    },
    [addEvent]
  );
  const handleClickRef = useRef(setMarker);
  handleClickRef.current = setMarker;

  const closeForm = () => {
    setEditEvent(null);
    setAddEvent(false);
    setCoordinates(null);
    document.querySelectorAll("#marker-add").forEach((el) => el.remove());
  };

  const showAddEventForm = () => {
    setEditEvent(null);
    setAddEvent(true);
    map?.on("click", (event) => handleClickRef.current(event));
  };
  const buyTicket = (id: number) => {
    map?.fire("closeAllPopups");
    setEvent(id);
  };

  const handleEditEvent = (event: IEvent) => {
    map?.fire("closeAllPopups");
    setEditEvent(event);
  };

  useEffect(() => {
    map?.fire("closeAllPopups");
    document.querySelectorAll(".marker").forEach((el) => el.remove());
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
            (role === "ROLE_USER" || userName === null) &&
            (event.type === EventType.EVENT ||
              event.type === EventType.ATTRACTION)
          ) {
            const form = document.createElement("form");
            form.onsubmit = () => buyTicket(event.id);

            const btnBuy = document.createElement("button");
            if (myEvents.find((i: IEvent) => i.id === event.id)) {
              btnBuy.className = "";
              btnBuy.innerHTML = `Билет уже куплен`;
              btnBuy.disabled = true;
            } else {
              btnBuy.className = "button button-buy";
              btnBuy.innerHTML = `Купить`;
              btnBuy.id = "event-" + event.id;
              btnBuy.addEventListener("click", () => {
                buyTicket(event.id);
              });
            }
            htmlContent.appendChild(btnBuy);
          }
          if (role === "ROLE_ADMIN") {
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
  }, [events, myEvents]);

  return (
    <div className="map-container">
      <div id="map"></div>
      {(editEvent || addEvent) && (
        <EditForm
          editData={editEvent}
          coordinates={coordinates}
          closeForm={closeForm}
        ></EditForm>
      )}
      {event && (
        <InformPopup
          eventId={event}
          closeForm={() => setEvent(null)}
        ></InformPopup>
      )}
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
