import moment from 'moment'
import { useSelector } from 'react-redux'
import { getTypeName } from '../common/constants'
import '../css/MyTickets.css'
import { IEvent } from '../types/IEvent'
import { ReduxState } from '../types/types'

const MyTickets = () => {
	const myEvents = useSelector(({ events }: ReduxState) => events?.myEvents)
	const currentUser = useSelector(({ user }: ReduxState) => user)

	return currentUser.role === 'ROLE_USER' ? (
		<div className='col-md-12'>
			<table>
				<thead>
					<tr>
						<th colSpan={5}>Мои билеты</th>
					</tr>
					<tr>
						<th>Название</th>
						<th>Тип</th>
						<th>Местоположение</th>
						<th>Дата</th>
						<th>Стоимость, руб</th>
					</tr>
				</thead>
				<tbody>
					{myEvents.map((event: IEvent, index: number) => {
						return (
							<tr key={index}>
								<td>{event.name}</td>
								<td>{getTypeName(event.type)}</td>
								<td>{[event.lng, event.lat].toString()}</td>
								<td>{moment(event.date).format('DD.MM.YYYY HH:mm')}</td>
								<td>{event.price}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	) : (
		<div className='col-md-12'>Данная страница доступна только для пользователей!</div>
	)
}
export default MyTickets
