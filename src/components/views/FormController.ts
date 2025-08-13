import { UIDomController } from '../base/UIDomController';
import { IEventSystem } from '../base/EventSystem';
import { getElement } from '../../utils/domHelpers';
import { appConfig } from '../../utils/config';

export interface IFormState<T> {
	valid?: boolean;
	errors?: string[];
	inputs?: Partial<T>;
}

export class FormController<T> extends UIDomController<IFormState<T>> {
	protected submitButton: HTMLButtonElement;
	protected errorDisplay: HTMLElement;

	constructor(
		protected formElement: HTMLFormElement,
		protected eventDispatcher: IEventSystem
	) {
		super(formElement);

		this.submitButton = getElement<HTMLButtonElement>(
			appConfig.ui.forms.submitButton,
			formElement
		);
		this.errorDisplay = getElement<HTMLElement>(
			appConfig.ui.forms.errorContainerClass,
			formElement
		);

		formElement.addEventListener('input', (event: Event) => {
			const inputElement = event.target as HTMLInputElement;
			const fieldName = inputElement.name as keyof T;
			const inputValue = inputElement.value;
			this.handleFieldInput(fieldName, inputValue);
		});

		formElement.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.eventDispatcher.dispatch(`form:${formElement.name}:submit`);
		});
	}

	protected handleFieldInput(field: keyof T, value: string) {
		this.eventDispatcher.dispatch(
			`form:${this.formElement.name}.${String(field)}:update`,
			{ field, value }
		);
	}

	set isValid(valid: boolean) {
		this.changeElementDisabledState(this.submitButton, !valid);
	}

	set validationMessages(messages: string[]) {
		this.updateElementText(this.errorDisplay, messages.join('; '));
	}

	public updateContent(state: Partial<T> & IFormState<T>): HTMLElement {
		if (state.valid !== undefined) {
			this.isValid = state.valid;
		}
		if (state.errors !== undefined) {
			this.validationMessages = state.errors;
		}
		return this.formElement;
	}

	public changeElementDisabledState(
		element: HTMLElement,
		isDisabled: boolean
	): void {
		if (isDisabled) {
			element.setAttribute('disabled', '');
		} else {
			element.removeAttribute('disabled');
		}
	}

	public updateElementText(element: HTMLElement, content: string): void {
		if (element) {
			element.textContent = content;
		}
	}
}
