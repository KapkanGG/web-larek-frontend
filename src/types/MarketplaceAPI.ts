import type { IStoreItem } from './StoreItem';
import type { IPurchase, IPurchaseResult } from './CheckoutTypes';

export interface IMarketplaceAPI {
	fetchAvailableItems(): Promise<IStoreItem[]>;
	getItemDetails(itemId: string): Promise<IStoreItem>;
	submitPurchase(purchase: IPurchase): Promise<IPurchaseResult>;
}
