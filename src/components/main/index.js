import { useRef, useState, useEffect, Fragment } from 'react';
import TodoItem from './TodoItem';
// STYLESHEETS
import styles from './main.module.css';

function Main(){
	// Ref of input element
	const todoInput = useRef();
	// App state
	const [state, setState] = useState(JSON.parse(localStorage.getItem('appState')) || null);

	// Function re-renders whole component with current data from localstorage
	const updateLocalState = () => {
		let appState = JSON.parse(localStorage.getItem('appState'));
		setState(appState);
	}

	// Function returns localstorage object which references current app state
	const getGlobalState = () => {
		return JSON.parse(localStorage.getItem('appState'));
	}

	// Function Updates localstorage object which references current app state
	const setGlobalState = newState => {
		localStorage.setItem('appState', newState);
	}

	// Function adds new todo object and updates app state
	const addTodo = todo => {
		let appState = getGlobalState();
		let newState = JSON.stringify({
			todos: todo.concat(appState.todos),
			count: appState.count + 1,
			activeCount: appState.activeCount + 1
		});
		// Save globally
		setGlobalState(newState);
		updateLocalState();
	}

	// Function handles add todo event
	const handleAddTodo = () => {
		if (todoInput.current.value === '') {
			// If no content just focus input
			todoInput.current.focus();
		} else {
			// Unique identifier generating logic
			let id;
			if (state.todos.length === 0) {
				// Default minimum value for identifier (start point)
				id = 13;
			} else {
				// First item's property (id) value + 1
				id = state.todos[0].id + 1;
			}
			// Add as new Array to concatinate with old one
			addTodo([{
				id: id,
				content: todoInput.current.value,
				isCompleted: false,
			}]);
			// Clear
			todoInput.current.value = '';
		}
	}

	// Function handles remove todo event
	const handleRemoveTodo = id => {
		let appState = getGlobalState();
		// Item which will be removed
		let targetItem = state.todos.find(function(todo) {
			return todo.id === id;
		});
		// New state without target item
		let newArray = state.todos.filter(function(todo) {
			return todo.id !== id;
		});
		let newState = JSON.stringify({
			count: appState.count - 1,
			todos: newArray,
			activeCount: targetItem.isCompleted ? appState.activeCount : appState.activeCount === 0 ? 0 : appState.activeCount - 1
		});
		// Save globally
		setGlobalState(newState);
		updateLocalState();
	}

	// Function handles complete todo event
	const handleTodoComplete = id => {
		let appState = getGlobalState();
		// Item which will be completed
		let targetItem = appState.todos.find(function(todo) {
			return todo.id === id;
		});
		// Set item as completed
		targetItem.isCompleted = !targetItem.isCompleted;
		let newState = JSON.stringify({
			count: appState.count,
			todos: appState.todos,
			activeCount: targetItem.isCompleted ? appState.activeCount - 1 : appState.activeCount + 1
		});
		// Save globally
		setGlobalState(newState);
		updateLocalState();
	}

	// Function handles update todo event
	const handleUpdateTodo = id => {
		let appState = getGlobalState();
		// Item which will be updated
		let targetItem = appState.todos.find(function(todo) {
			return todo.id === id;
		});
		// use builtin prompt as modal (sorry:))
		let newContent = window.prompt('Update todo:', targetItem.content ? targetItem.content : '');
		targetItem.content = newContent;
		// Save globally
		setGlobalState(JSON.stringify(appState));
		updateLocalState();
	}

	// Function clears completed
	const handleClearCompleted = () => {
		let appState = getGlobalState();
		// Get all items, that are not completed
		let newArray = appState.todos.filter(function(todo) {
			return todo.isCompleted !== true;
		});
		let newState = JSON.stringify({
			count: newArray.length,
			todos: newArray,
			activeCount: newArray.length
		});
		// Save globally
		setGlobalState(newState);
		updateLocalState();
	}

	// ENTER key logic
	const handleKeyDown = event => {
		if(event.keyCode === 13){
			handleAddTodo();
		}
	}

	// Lifecycle
	useEffect(() => {
		// Default app state reference
		let defaultAppState = JSON.stringify({
			todos: [],
			count: 0,
			activeCount: 0
		});
		// Get global app state from localstorage
		let appState = JSON.parse(localStorage.getItem('appState'));
		if (appState) {
			if (!appState.todos || !appState.count || !appState.activeCount) {
				// Store default state in localStorage
				localStorage.setItem('appState', defaultAppState);
				appState = JSON.parse(localStorage.getItem('appState'));
				setState(appState);
			}
		} else {
			// Store default state in localStorage
			localStorage.setItem('appState', defaultAppState);
			appState = JSON.parse(localStorage.getItem('appState'));
			setState(appState);
		}
	}, []);

	return (
		<main className={`q-w-all q-d-f ${styles.container}`}>
			<div className={`q-w-all q-d-f--cc ${styles.form}`}>
				<input
					className='q-bc-primary q-bg-light q-c-dark'
					ref={todoInput}
					type='text'
					onKeyDown={handleKeyDown}
					placeholder='What needs to be done?'
				/>
				<button
					className='q-t q-h-bg-primary q-h-c-light q-c-primary q-bg-dark q-bc-primary'
					onClick={handleAddTodo}
				>
					Add
				</button>
			</div>
			{state &&
				<Fragment>
					<ul className={`q-list q-d-f ${styles.list}`}>
						{state.todos.map(todo => 
							<TodoItem
								key={todo.id}
								id={todo.id}
								content={todo.content}
								isCompleted={todo.isCompleted}
								remove={handleRemoveTodo}
								success={handleTodoComplete}
								update={handleUpdateTodo}
							/>
						)}
					</ul>
					{state.count > 0 &&
						<div className={`q-w-all q-d-f ${styles.options}`}>
							<span className='q-c-light'>
								{state.activeCount} {state.activeCount === 1 ? 'item' : 'items'} left
							</span>
							{state.count - state.activeCount > 0 &&
								<button
									className='q-t q-c-light q-bg-secondary'
									onClick={handleClearCompleted}
								>
									Clear completed ({state.count - state.activeCount}) 
								</button>
							}
						</div>
					}
				</Fragment>
			}
		</main>
	);
}

export default Main;