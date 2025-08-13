import { UIDomController } from '../base/UIDomController';
import { getElement } from '../../utils/domHelpers';
import { appConfig } from '../../utils/config';

interface IOrderConfirmation {
	total: number;
}

interface IConfirmationActions {
	handleClose: () => void;
}

export class OrderConfirmation extends UIDomController<IOrderConfirmation> {
	private closeButton: HTMLButtonElement;
	private amountDisplay: HTMLElement;

	constructor(container: HTMLElement, protected actions: IConfirmationActions) {
		super(container);

		this.closeButton = getElement<HTMLButtonElement>(
			appConfig.ui.orderConfirmation.closeButtonClass,
			container
		);
		this.amountDisplay = getElement<HTMLElement>(
			appConfig.ui.orderConfirmation.totalAmountClass,
			container
		);

		this.closeButton.addEventListener('click', () => {
			this.actions.handleClose();
		});
	}

	set orderTotal(amount: number) {
		this.updateElementText(this.amountDisplay, `Списано ${amount} синапсов`);
	}

	render(data: Partial<IOrderConfirmation>): HTMLElement {
		if (data.total !== undefined) {
			this.orderTotal = data.total;
		}
		return this.rootElement;
	}
}
