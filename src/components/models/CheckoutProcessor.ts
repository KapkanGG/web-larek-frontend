import { DataEntity } from '../base/DataEntity';
import { IEventSystem } from '../base/EventSystem';

type PaymentType = 'cash' | 'card';

interface ICartItem {
	id: string;
	title: string;
	price: number;
}

interface ICheckoutForm {
	payment: PaymentType | null;
	address: string;
}

interface IContactDetails {
	email: string;
	phone: string;
}

interface IOrder {
	payment: PaymentType | null;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[];
}

interface ICheckoutProcessorState {
	checkoutData: ICheckoutForm & IContactDetails;
	validationErrors: ValidationErrors;
}

type ValidationErrors = Partial<
	Record<keyof (ICheckoutForm & IContactDetails), string>
>;

export class CheckoutProcessor extends DataEntity<ICheckoutProcessorState> {
	private checkoutData: ICheckoutForm & IContactDetails = {
		payment: null,
		address: '',
		email: '',
		phone: '',
	};

	validationErrors: ValidationErrors = {};

	constructor(
		protected eventDispatcher: IEventSystem,
		private cartManager: {
			calculateTotal(): number;
			getCartContents(): ICartItem[];
		}
	) {
		super(
			{
				checkoutData: {
					payment: null,
					address: '',
					email: '',
					phone: '',
				},
				validationErrors: {},
			},
			eventDispatcher
		);
	}

	get purchaseDetails(): IOrder {
		return {
			...this.checkoutData,
			total: this.cartManager.calculateTotal(),
			items: this.cartManager
				.getCartContents()
				.map((item: ICartItem) => item.id),
		};
	}

	updateFormField(
		field: keyof (ICheckoutForm & IContactDetails),
		value: string | PaymentType
	): void {
		if (field === 'payment') {
			this.checkoutData[field] = value as PaymentType;
		} else {
			this.checkoutData[field] = value as string;
		}

		this.validateFormFields();
		this.eventDispatcher.dispatch('validation:update', this.validationErrors);

		const isCheckoutValid =
			!this.validationErrors.payment && !this.validationErrors.address;
		const isContactValid =
			!this.validationErrors.email && !this.validationErrors.phone;

		if (isCheckoutValid) {
			this.eventDispatcher.dispatch('checkout:valid', this.purchaseDetails);
		}
		if (isContactValid) {
			this.eventDispatcher.dispatch('contactInfo:valid', this.purchaseDetails);
		}
	}

	private validateFormFields(): void {
		const errors: ValidationErrors = {};

		if (!this.checkoutData.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this.checkoutData.address) {
			errors.address = 'Введите адрес доставки';
		}
		if (!this.checkoutData.email) {
			errors.email = 'Укажите email';
		}
		if (!this.checkoutData.phone) {
			errors.phone = 'Укажите телефон';
		}

		this.validationErrors = errors;
	}

	resetCheckout(): void {
		this.checkoutData = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
		this.validationErrors = {};
		this.eventDispatcher.dispatch('checkout:reset', this.purchaseDetails);
	}

	getOrderInformation(): IOrder {
		return this.purchaseDetails;
	}
}
