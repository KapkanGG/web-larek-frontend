import { UIDomController } from '../base/UIDomController';
import { getElement } from '../../utils/domHelpers';
import { IEventSystem } from '../base/EventSystem';
import { IBasketView } from '../../types/ShoppingCartTypes';

export class ShoppingCartView extends UIDomController<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected eventSystem: IEventSystem) {
		super(container);

		this._list = getElement<HTMLElement>('.basket__list', container);
		this._total = getElement<HTMLElement>('.basket__price', container);
		this._button = getElement<HTMLButtonElement>('.basket__button', container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				eventSystem.dispatch('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			const emptyMessage = document.createElement('p');
			emptyMessage.textContent = 'Корзина пуста';
			this._list.replaceChildren(emptyMessage);
		}
	}

	set total(total: number) {
		this.updateElementText(this._total, `${total} синапсов`);
	}

	set buttonDisabled(state: boolean) {
		this.changeElementDisabledState(this._button, state);
	}

	render(state: Partial<IBasketView>): HTMLElement {
		if (state.items !== undefined) this.items = state.items;
		if (state.total !== undefined) this.total = state.total;
		if (state.buttonDisabled !== undefined)
			this.buttonDisabled = state.buttonDisabled;
		return this.rootElement;
	}
}
