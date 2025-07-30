import { Component } from '../base/Component';
import { IModal, IModalData } from '../../types';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { settings } from '../../utils/constants';

export class Modal extends Component<IModalData> implements IModal {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			settings.modal.close,
			container
		);
		this._content = ensureElement<HTMLElement>(
			settings.modal.content,
			container
		);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', (event: MouseEvent) => {
			if (event.target === this.container) {
				this.close();
			}
		});
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = document.createElement('div');
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
