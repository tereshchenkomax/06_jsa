class Store {
	constructor(dispatcher){
		this.__state = this.getInitialState(),
		dispatcher.register(this.__onDispatch.bind(this)),
		this.__listeners = []
	}
	getInitialState(){
		throw new Error(' getInitialState Method should be reassigned')
	}
	__onDispatch(action){
		throw new Error(' __onDispatch Method should be reassigned')
	}
	addEventListener(listener){
		this.__listeners.push(listener)
	}
	__changeEmit() {
		this.__listeners.forEach(l => l(this.__state))
	}
	getState(){
		return this.__state
	}
}

export {Store}