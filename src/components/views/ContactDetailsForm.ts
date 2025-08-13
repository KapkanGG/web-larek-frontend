import { FormController } from './FormController';
import { IEventSystem } from '../base/EventSystem';

interface IContactDetails {
	email: string;
	phone: string;
}

export class ContactDetailsForm extends FormController<IContactDetails> {
	private emailField: HTMLInputElement;
	private phoneField: HTMLInputElement;

	constructor(formElement: HTMLFormElement, eventSystem: IEventSystem) {
		super(formElement, eventSystem);

		this.emailField = this.getInputElement('email');
		this.phoneField = this.getInputElement('phone');
	}

	set userEmail(value: string) {
		this.emailField.value = value;
		this.handleFieldInput('email', value);
	}

	set userPhone(value: string) {
		this.phoneField.value = value;
		this.handleFieldInput('phone', value);
	}

	private getInputElement(name: string): HTMLInputElement {
		const element = this.formElement.elements.namedItem(name);
		if (!element) {
			throw new Error(`Input element with name "${name}" not found`);
		}
		return element as HTMLInputElement;
	}
}
