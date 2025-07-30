import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/api/WebLarekAPI';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { OrderModel } from './components/models/OrderModel';
import { Page } from './components/views/Page';
import { Modal } from './components/views/Modal';
import { Card } from './components/views/Card';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct, IContactsForm, IOrderForm } from './types';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.cardCatalog
);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.cardPreview
);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.cardBasket
);
const basketTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.basket
);
const orderTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.order
);
const contactsTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.contacts
);
const successTemplate = ensureElement<HTMLTemplateElement>(
	settings.templates.success
);

const catalogModel = new CatalogModel({}, events);
const basketModel = new BasketModel({}, events);
const orderModel = new OrderModel({}, events, basketModel);

const page = new Page(document.body, events);
const modal = new Modal(
	ensureElement<HTMLElement>(settings.modal.container),
	events
);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

events.on('items:changed', (items: IProduct[]) => {
	page.catalog = items.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => catalogModel.setPreview(item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('preview:changed', (item: IProduct) => {
	const showItem = (item: IProduct) => {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (basketModel.contains(item.id)) {
					basketModel.remove(item.id);
				} else {
					basketModel.add(item);
				}
				catalogModel.setPreview(item);
			},
		});

		modal.render({
			content: card.render({
				id: item.id,
				title: item.title,
				image: item.image,
				price: item.price,
				category: item.category,
				description: item.description,
				button: basketModel.contains(item.id)
					? 'Удалить из корзины'
					: 'В корзину',
			}),
		});
	};

	if (item) {
		showItem(item);
	} else {
		modal.close();
	}
});

events.on('basket:changed', () => {
	page.counter = basketModel.getCount();
	basket.items = basketModel.getItems().map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				basketModel.remove(item.id);

				const currentPreview = catalogModel.getPreview();
				if (currentPreview && currentPreview.id === item.id) {
					const fullProduct = catalogModel.getProduct(item.id);
					if (fullProduct) {
						catalogModel.setPreview(fullProduct);
					}
				}
			},
		});
		const element = card.render({
			id: item.id,
			title: item.title,
			price: item.price,
		});

		const indexElement = element.querySelector(settings.card.index);
		if (indexElement) {
			indexElement.textContent = String(index + 1);
		}

		return element;
	});

	basket.total = basketModel.getTotal();
	basket.buttonDisabled = basketModel.getCount() === 0;
});

events.on('basket:open', () => {
	basket.buttonDisabled = basketModel.getCount() === 0;
	modal.render({
		content: basket.render(),
	});
});

events.on('order:open', () => {
	orderModel.clearOrder();
	modal.render({
		content: orderForm.render({
			payment: null,
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on(
	'formErrors:change',
	(errors: Partial<IOrderForm & IContactsForm>) => {
		const { payment, address, email, phone } = errors;
		orderForm.valid = !payment && !address;
		orderForm.errors = Object.values({ payment, address }).filter(
			(i): i is string => Boolean(i)
		);
		contactsForm.valid = !email && !phone;
		contactsForm.errors = Object.values({ phone, email }).filter(
			(i): i is string => Boolean(i)
		);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		orderModel.setField(data.field, data.value);
		const orderValid =
			!orderModel.formErrors.payment && !orderModel.formErrors.address;
		const orderErrors = Object.values({
			payment: orderModel.formErrors.payment,
			address: orderModel.formErrors.address,
		}).filter((e): e is string => Boolean(e));
		orderForm.render({
			payment: orderModel.order.payment,
			address: orderModel.order.address,
			valid: orderValid,
			errors: orderErrors,
		});
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		orderModel.setField(
			data.field as keyof (IOrderForm & IContactsForm),
			data.value
		);
	}
);

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('contacts:submit', () => {
	api
		.createOrder(orderModel.getOrderData())
		.then((result) => {
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			basketModel.clear();
			orderModel.clearOrder();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then(catalogModel.setItems.bind(catalogModel))
	.catch((err) => {
		console.error(err);
	});
