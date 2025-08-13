import { UIDomController } from '../base/UIDomController';
import { getElement } from '../../utils/domHelpers';
import { appConfig } from '../../utils/config';

type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

interface ICardInteractions {
	onClick: (event: MouseEvent) => void;
}

interface IProductCard {
	id: string;
	title: string;
	imageUrl?: string;
	price: number | null;
	category?: ProductCategory;
	description?: string | string[];
	buttonText?: string;
}

export class ProductCard extends UIDomController<IProductCard> {
	protected cardTitle: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardPrice: HTMLElement;
	protected cardCategory?: HTMLElement;
	protected cardDescription?: HTMLElement;
	protected actionButton?: HTMLButtonElement;
	protected rootElement: HTMLElement;

	constructor(
		container: HTMLElement,
		protected interactions?: ICardInteractions
	) {
		super(container);
		this.rootElement = container;

		this.cardTitle = getElement<HTMLElement>(
			appConfig.ui.productCard.titleClass,
			container
		);
		this.cardImage = container.querySelector<HTMLImageElement>(
			appConfig.ui.productCard.imageClass
		);
		this.cardPrice = getElement<HTMLElement>(
			appConfig.ui.productCard.priceClass,
			container
		);
		this.cardCategory = container.querySelector<HTMLElement>(
			appConfig.ui.productCard.categoryClass
		);
		this.cardDescription = container.querySelector<HTMLElement>(
			appConfig.ui.productCard.descriptionClass
		);
		this.actionButton =
			container.querySelector<HTMLButtonElement>(
				appConfig.ui.productCard.actionButtonClass
			) ||
			container.querySelector<HTMLButtonElement>(
				appConfig.ui.productCard.removeButtonClass
			);

		if (interactions?.onClick) {
			container.addEventListener('click', (event: MouseEvent) => {
				if (this.actionButton) {
					if (
						event.target === this.actionButton ||
						(this.actionButton.contains(event.target as Node) &&
							event.currentTarget !== this.actionButton)
					) {
						interactions.onClick(event);
					}
				} else {
					interactions.onClick(event);
				}
			});
		}
	}

	set id(value: string) {
		this.rootElement.dataset.id = value;
	}

	set title(value: string) {
		this.updateElementText(this.cardTitle, value);
	}

	set imageUrl(value: string) {
		if (!this.cardImage) return;
		const alt = this.cardTitle.textContent || '';
		this.cardImage.src = value;
		this.cardImage.alt = alt;
	}

	set price(value: number | null) {
		this.updateElementText(
			this.cardPrice,
			value ? `${value} синапсов` : 'Бесценно'
		);
		if (this.actionButton && !value) {
			this.actionButton.disabled = true;
		}
	}

	set category(value: ProductCategory) {
		if (!this.cardCategory) return;
		this.updateElementText(this.cardCategory, value);
		this.cardCategory.classList.toggle(
			'card__category_soft',
			value === 'софт-скил'
		);
	}

	set description(value: string | string[]) {
		if (!this.cardDescription) return;

		if (Array.isArray(value)) {
			const nodes = value.map((text) => {
				const node = document.createElement('div');
				node.textContent = text;
				return node;
			});
			this.cardDescription.replaceChildren(...nodes);
		} else {
			this.updateElementText(this.cardDescription, value);
		}
	}

	set buttonText(value: string) {
		if (this.actionButton) {
			this.updateElementText(this.actionButton, value);
		}
	}

	set buttonDisabled(value: boolean) {
		if (this.actionButton) {
			this.actionButton.disabled = value;
		}
	}

	render(data: Partial<IProductCard>): HTMLElement {
		Object.assign(this, data);
		return this.rootElement;
	}

	protected updateElementText(
		element: HTMLElement | null,
		content: unknown
	): void {
		if (element) {
			element.textContent = String(content);
		}
	}
}
