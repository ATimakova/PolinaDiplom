import { SetStateAction, useEffect, useState } from "react";
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useFormikContext,
  useFormik,
} from "formik";
import * as Yup from "yup";
import "../EditForm.css";
import { EventType, IEventForm } from "../types/IEvent";
import { getTypeName } from "../common/constants";
import moment from "moment";
import ApiService from "../services/ApiService";
import AuthService from "../services/AuthService";

type Props = {
  editData?: IEventForm | null;
  coordinates?: mapboxgl.LngLat | null;
};

const EditForm = (props: Props) => {
  const validationSchema = () => {
    return Yup.object().shape({
      name: Yup.string().required("Это поле обязательное!"),
      eventDate: Yup.string().required("Это поле обязательное!").nullable(),
      description: Yup.string().required("Это поле обязательное!"),
      lng: Yup.number().required("Это поле обязательное!").nullable(),
      lat: Yup.number().required("Это поле обязательное!").nullable(),
      type: Yup.string().required("Это поле обязательное!"),
      price: Yup.number().required("Это поле обязательное!").nullable(),
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      eventDate: undefined,
      description: "",
      lng: undefined,
      lat: undefined,
      type: EventType.EVENT,
      price: undefined,
    },
    onSubmit: (values) => handleSubmit(values),
    validationSchema,
  });

  useEffect(() => {
    if (props.editData) {
      formik.setValues({
        ...props.editData,
        //@ts-ignore
        eventDate: moment(props.editData.date).format("YYYY-MM-DDTHH:mm:ss"),
      });
    }
  }, [props.editData?.id]);

  useEffect(() => {
    console.log(props.coordinates, formik.values);
    if(props.coordinates?.lat)
    formik.setValues({
      ...formik.values,
      //@ts-ignore
      lat: props.coordinates?.lat,
      //@ts-ignore
      lng: props.coordinates?.lng,
    });
  }, [props.coordinates]);

  const handleSubmit = (formValue: any) => {
    console.log(
      "🚀 ~ file: EditForm.tsx ~ line 66 ~ handleSubmit ~ formValue",
      formValue
    );
    const token = AuthService.getCurrentUser().token;
    console.log("🚀 ~ file: EditForm.tsx ~ line 78 ~ handleSubmit ~ token", token)
    if (token) {
      if (props.editData?.id) {
        // ApiService.e(userData)
        //   .then((response: IUser) => {
        //     if (response.token) {
        //       localStorage.setItem("user", JSON.stringify(response));
        //     }
        //     setLoading(false);
        //     setMessage("");
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //     setMessage("");
        //     setLoading(false);
        //   });
      } else {
        ApiService.addEvent(formValue, token)
          .then((response: any) => {
            console.log(
              "🚀 ~ file: EditForm.tsx ~ line 70 ~ .then ~ response",
              response
            );
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  };

  return (
    <div className="edit-form__container">
      <div className="title-form">
        {props.editData?.id ? "Редактирование маркера" : "Создание маркера"}
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="name">Название</label>
              <input
                name="name"
                type="text"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            {formik.errors.name && formik.touched.name ? (
              <div className="alert alert-danger">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="eventDate">Дата</label>
              <input
                name="eventDate"
                type="datetime-local"
                className="form-control"
                onChange={formik.handleChange}
                value={moment(formik.values.eventDate).format("YYYY-MM-DDTHH:mm:ss")}
              />
            </div>
            {formik.errors.eventDate && formik.touched.name ? (
              <div className="alert alert-danger">{formik.errors.eventDate}</div>
            ) : null}
          </div>
          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="description">Описание</label>
              <textarea
                name="description"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>

            {formik.errors.description && formik.touched.description ? (
              <div className="alert alert-danger">
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="lng">Координаты</label>
              <input
                name="lng"
                type="number"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.lng}
              />
              <input
                name="lat"
                type="number"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.lat}
              />
            </div>
            {(formik.errors.lng && formik.touched.lng) ||
            (formik.errors.lat && formik.touched.lat) ? (
              <div className="alert alert-danger">
                {formik.errors.lng || formik.errors.lat}
              </div>
            ) : null}
          </div>

          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="type">Тип</label>
              <select
                name="type"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.type}
              >
                <option value={EventType.EVENT} label={getTypeName(EventType.EVENT)} />
                <option value={EventType.ATTRACTION} label={getTypeName(EventType.ATTRACTION)} />
                <option
                  value={EventType.ADMINISTRATION}
                  label={getTypeName(EventType.ADMINISTRATION)}
                />
                <option value={EventType.ACTIVITY} label={getTypeName(EventType.ACTIVITY)} />
              </select>
            </div>

            {formik.errors.type && formik.touched.type ? (
              <div className="alert alert-danger">{formik.errors.type}</div>
            ) : null}
          </div>
          <div className="form-group">
            <div className="flex-container">
              <label htmlFor="price">Стоимость</label>
              <input
                name="price"
                type="number"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.price}
              />
            </div>
            {formik.errors.price && formik.touched.price ? (
              <div className="alert alert-danger">{formik.errors.price}</div>
            ) : null}
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">
            <span>Сохранить</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditForm;
