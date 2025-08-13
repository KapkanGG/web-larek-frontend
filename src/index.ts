import './scss/styles.scss';
import { EventDispatcher } from './components/base/EventSystem';
import { StoreApiService } from './components/api/MarketplaceAPI';
import { API_BASE_URL, ASSETS_BASE_URL, appConfig } from './utils/config';
import { getElement, cloneTemplateContent } from './utils/domHelpers';
import { ProductCollection } from './components/models/ProductCollection';
import { ShoppingCartManager } from './components/models/ShoppingCartManager';
import { CheckoutProcessor } from './components/models/CheckoutProcessor';
import { AppPage } from './components/views/AppPage';
import { DialogWindow } from './components/views/DialogWindow';
import { ProductCard } from './components/views/ProductCard';
import { ShoppingCartView } from './components/views/ShoppingCartView';
import { CheckoutForm } from './components/views/CheckoutForm';
import { ContactDetailsForm } from './components/views/ContactDetailsForm';
import { OrderConfirmation } from './components/views/OrderConfirmation';

type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

interface IStoreItem {
	id: string;
	title: string;
	imageUrl: string;
	price: number | null;
	category: ProductCategory;
	description: string;
}

interface IProduct {
	id: string;
	title: string;
	image: string;
	price: number | null;
	category: string;
	description: string;
}

interface IOrderResult {
	id: string;
	total: number;
}

interface ValidationErrors {
	paymentMethod?: string;
	deliveryAddress?: string;
	email?: string;
	phone?: string;
}

interface ICardInteractions {
	onClick: (event: MouseEvent) => void;
}

interface ICheckoutForm {
	payment: 'cash' | 'card' | null;
	address: string;
}

interface IContactDetails {
	email: string;
	phone: string;
}

interface IFormState {
	valid: boolean;
	errors: string[];
}

const events = new EventDispatcher();
const api = new StoreApiService(ASSETS_BASE_URL, API_BASE_URL);

const productCardTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.productCard
);
const productDetailsTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.productDetails
);
const cartItemTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.cartItem
);
const cartTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.cartView
);
const checkoutFormTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.checkoutForm
);
const contactFormTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.contactForm
);
const confirmationTemplate = getElement<HTMLTemplateElement>(
	appConfig.templates.confirmation
);

const productCollection = new ProductCollection({}, events);
const cartManager = new ShoppingCartManager({}, events);
const checkoutProcessor = new CheckoutProcessor(events, cartManager);

const page = new AppPage(document.body, events);
const modal = new DialogWindow(
	getElement(appConfig.ui.dialog.containerId),
	events
);

const cartView = new ShoppingCartView(
	cloneTemplateContent(cartTemplate),
	events
);
const checkoutForm = new CheckoutForm(
	cloneTemplateContent(checkoutFormTemplate),
	events
);
const contactForm = new ContactDetailsForm(
	cloneTemplateContent(contactFormTemplate),
	events
);

const orderConfirmation = new OrderConfirmation(
	cloneTemplateContent(confirmationTemplate),
	{ handleClose: () => modal.hide() }
);

function toStoreItem(product: IProduct): IStoreItem {
	return {
		id: product.id,
		title: product.title,
		imageUrl: `${ASSETS_BASE_URL}${product.image}`,
		price: product.price,
		category: product.category as ProductCategory,
		description: product.description,
	};
}

events.on<{ items: IProduct[] }>('productList:update', ({ items }) => {
	const storeItems = items.map(toStoreItem);
	page.productItems = storeItems.map((item) => {
		const card = new ProductCard(cloneTemplateContent(productCardTemplate), {
			onClick: () => productCollection.setProductPreview(item),
		});
		return card.updateContent({
			id: item.id,
			title: item.title,
			imageUrl: item.imageUrl,
			price: item.price,
			category: item.category,
			buttonText: 'В корзину',
		});
	});
});

events.on<{ item: IStoreItem }>('itemPreview:change', ({ item }) => {
	if (!item) {
		modal.hide();
		return;
	}

	const card = new ProductCard(cloneTemplateContent(productDetailsTemplate), {
		onClick: () => {
			cartManager.hasItem(item.id)
				? cartManager.removeItem(item.id)
				: cartManager.addItem(item);
			productCollection.setProductPreview(item);
		},
	});

	modal.content = card.updateContent({
		id: item.id,
		title: item.title,
		imageUrl: item.imageUrl,
		price: item.price,
		category: item.category,
		description: item.description,
		buttonText: cartManager.hasItem(item.id)
			? 'Удалить из корзины'
			: 'Добавить в корзину',
	});
	modal.show();
});

events.on('cart:update', () => {
	page.itemsCount = cartManager.getItemCount();

	const items = cartManager.getCartContents().map((item, index) => {
		const card = new ProductCard(cloneTemplateContent(cartItemTemplate), {
			onClick: () => {
				cartManager.removeItem(item.id);
				const preview = productCollection.getPreviewedProduct();
				if (preview?.id === item.id) {
					const fullProduct = productCollection.findProductById(item.id);
					if (fullProduct) productCollection.setProductPreview(fullProduct);
				}
			},
		});

		const element = card.updateContent({
			id: item.id,
			title: item.title,
			price: item.price,
		});

		const positionElement = element.querySelector(
			appConfig.ui.productCard.positionClass
		);
		if (positionElement) positionElement.textContent = String(index + 1);

		return element;
	});

	cartView.updateContent({
		items,
		total: cartManager.calculateTotal(),
		buttonDisabled: items.length === 0,
	});
});

events.on('cart:show', () => {
	modal.content = cartView.updateContent({
		items: [],
		total: 0,
		buttonDisabled: cartManager.getItemCount() === 0,
	});
	modal.show();
});

events.on('checkout:initiate', () => {
	checkoutProcessor.resetCheckout();
	modal.content = checkoutForm.updateContent({
		payment: null,
		address: '',
		valid: false,
		errorMessages: [],
	});
	modal.show();
});

events.on<ValidationErrors>('validation:update', (errors) => {
	checkoutForm.isValid = !errors.paymentMethod && !errors.deliveryAddress;
	checkoutForm.validationMessages = [
		errors.paymentMethod || '',
		errors.deliveryAddress || '',
	].filter(Boolean);

	contactForm.isValid = !errors.email && !errors.phone;
	contactForm.validationMessages = [
		errors.email || '',
		errors.phone || '',
	].filter(Boolean);
});

events.on('order:submit', () => {
	modal.content = contactForm.updateContent({
		email: '',
		phone: '',
		valid: false,
		errors: [],
	});
	modal.show();
});

events.on('contacts:submit', () => {
	api
		.submitOrder(checkoutProcessor.getOrderInformation())
		.then((result: IOrderResult) => {
			modal.content = orderConfirmation.updateContent({
				total: result.total,
			});
			cartManager.emptyCart();
			checkoutProcessor.resetCheckout();
		})
		.catch(console.error);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.fetchAllProducts()
	.then((products: IProduct[]) => {
		const storeItems = products.map(toStoreItem);
		productCollection.updateProductList(storeItems);
	})
	.catch(console.error);
