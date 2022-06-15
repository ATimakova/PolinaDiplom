import { useDispatch, useSelector } from "react-redux";
import "../css/PopupPayment.css";
import { ReduxState } from "../types/types";
import { useFormik } from "formik";
import ApiService from "../services/ApiService";
import { setMyEvents } from "../actions/EventsActions";
import * as Yup from "yup";

type IPopupPayment = {
  eventId: number;
  closeForm: () => void;
};
const PopupPayment = (props: IPopupPayment) => {
  const { eventId } = props;

  const dispatch = useDispatch();
  const token = useSelector(({ user }: ReduxState) => user?.token);

  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Это поле обязательное!").nullable(),
      date: Yup.string()
        .required("Это поле обязательное!")
        .matches(/([0-9]{2})\/([0-9]{2})/, "Неверный формат даты: MM/YY")
        .nullable(),
      cvc: Yup.string()
        .required("Это поле обязательное!")
        .nullable()
        .max(3, "Некорректно введен CVC")
        .min(3, "Некорректно введен CVC"),
      number: Yup.string()
        .required("Это поле обязательное!")
        .nullable()
        .min(16, "Номер карты должен содержать 16 символов")
        .max(16, "Номер карты должен содержать 16 символов"),
    });
  };

  const formik = useFormik({
    initialValues: {
      number: undefined,
      cvc: undefined,
      date: undefined,
      name: undefined,
    },
    onSubmit: () => buyTicket(eventId),
    validationSchema,
  });

  const buyTicket = (id: number) => {
    ApiService.buyTicket(id, token).then((resp) => {
      if (resp) {
        ApiService.getMyEvents(token).then((data) => {
          dispatch(setMyEvents(data));
        });
      }
    });
  };

  return (
    <div className="popup-payment-container">
      <div className="popup-payment">
        <div className="close-payment-form" onClick={() => props.closeForm()}>
          ×
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="number">Номер карты</label>
            <input
              name="number"
              type="number"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.number}
            />
            {formik.errors.number && formik.touched.number ? (
              <div className="alert alert-danger">{formik.errors.number}</div>
            ) : null}
          </div>

          <div className="form-group">
            <label htmlFor="name">Имя владельца</label>
            <input
              name="name"
              type="string"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name && formik.touched.name ? (
              <div className="alert alert-danger">{formik.errors.name}</div>
            ) : null}
          </div>
          <div className="form-group">
            <div className="flex-container flex-payment">
              <div className="form-group">
                <label htmlFor="date">Дата действия</label>
                <input
                  name="date"
                  type="string"
                  data-mask="MM/YY"
                  placeholder="MM/YY"
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.date}
                />
                {formik.errors.date && formik.touched.date ? (
                  <div className="alert alert-danger">{formik.errors.date}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="cvc">CVC</label>
                <input
                  name="cvc"
                  type="number"
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.cvc}
                />
                {formik.errors.cvc && formik.touched.cvc ? (
                  <div className="alert alert-danger">{formik.errors.cvc}</div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              <span>Оплатить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PopupPayment;
