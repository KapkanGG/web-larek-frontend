import { UIDomController } from '../base/UIDomController';
import { getElement } from '../../utils/domHelpers';
import { appConfig } from '../../utils/config';
import { IEventSystem } from '../base/EventSystem';

interface IDialogContent {
	content: HTMLElement;
}

interface IDialog {
	show(): void;
	hide(): void;
	set content(element: HTMLElement);
}

export class DialogWindow
	extends UIDomController<IDialogContent>
	implements IDialog
{
	private closeButton: HTMLButtonElement;
	private contentArea: HTMLElement;

	constructor(container: HTMLElement, protected eventSystem: IEventSystem) {
		super(container);

		this.closeButton = getElement<HTMLButtonElement>(
			appConfig.ui.dialog.closeButtonClass,
			container
		);
		this.contentArea = getElement<HTMLElement>(
			appConfig.ui.dialog.contentClass,
			container
		);

		this.closeButton.addEventListener('click', this.hide.bind(this));
		this.rootElement.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.rootElement) {
				this.hide();
			}
		});
		this.contentArea.addEventListener('click', (event) =>
			event.stopPropagation()
		);
	}

	set content(content: HTMLElement) {
		this.contentArea.replaceChildren(content);
	}

	show(): void {
		this.rootElement.classList.add('dialog--active');
		this.eventSystem.dispatch('dialog:show');
	}

	hide(): void {
		this.rootElement.classList.remove('dialog--active');
		this.content = document.createElement('div');
		this.eventSystem.dispatch('dialog:hide');
	}

	updateContent(data: IDialogContent): HTMLElement {
		this.content = data.content;
		return this.rootElement;
	}
}
