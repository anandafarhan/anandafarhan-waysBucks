import React, { useEffect, useState } from 'react';
import { Button, Col, Image, Row, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Loading from '../../components/Loading';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import { deleteTopping, getToppings, updateTopping } from '../../config/server';

function Toppings() {
	const title = 'List of Toppings';
	document.title = `Waysbucks | ${title}`;
	const route = useHistory();
	const [wait, setWait] = useState(false);
	const [loading, setLoading] = useState(true);
	const [toppings, setToppings] = useState(null);
	function formatPrice(price) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
		}).format(price);
	}

	async function getAllToppings() {
		const response = await getToppings();
		setToppings(response);
		setLoading(false);
	}

	const initialModal = { show: false, id: '', name: '' };
	const [modalConfirm, setModalConfirm] = useState(initialModal);
	const [modalStatus, setModalStatus] = useState(initialModal);
	function handleConfirmModal(id, name) {
		setModalConfirm({ show: true, id, name });
	}

	async function handleDelete(id) {
		setWait(true);
		await deleteTopping(id);
		setModalConfirm(initialModal);
		setWait(false);
	}

	async function handleChangeStatus(action, id) {
		setWait(true);
		switch (action) {
			case 'setAvailable':
				await updateTopping({ status: 1 }, id);
				setModalStatus(initialModal);
				return setWait(false);

			case 'setNotAvailable':
				await updateTopping({ status: 0 }, id);
				setModalStatus(initialModal);
				return setWait(false);

			default:
				return new Error();
		}
	}

	useEffect(() => {
		getAllToppings();
	}, [wait]);

	let n = 0;

	return loading ? (
		<Loading />
	) : (
		<div className='d-block mx-auto' style={{ width: '70%' }}>
			<Row>
				<Col md={6}>
					<h2 className='text-overide'>{title}</h2>
				</Col>
				<Col md={6} className='d-flex justify-content-end'>
					<Link to='/addTopping'>
						<Button variant='outline-danger'>Add Topping</Button>
					</Link>
				</Col>
			</Row>
			{!toppings ? (
				''
			) : (
				<Table className='mt-4 align-middle' bordered hover>
					<thead>
						<tr>
							<th className='text-center'>No</th>
							<th width='100px'>Image</th>
							<th>Topping Name</th>
							<th>Price</th>
							<th>Sold</th>
							<th width='150px'>Status</th>
							<th width='200px'>Action</th>
						</tr>
					</thead>
					<tbody className='align-items-center'>
						{toppings.map((topping) => (
							<tr key={topping.id}>
								<td className='text-center'>{(n += 1)}</td>
								<td>
									<Image
										src={
											topping.image
												? topping.image
												: `${process.env.PUBLIC_URL}/assets/img/icons/topping.svg`
										}
										alt={topping.name}
										width='100%'
									/>
								</td>
								<td>{topping.name}</td>
								<td>{formatPrice(topping.price)}</td>
								<td>{topping.TransactionToppings.length}</td>
								<td className={topping.status ? 'text-scs' : 'text-cancel'}>
									{topping.status ? 'Available' : 'Not Available'}
								</td>
								<td>
									<div className='d-flex justify-content-evenly flex-column'>
										<Button
											variant='outline-danger'
											size='sm'
											className='mb-1'
											onClick={() => route.push(`/editTopping/${topping.id}`)}
										>
											Edit
										</Button>
										{topping.status ? (
											<Button
												variant='danger'
												size='sm'
												className='mb-1'
												onClick={() =>
													setModalStatus({
														show: true,
														id: topping.id,
														name: topping.name,
														action: 'setNotAvailable',
													})
												}
											>
												Set as Not Available
											</Button>
										) : (
											<Button
												variant='success'
												size='sm'
												className='mb-1'
												onClick={() =>
													setModalStatus({
														show: true,
														id: topping.id,
														name: topping.name,
														action: 'setAvailable',
													})
												}
											>
												Set as Available
											</Button>
										)}
										<Button
											variant='danger'
											size='sm'
											className='mb-1'
											onClick={() => handleConfirmModal(topping.id, topping.name)}
										>
											Delete
										</Button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<ConfirmModal
				show={modalConfirm.show}
				name={modalConfirm.name}
				body="Warning, this action can't be undone!"
				variant='danger'
				actionName='Delete!'
				action={() => handleDelete(modalConfirm.id)}
				handleClose={() => setModalConfirm(initialModal)}
			/>

			<ConfirmModal
				show={modalStatus.show}
				name={modalStatus.name}
				body={`You're about to change product ${modalStatus.name} status!`}
				variant='danger'
				actionName='Change Status'
				action={() => handleChangeStatus(modalStatus.action, modalStatus.id)}
				handleClose={() => setModalStatus(initialModal)}
			/>
		</div>
	);
}

export default Toppings;
