const isProduction = process.env.NODE_ENV === 'production';

const DEFAULT_API_BASE = 'http://localhost:3000/marketplace/api';
const DEFAULT_ASSETS_BASE = 'http://localhost:3000/marketplace/assets';

export const API_BASE_URL = isProduction
	? 'https://api.yourdomain.com/marketplace/api'
	: process.env.VITE_API_BASE || DEFAULT_API_BASE;

export const ASSETS_BASE_URL = isProduction
	? 'https://assets.yourdomain.com/marketplace/assets'
	: process.env.VITE_API_BASE || DEFAULT_ASSETS_BASE;

export const appConfig = {
	ui: {
		dialog: {
			containerId: 'dialog-root',
			contentClass: 'dialog-content',
			closeButtonClass: 'dialog-close-btn',
		},
		page: {
			layoutClass: 'app-layout',
			productGridClass: 'product-grid',
			cartButtonClass: 'cart-widget',
			cartCounterClass: 'cart-counter',
		},
		productCard: {
			titleClass: 'product-title',
			priceClass: 'product-price',
			imageClass: 'product-image',
			categoryClass: 'product-category',
			descriptionClass: 'product-description',
			actionButtonClass: 'product-action-btn',
			removeButtonClass: 'cart-remove-btn',
			positionClass: 'item-position',
		},
		cart: {
			listClass: 'cart-items-list',
			totalClass: 'cart-total',
			checkoutButtonClass: 'checkout-btn',
		},
		forms: {
			submitButton: 'button[type=submit]',
			errorContainerClass: 'form-errors',
			inputFieldClass: 'form-input',
		},
		orderConfirmation: {
			closeButtonClass: 'confirmation-close',
			totalAmountClass: 'confirmation-total',
		},
	},
	templates: {
		productCard: '#product-card-template',
		productDetails: '#product-details-template',
		cartItem: '#cart-item-template',
		cartView: '#cart-template',
		checkoutForm: '#checkout-form-template',
		contactForm: '#contact-form-template',
		confirmation: '#confirmation-template',
	},
};
