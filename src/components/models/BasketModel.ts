import { Model } from '../base/Model';
import { IBasketModel, IBasketItem, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class BasketModel extends Model<IBasketModel> implements IBasketModel {
	private _items: Map<string, IBasketItem> = new Map();

	constructor(data: Partial<IBasketModel>, events: IEvents) {
		super(data, events);
	}

	add(product: IProduct): void {
		if (product.price === null) {
			return;
		}

		this._items.set(product.id, {
			id: product.id,
			title: product.title,
			price: product.price,
		});
		this.emitChanges('basket:changed', this.getItems());
	}

	remove(id: string): void {
		this._items.delete(id);
		this.emitChanges('basket:changed', this.getItems());
	}

	clear(): void {
		this._items.clear();
		this.emitChanges('basket:changed', this.getItems());
	}

	getTotal(): number {
		return Array.from(this._items.values()).reduce(
			(total, item) => total + item.price,
			0
		);
	}

	getCount(): number {
		return this._items.size;
	}

	contains(id: string): boolean {
		return this._items.has(id);
	}

	getItems(): IBasketItem[] {
		return Array.from(this._items.values());
	}
}
