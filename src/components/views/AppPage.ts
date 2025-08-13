import { UIDomController } from '../base/UIDomController';
import { IEventSystem } from '../base/EventSystem';
import { getElement } from '../../utils/domHelpers';
import { appConfig } from '../../utils/config';

interface IAppPageData {
	itemCount: number;
	productItems: HTMLElement[];
	isScrollLocked: boolean;
}

export class AppPage extends UIDomController<IAppPageData> {
	private itemsCounter: HTMLElement;
	private productsGrid: HTMLElement;
	private pageWrapper: HTMLElement;
	private cartButton: HTMLElement;
	private scrollPosition = 0;
	private isPageLocked = false;

	constructor(container: HTMLElement, protected eventSystem: IEventSystem) {
		super(container);

		this.itemsCounter = getElement(
			appConfig.ui.page.cartCounterClass,
			container
		);
		this.productsGrid = getElement(
			appConfig.ui.page.productGridClass,
			container
		);
		this.pageWrapper = getElement(appConfig.ui.page.layoutClass, container);
		this.cartButton = getElement(appConfig.ui.page.cartButtonClass, container);

		this.cartButton.addEventListener('click', () => {
			this.eventSystem.dispatch('cart:show');
		});
	}

	set itemsCount(count: number) {
		this.updateElementText(this.itemsCounter, String(count));
	}

	set productItems(items: HTMLElement[]) {
		this.productsGrid.replaceChildren(...items);
	}

	set isScrollLocked(lock: boolean) {
		if (lock && !this.isPageLocked) {
			this.scrollPosition = window.scrollY;
			this.pageWrapper.style.top = `-${this.scrollPosition}px`;
			this.modifyClassState(this.pageWrapper, 'page-wrapper--locked', true);
			this.isPageLocked = true;
		} else if (!lock && this.isPageLocked) {
			const storedOffset = parseInt(this.pageWrapper.style.top || '0', 10);
			this.pageWrapper.style.removeProperty('top');
			this.modifyClassState(this.pageWrapper, 'page-wrapper--locked', false);
			window.scrollTo(0, -storedOffset || this.scrollPosition);
			this.isPageLocked = false;
		}
	}

	set locked(state: boolean) {
		this.isScrollLocked = state;
	}
}
