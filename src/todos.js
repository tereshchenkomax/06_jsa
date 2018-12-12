import {Dispatcher} from './flux/Dispatcher'
import {ReduceStore} from './flux/ReduceStore'
import {generate as id} from 'shortid'

const todoDispatcher = new Dispatcher()

const CREATE_TODO = 'CREATE_TODO'
const COMPLETE_TODO = 'COMPLETE_TODO'
const SHOW_COMPLETED = 'SHOW_COMPLETED'

class TodoReduceStore extends ReduceStore{
	getInitialState() {
		return {
			todos: [
				{
					id: id(),
					content: ' Выучить Флакс ',
					completed: false
				},
				{
					id: id(),
					content: ' Выучить Redux ',
					completed: false
				},
				{
					id: id(),
					content: ' Drink Beer ',
					completed: true
				}
			],
			showCompleted: true
		}
	}
	reducer(state, action) {
		const {type, payload} = action
		let newState = {}
		let idx
		switch (type) {
		case CREATE_TODO:
			newState = {...state, ...{todos: [...state.todos]}}
			newState.todos.push({
				id: id(),
				content: payload.todo,
				completed: false
			})
			return newState
		case COMPLETE_TODO:
			newState = {...state, ...{todos: [...state.todos]}}
			idx = newState.todos.findIndex(t => t.id === payload.id )
			newState.todos[idx] = {...state.todos[idx], ...{completed: payload.completed}}
			return newState
		case SHOW_COMPLETED:
			return {...state, ...{showCompleted : payload.show}}
		default:
			return {...state}
		}
	}
}

const todoReduceStore = new TodoReduceStore(todoDispatcher)

const createTodo = todo => ({
	type: CREATE_TODO,
	payload: {todo}
})

const completeTodo = (id, completed) => ({
	type: COMPLETE_TODO,
	payload: {id, completed}
})

const showCompleted = (show) => ({
	type: SHOW_COMPLETED,
	payload: {show}
})

document
	.getElementById('showComplete')
	.addEventListener('change',({target})=>{
		const show = target.checked
		todoDispatcher.dispatch(showCompleted(show))
	})

document
	.forms
	.newTask
	.addEventListener('submit', e => {
		e.preventDefault()
		const todo = e.target.newTaskName.value
		todoDispatcher.dispatch(createTodo(todo))
		e.target.newTaskName.value = ''
	})

document
	.forms
	.undo
	.addEventListener('submit', e => {
		e.preventDefault()
		todoReduceStore.revert()
	})

const templateTodoComponent = ({id, content, completed}) => {
	return `
	<section>
		<label for="el-${id}">${content}</label>
		<input id="el-${id}" name="todoCheckbox" ${completed ? 'checked' : ''}
			data-taskid="${id}" type="checkbox">
	</section>
	`
}

const undoBtn = document.forms.undo.firstElementChild
const undoBtnText = undoBtn.textContent

const render = () => {
	const {todos, showCompleted} = todoReduceStore.getState()
	console.log(todos)
	document.getElementById('tasks').innerHTML = todos
		.filter(todo => (showCompleted ? true : !todo.completed))
		.map(templateTodoComponent)
		.join('')
	document.getElementsByName('todoCheckbox').forEach( el => {
		el.addEventListener('change',({target}) => {
			const completed = target.checked
			const id = target.dataset.taskid
			todoDispatcher.dispatch(completeTodo(id,completed))
		})
	})
	document.getElementById('showComplete').checked = showCompleted
	if (todoReduceStore.isHistory()){
		undoBtn.disabled = false
		undoBtn.textContent = undoBtnText + ' - ' + todoReduceStore.__history.length
	} else {
		undoBtn.disabled = true
		undoBtn.textContent = undoBtnText
	}
}

render()

todoReduceStore.addEventListener(render)
