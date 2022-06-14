import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../css/Reports.css";
import { ReduxState } from "../types/types";
import { useFormik } from "formik";
import { IReportEvent } from "../types/IReportEvent";
import ApiService from "../services/ApiService";
import { EventType } from "../types/IEvent";

const items = [
  { title: "Мероприятия", type: EventType.EVENT },
  { title: "Аттракционы", type: EventType.ATTRACTION },
];

const Reports = () => {
  const currentUser = useSelector(({ user }: ReduxState) => user);
  const [active, setActive] = useState(0);

  const openTab = (e: any) => {
    setActive(+e.target.dataset.index);
  };

  return currentUser.role === "ROLE_ADMIN" ? (
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
      Данная страница доступна только для администраторов!
    </div>
  );
};
export default Reports;

const TableContent = ({ title, type }: { title: any; type: string }) => {
  const currentUser = useSelector(({ user }: ReduxState) => user);

  const [reports, setReports] = useState<IReportEvent[]>([]);

  const formik = useFormik({
    initialValues: {
      from: moment().startOf("day").format("YYYY-MM-DDTHH:mm"),
      to: moment().endOf("day").format("YYYY-MM-DDTHH:mm"),
    },
    onSubmit: (values) => {
      if (values.from && values.to) {
        ApiService.getEventsReport(
          currentUser.token,
          type,
          values.from,
          values.to
        ).then((reports: IReportEvent[]) => {
          setReports(reports);
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
                <th>Количество купленных билетов</th>
                <th>Общая сумма</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report: IReportEvent) => {
                return (
                  <tr>
                    <td>{report.name}</td>
                    <td>{report.countTickets}</td>
                    <td>{report.totalAmount}</td>
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
