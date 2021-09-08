import { createContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
	isLoading: true,
	isLogin: false,
	modalLogin: false,
	modalRegister: false,
	carts: [],
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_CART':
			const addedCarts = [...state.carts];
			addedCarts.push(action.payload);
			return {
				...state,
				carts: [...addedCarts],
			};

		case 'REMOVE_CART':
			const newCarts = [...state.carts];
			newCarts.splice(action.payload, 1);
			return {
				...state,
				carts: [...newCarts],
			};

		case 'CLEAR_CART':
			return {
				...state,
				carts: [],
			};

		case 'REGISTER':
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				isLogin: true,
				isLoading: false,
				user: {
					id: action.payload.id,
					name: action.payload.fullName,
					email: action.payload.email,
					role: action.payload.role,
					avatar: null,
				},
			};

		case 'LOGIN':
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				isLogin: true,
				isLoading: false,
				user: {
					id: action.payload.id,
					name: action.payload.fullName,
					email: action.payload.email,
					role: action.payload.role,
					avatar:
						action.payload.avatar === 'false' ? null : action.payload.avatar,
				},
			};

		case 'LOAD_USER':
			return {
				...state,
				isLogin: true,
				isLoading: false,
				user: {
					id: action.payload.id,
					name: action.payload.fullName,
					email: action.payload.email,
					role: action.payload.role,
					avatar:
						action.payload.avatar === 'false' ? null : action.payload.avatar,
				},
			};

		case 'AUTH_ERROR':
			localStorage.removeItem('token');
			return {
				...state,
				isLogin: false,
				isLoading: false,
				user: null,
			};

		case 'LOGOUT':
			localStorage.removeItem('token');

			return {
				...state,
				isLogin: false,
				isLoading: false,
				user: null,
				carts: [],
			};

		case 'MODAL_LOGIN':
			return {
				...state,
				modalLogin: !state.modalLogin,
			};
		case 'MODAL_REGISTER':
			return {
				...state,
				modalRegister: !state.modalRegister,
			};
		case 'SWITCH_MODAL':
			return {
				...state,
				modalRegister: !state.modalRegister,
				modalLogin: !state.modalLogin,
			};

		case 'IS_LOADING_TRUE':
			return {
				...state,
				isLoading: true,
			};
		case 'IS_LOADING_FALSE':
			return {
				...state,
				isLoading: false,
			};

		default:
			throw new Error();
	}
};

export const AppContextProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AppContext.Provider value={[state, dispatch]}>
			{props.children}
		</AppContext.Provider>
	);
};