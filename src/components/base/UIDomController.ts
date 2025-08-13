export interface IDomComponent<T> {
	updateContent(data?: T): HTMLElement;
}

export abstract class UIDomController<DataType>
	implements IDomComponent<DataType>
{
	constructor(protected readonly rootElement: HTMLElement) {}

	modifyClassState(
		targetElement: HTMLElement,
		cssClass: string,
		shouldApply?: boolean
	): void {
		targetElement.classList.toggle(cssClass, shouldApply);
	}

	protected updateElementText(
		targetElement: HTMLElement,
		content: string
	): void {
		if (targetElement) {
			targetElement.textContent = content;
		}
	}

	protected changeElementDisabledState(
		element: HTMLElement,
		isDisabled: boolean
	): void {
		if (isDisabled) {
			element.setAttribute('disabled', '');
		} else {
			element.removeAttribute('disabled');
		}
	}

	updateContent(data?: DataType): HTMLElement {
		if (data) {
			Object.assign(this, data);
		}
		return this.rootElement;
	}
}
