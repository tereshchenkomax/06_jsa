export function createStore(reducer, initialState){
	let state = initialState
	let callbacks = []
	const getState = () => state
	const dispatch = action => { //updates state
		state = reducer(state, action)
		callbacks.forEach(cb => cb())
	}
	const subscribe = cb => {
		callbacks.push(cb)
		return () => {
			callbacks = callbacks.filter(fn => fn !== cb);
		}
	}
	return {getState, dispatch, subscribe}
}
