import { FormController } from './FormController';
import { IEventSystem } from '../base/EventSystem';
import { queryElements } from '../../utils/domHelpers';

type PaymentType = 'cash' | 'card';

interface ICheckoutForm {
	payment: PaymentType | null;
	address: string;
}

interface IFormState {
	valid: boolean;
	errorMessages: string[];
}

export class CheckoutForm extends FormController<ICheckoutForm> {
	private paymentOptions: HTMLButtonElement[];
	private addressField: HTMLInputElement;

	constructor(formElement: HTMLFormElement, eventSystem: IEventSystem) {
		super(formElement, eventSystem);

		this.paymentOptions = queryElements<HTMLButtonElement>(
			'.payment-option',
			formElement
		);
		this.addressField = formElement.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this.paymentOptions.forEach((option) => {
			option.addEventListener('click', () => {
				this.handleFieldInput('payment', option.name as PaymentType);
			});
		});

		this.addressField.addEventListener('input', () => {
			this.handleFieldInput('address', this.addressField.value);
		});
	}

	private highlightSelectedPayment(method: PaymentType | null) {
		this.paymentOptions.forEach((option) => {
			this.modifyClassState(
				option,
				'payment-option--active',
				option.name === method
			);
		});
	}

	set deliveryAddress(address: string) {
		this.addressField.value = address;
		this.handleFieldInput('address', address);
	}

	updateContent(state: Partial<ICheckoutForm> & IFormState): HTMLElement {
		if (state.payment !== undefined) {
			this.highlightSelectedPayment(state.payment);
		}
		if (state.address !== undefined) {
			this.deliveryAddress = state.address;
		}
		if (state.valid !== undefined) {
			this.isValid = state.valid;
		}
		if (state.errorMessages !== undefined) {
			this.validationMessages = state.errorMessages;
		}
		return this.formElement;
	}
}
