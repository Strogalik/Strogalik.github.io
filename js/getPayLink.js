function fetchInvId() {
	return fetch("http://188.120.244.111:3001/paymentsite/invId", {
			method: 'GET',
			credentials: 'include'
	}).then(response => {
			if (response.status !== 200) {
					throw new Error('Failed to fetch invId');
			}
			return response.json();
	});
}

function createPaymentUrl(email, invId) {
	return fetch("http://188.120.244.111:3001/paymentsite/create", {
			method: "POST",
			headers: {
					'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, invId }),
			credentials: 'include'
	}).then(response => {
			if (response.status !== 201) {
					throw new Error('Failed to create payment URL');
			}
			return response.json();
	});
}

function onSendEmail(event) {
	event.preventDefault();

	const emailInput = document.getElementById('emailInput');
	const email = emailInput.value;
	console.log("email: " + email);

	fetchInvId()
			.then((r) => {
				console.log(r)
				localStorage.setItem('invId', r.invId)
				createPaymentUrl(email, r.invId)
					.then(paymentData => {
						console.log(paymentData);
						window.open(paymentData.link, '_blank');
					})
					.catch(error => {
						console.log(error);
					});
			})
}

function onSendEmailFooter(event) {
	event.preventDefault();

	const emailInputFooter = document.getElementById('emailInputFooter');
	const email = emailInputFooter.value;
	console.log("email: " + email);

	fetchInvId()
			.then((r) => {
				console.log(r)
				localStorage.setItem('invId', r.invId)
				createPaymentUrl(email, r.invId)
					.then(paymentData => {
						console.log(paymentData);
						window.open(paymentData.link, '_blank');
					})
					.catch(error => {
						console.log(error);
					});
			})
}