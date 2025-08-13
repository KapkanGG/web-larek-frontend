import type { IStoreItem } from './StoreItem';
import type { ICartItem } from './ShoppingCartTypes';
import type { IPurchase, ValidationErrors } from './CheckoutTypes';

export interface IAppEventMap {
	'productList:update': IStoreItem[];
	'cart:open': void;
	'cart:update': ICartItem[];
	'itemPreview:change': IStoreItem;
	'checkout:initiate': void;
	'validation:update': ValidationErrors;
	'dialog:show': void;
	'dialog:hide': void;
	'checkout:valid': IPurchase;
	'contactInfo:valid': IPurchase;
}
