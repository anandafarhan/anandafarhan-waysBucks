import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { loginUser } from '../../config/server';
import { AppContext } from '../../context/AppContext';

function LoginModal(props) {
	const route = useHistory();
	const [state, dispatch] = useContext(AppContext);
	const [failed, setFailed] = useState({
		status: false,
		message: '',
		errors: '',
	});
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	function handleChange(e) {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const response = await loginUser(formData);
		if (response.status === 200) {
			setFailed({ status: false, message: '', errors: '' });
			dispatch({
				type: 'LOGIN',
				payload: response.data.data,
			});
			props.handleClose();
			setFormData({
				email: '',
				password: '',
			});
			route.push('/');
		} else {
			setFailed({
				status: true,
				message: response.data.message,
				errors: response.data.errors,
			});
			setFormData({
				...formData,
				password: '',
			});
		}
	}

	return state.isLogin ? (
		''
	) : (
		<Modal show={props.show} onHide={props.handleClose} dialogClassName='modal-overide' centered>
			<Modal.Body>
				<Modal.Title className='text-overide'>
					<strong>Login</strong>
				</Modal.Title>
				<br />
				<Alert
					variant='danger'
					style={failed.status ? { display: 'block', fontSize: '15px' } : { display: 'none' }}
				>
					{failed.message}
					<br />
					{failed.errors}
				</Alert>
				<Form onSubmit={(e) => handleSubmit(e)}>
					<Form.Group className='mb-3' controlId='Email'>
						<Form.Control
							type='email'
							name='email'
							placeholder='Email'
							value={formData.email}
							onChange={(e) => handleChange(e)}
							className='input-overide'
						/>
					</Form.Group>

					<Form.Group className='mb-3' controlId='Password'>
						<Form.Control
							type='password'
							name='password'
							placeholder='Password'
							value={formData.password}
							onChange={(e) => handleChange(e)}
							className='input-overide'
						/>
					</Form.Group>

					<div className='d-grid gap-2 my-3'>
						<Button variant='danger' className='bg-overide' type='submit'>
							Login
						</Button>
					</div>
					<p className='text-center'>
						Don't have an account ? Click{' '}
						<span onClick={props.switchModal}>
							<strong>Here</strong>
						</span>
					</p>
				</Form>
			</Modal.Body>
		</Modal>
	);
}

export default LoginModal;
