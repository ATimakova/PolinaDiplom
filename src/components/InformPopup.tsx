import { useDispatch, useSelector } from 'react-redux'
import '../css/PopupPayment.css'
import { ReduxState } from '../types/types'
import { useFormik } from 'formik'
import ApiService from '../services/ApiService'
import { setMyEvents } from '../actions/EventsActions'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import InputMask from 'react-input-mask'
import moment from 'moment'

type IPopupPayment = {
	eventId: number
	closeForm: () => void
}
const PopupPayment = (props: IPopupPayment) => {
	const { eventId } = props

	const dispatch = useDispatch()
	const token = useSelector(({ user }: ReduxState) => user?.token)

	const validationSchema = () => {
		return Yup.object().shape({
			name: Yup.string()
				.required('Это поле обязательное!')
				.nullable()
				.matches(
					/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi,
					'Возможно использование только латинских символов!'
				)
				.matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Введите имя и фамилию!'),
			date: Yup.string()
				.required('Это поле обязательное!')
				.matches(/([0-9]{2})\/([0-9]{2})/, 'Неверный формат даты: MM/YY!')
				.nullable()
				.test('', 'Введите корректную дату! (ММ/ГГ)', (value) => {
					return moment(value).isValid()
				}),
			cvc: Yup.string()
				.required('Это поле обязательное!')
				.nullable()
				.min(3, 'Некорректно введен CVC!')
				.max(3, 'Некорректно введен CVC!'),
			number: Yup.string()
				.required('Это поле обязательное!')
				.nullable()
				.test('', 'Номер карты должен содержать 16 символов!', (value) => {
					return value?.replaceAll(/\s/g,'').replaceAll(/_/g,'')?.length === 16
				})
		})
	}

	const formik = useFormik({
		initialValues: {
			number: undefined,
			cvc: undefined,
			date: undefined,
			name: undefined,
		},
		onSubmit: () => buyTicket(eventId),
		validationSchema,
	})

	const buyTicket = (id: number) => {
		ApiService.buyTicket(id, token).then((resp) => {
			if (resp) {
				ApiService.getMyEvents(token).then((data) => {
					dispatch(setMyEvents(data))
					props.closeForm()
					toast.success('оплата прошла успешно!')
				})
			}
		})
	}

	return (
		<div className='popup-payment-container'>
			<div className='popup-payment'>
				<div className='close-payment-form' onClick={() => props.closeForm()}>
					×
				</div>
				<form onSubmit={formik.handleSubmit}>
					<div className='form-group'>
						<label htmlFor='number'>Номер карты</label>
						<InputMask
							mask='9999 9999 9999 9999'
							name='number'
							className='form-control'
							onChange={formik.handleChange}
							value={formik.values.number}></InputMask>
						{formik.errors.number && formik.touched.number ? (
							<div className='alert alert-danger'>{formik.errors.number}</div>
						) : null}
					</div>

					<div className='form-group'>
						<label htmlFor='name'>Имя владельца</label>
						<input
							name='name'
							type='string'
							className='form-control'
							onChange={formik.handleChange}
							value={formik.values.name}
						/>
						{formik.errors.name && formik.touched.name ? (
							<div className='alert alert-danger'>{formik.errors.name}</div>
						) : null}
					</div>
					<div className='form-group'>
						<div className='flex-container flex-payment'>
							<div className='form-group'>
								<label htmlFor='date'>Дата действия</label>
								<InputMask
									name='date'
									mask='99/99'
									placeholder='MM/YY'
									className='form-control'
									onChange={formik.handleChange}
									value={formik.values.date}></InputMask>
								{formik.errors.date && formik.touched.date ? (
									<div className='alert alert-danger'>{formik.errors.date}</div>
								) : null}
							</div>
							<div className='form-group'>
								<label htmlFor='cvc'>CVC</label>
								<InputMask
									name='cvc'
									mask='999'
									className='form-control'
									onChange={formik.handleChange}
									value={formik.values.cvc}></InputMask>
								{formik.errors.cvc && formik.touched.cvc ? (
									<div className='alert alert-danger'>{formik.errors.cvc}</div>
								) : null}
							</div>
						</div>
					</div>

					<div className='form-group'>
						<button type='submit' className='btn btn-primary btn-block'>
							<span>Оплатить</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
export default PopupPayment
