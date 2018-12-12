import {data} from './data'
import {createStore} from './redux/Store'
import {generate as id} from 'shortid'

const ADD = 'ADD'
const store = createStore(reducer,data)
const statusSelect = document.getElementById('status-select')

function actionAdd(amount) {
	return {
		type: ADD,
		amount
	}
}

function reducer(state, action) {
	switch (action.type) {
	case ADD:
		state.players.push({
			id: id(), name: action.amount, result: 1, status: 3
		})
		return state

	default:
		return state
	}
}

const templateTableComponent = ({id, name, result, status, filtered = false, number}) => {
	return `
	<tr id="el-${id}" class="${filtered ? 'table-info' : ''}">
		<td>${number}</td>
		<td>${name}</td>
		<td>${result}</td>
		<td>${status == 1 ? 'Pro' : status == 2 ? 'Beginer' : 'Amateur'}</td>
	</tr>
	`
}

const templateStatusComponent = ({id, title, selected}) => {
	return `
	<option value="${id}" ${selected ? 'selected' : ''}>${title}</option>
	`
}

store.subscribe(()=> console.log(store.getState()))

const render = (select) => {
	let itemNumber = 1
	const {players, statuses} = store.getState()
	let filteredPlayers = players.map((player)=> {
		player.number = itemNumber
		itemNumber++
		if (player.status == select) {
			player.filtered = true
			return player
		} else {
			player.filtered = false
			return player
		}
	})
	let filteredStatuses = statuses.map(status => {
		(status.id == select) ? status.selected = true : status.selected = false
		return status
	})
	console.log(filteredStatuses)
	statusSelect.innerHTML = filteredStatuses.map(templateStatusComponent).join('')
	document.getElementById('results').innerHTML = filteredPlayers
		.map(templateTableComponent)
		.join('')
}

render()

document
	.forms
	.addPlayer
	.addEventListener('submit', e => {
		e.preventDefault()
		store.dispatch(actionAdd(e.target[0].value))
		render()
	})

statusSelect.addEventListener('change',()=>{
	render(statusSelect.value)
})