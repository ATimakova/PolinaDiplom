import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../css/Reports.css";
import { ReduxState } from "../types/types";
import { useFormik } from "formik";
import ApiService from "../services/ApiService";
import { EventType } from "../types/IEvent";
import { IPosterEvent } from "../types/IPoster";

const items = [
  { title: "Мероприятия", type: EventType.EVENT },
  { title: "Аттракционы", type: EventType.ATTRACTION },
];

const Posters = () => {
  const currentUser = useSelector(({ user }: ReduxState) => user);
  const [active, setActive] = useState(0);

  const openTab = (e: any) => {
    setActive(+e.target.dataset.index);
  };

  return currentUser.role === "ROLE_USER" ? (
    <div className="report-container">
      <div className="tab">
        {items.map((n, i) => (
          <button
            className={`tablinks ${i === active ? "active" : ""}`}
            onClick={openTab}
            data-index={i}
          >
            {n.title}
          </button>
        ))}
      </div>
      {items[active] && <TableContent {...items[active]} />}
    </div>
  ) : (
    <div className="col-md-12">
      Данная страница доступна только для пользователей!
    </div>
  );
};
export default Posters;

const TableContent = ({ title, type }: { title: any; type: string }) => {
  const currentUser = useSelector(({ user }: ReduxState) => user);

  const [posters, setPosters] = useState<IPosterEvent[]>([]);

  const formik = useFormik({
    initialValues: {
      from: moment().startOf("day").format("YYYY-MM-DDTHH:mm"),
      to: moment().endOf("day").format("YYYY-MM-DDTHH:mm"),
    },
    onSubmit: (values) => {
      if (values.from && values.to) {
        ApiService.getEventsPoster(
          currentUser.token,
          type,
          values.from,
          values.to
        ).then((posters: IPosterEvent[]) => {
          setPosters(posters);
        });
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      from: moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
      to: moment().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
    });
  }, [type]);

  return (
    <>
      <div className="tabcontent">
        <div className="filter">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <div className="flex-container">
                <input
                  name="from"
                  type="datetime-local"
                  min={ moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss")}
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.from}
                />
              </div>
              {formik.errors.from && formik.touched.from ? (
                <div className="alert alert-danger">{formik.errors.from}</div>
              ) : null}
            </div>
            <div>-</div>
            <div className="form-group">
              <div className="flex-container">
                <input
                  name="to"
                  type="datetime-local"
                  min={ moment().endOf("day").format("YYYY-MM-DDTHH:mm:ss")}
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.to}
                />
              </div>
              {formik.errors.to && formik.touched.to ? (
                <div className="alert alert-danger">{formik.errors.to}</div>
              ) : null}
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                <span>Применить</span>
              </button>
            </div>
          </form>
        </div>
        <div className="report-table ">
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Дата</th>
                <th>Цена</th>
              </tr>
            </thead>
            <tbody>
              {posters.map((poster: IPosterEvent) => {
                return (
                  <tr>
                    <td>{poster.name}</td>
                    <td>{poster.description}</td>
                    <td>{poster.date}</td>
                    <td>{poster.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
