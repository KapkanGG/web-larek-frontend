import type { IStoreItem } from './StoreItem';

export type ICartItem = Pick<IStoreItem, 'id' | 'title' | 'price'>;

export interface ICartView {
	itemElements: HTMLElement[];
	totalAmount: number;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	buttonDisabled: boolean;
}

export interface ICartManager {
	addItem(item: IStoreItem): void;
	removeItem(id: string): void;
	emptyCart(): void;
	calculateTotal(): number;
	getItemCount(): number;
	hasItem(id: string): boolean;
	getCartContents(): ICartItem[];
}
