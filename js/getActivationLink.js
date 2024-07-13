function onAccessPay() {
	console.log('access')
	const invId = localStorage.getItem('invId');
	console.log('invId accessPay : ' + invId);

	// if (!invId) {
	// 	let receiptCard = document.querySelector('.receipt_card');
	// 	let link = document.createElement('span');
	// 	link.textContent = 'An error has occurred. contact technical support';
	// 	receiptCard.appendChild(link);
	// 	throw new Error('no invId');
	// }

	const fetchData = fetch("http://188.120.244.111:3001/paymentsite/getlink", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			"invId": invId.toString()
		})
	})

	console.log('fetchData:');
	console.log(fetchData)

	fetchData
	.then(response => response.json())
	.then(data => {
		if (!data.activationLink) {
			console.log('error:');
			console.log(data);

			let receiptCard = document.querySelector('.receipt_card');
			let link = document.createElement('span');

			link.textContent = 'An error has occurred. contact technical support';
			receiptCard.appendChild(link);

			throw new Error('some error');
		} else {
			console.log(data);
			let receiptCard = document.querySelector('.receipt_card');
			let link = document.createElement('a');

			link.setAttribute('href', data.activationLink);
			link.textContent = data.activationLink;

			receiptCard.appendChild(link);
		}
	})
}
