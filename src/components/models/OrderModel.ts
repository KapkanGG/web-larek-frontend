import { Model } from '../base/Model';
import {
	FormErrors,
	IContactsForm,
	IOrder,
	IOrderForm,
	IOrderModel,
	PaymentMethod,
	IBasketModel,
} from '../../types';
import { IEvents } from '../base/events';

export class OrderModel extends Model<IOrderModel> implements IOrderModel {
	private _orderForm: IOrderForm & IContactsForm = {
		payment: null,
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {};

	constructor(
		data: Partial<IOrderModel>,
		events: IEvents,
		private basketModel: IBasketModel
	) {
		super(data, events);
	}

	get order(): IOrder {
		return {
			...this._orderForm,
			total: this.basketModel.getTotal(),
			items: this.basketModel.getItems().map((i) => i.id),
		};
	}

	setField(
		field: keyof (IOrderForm & IContactsForm),
		value: string | PaymentMethod
	): void {
		if (field === 'payment') {
			this._orderForm[field] = value as PaymentMethod;
		} else {
			this._orderForm[field] = value as string;
		}

		const errors: typeof this.formErrors = {};

		if (!this._orderForm.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		if (!this._orderForm.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this._orderForm.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this._orderForm.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		const orderValid = !errors.payment && !errors.address;
		const contactsValid = !errors.email && !errors.phone;

		if (orderValid) {
			this.events.emit('order:ready', this.order);
		}
		if (contactsValid) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	clearOrder(): void {
		this._orderForm = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
		this.formErrors = {};
		this.events.emit('order:clear', this.order);
	}

	getOrderData(): IOrder {
		return this.order;
	}
}
