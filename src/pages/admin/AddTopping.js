import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/Loading';
import FormProduct from '../../components/Product/FormProduct';
import { addTopping } from '../../config/server';
import { AppContext } from '../../context/AppContext';

function AddTopping() {
	document.title = `Waysbucks | Add Topping`;
	const [state, dispatch] = useContext(AppContext);

	const route = useHistory();
	async function handleSubmit(e, formData) {
		e.preventDefault();
		dispatch({ type: 'IS_LOADING_TRUE' });

		const form = new FormData();

		form.set('name', formData.name);
		form.set('price', formData.price);
		form.set('image', formData.image[0], formData.image[0].name);

		await addTopping(form);

		route.push('/toppings');
		dispatch({ type: 'IS_LOADING_FALSE' });
	}
	return state.isLoading ? (
		<Loading />
	) : (
		<div>
			<FormProduct prefix='Add' suffix='Topping' handleSubmit={handleSubmit} />
		</div>
	);
}

export default AddTopping;
