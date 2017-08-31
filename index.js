class Form {
	constructor() {
		this.validate = this.validate.bind(this);
		this.getData = this.getData.bind(this);
		this.setData = this.setData.bind(this);
		this.submit = this.submit.bind(this);
		document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
	}

	submit(event) {
		for (let element of document.getElementsByTagName('input')) {
			element.classList.remove('error');
		}
		
		if (event) {
			event.preventDefault();
		}
		let resultOfValidation = this.validate();
		const resultContainer = document.getElementById('resultContainer');

		if (resultOfValidation.isValid) {
			document.getElementById('submitButton').disabled = true;

			let setAjax = () => {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', document.getElementById('myForm').action, false);
				xhr.send();
				if (xhr.status === 200) {
					let data = JSON.parse(xhr.responseText);
					switch (data.status) {
						case 'success':
							resultContainer.className = 'success';
							resultContainer.innerHTML = 'Success';
						break;
						case 'error':
							resultContainer.className = 'error';
							resultContainer.innerHTML = data.reason;
						break;
						case 'progress':
							resultContainer.className = 'progress';
							setTimeout(setAjax, data.timeout);
						break;
					}
				}
			};
			setAjax();
		} else {
			resultOfValidation.errorFields.forEach(item => (document.getElementById(item).className = 'error'));
		}
	}

	validate() {
		let isValid = true;
		let errorFields = [];
		const domains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
		const splitedEmail = document.getElementById('email').value.split('@');
		const domain = splitedEmail[1];
		if (splitedEmail.length === 2 && !domains.includes(domain)) {
			errorFields.push('email');
		}
		
		const fio = document.getElementById('fio').value;
		if (document.getElementById('fio').value.trim().split(/\s+/).length !== 3) {
			errorFields.push('fio');
		}

		const phone = document.getElementById('phone').value;
		const phoneReg = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
		let sumOfPhoneNumber = (number) => (number.match(/\d/g).reduce((a, b) => Number(a) + Number(b)))
		if (!phoneReg.test(phone) || sumOfPhoneNumber(phone) >= 30) {
			errorFields.push('phone');
		}

		isValid = errorFields.length === 0;
		
		return {
			isValid,
			errorFields
		};

	}

	getData() {
		let data = {};
		const elements = document.getElementById('myForm').elements;
		for (let i in elements) {
			if (elements.hasOwnProperty(i)) {
				const element = elements[i];
				console.log(element.name)
				console.log(element.type)
				let validationElement = (element) => (element.name === element.type)
				if (validationElement(element)) {
					data[element.name] = element.value;
				}
			}
		}
		return data;
	}

	setData(data) {
		const myForm = document.getElementById('myForm');
		const allowableIindices = new Set(['phone' , 'email', 'fio']);
		for (let i in data) {
			if (data.hasOwnProperty(i)){
				const value = data[i];
				if (allowableIindices.has(i)) {
					if (myForm.elements[i]) {
						myForm.elements[i].value = value;
					}
				}
			}
		}
	}
}

const MyForm = new Form();
