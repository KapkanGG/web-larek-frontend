import type { IProduct } from './product';

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export interface IBasketModel {
	add(product: IProduct): void;
	remove(id: string): void;
	clear(): void;
	getTotal(): number;
	getCount(): number;
	contains(id: string): boolean;
	getItems(): IBasketItem[];
}
