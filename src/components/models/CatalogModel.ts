import { Model } from '../base/Model';
import { ICatalogModel, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class CatalogModel
	extends Model<ICatalogModel>
	implements ICatalogModel
{
	private _items: IProduct[] = [];
	private _preview: string | null = null;
	private _loading = false;

	constructor(data: Partial<ICatalogModel>, events: IEvents) {
		super(data, events);
	}

	setItems(items: IProduct[]): void {
		this._items = items;
		this.emitChanges('items:changed', this._items);
	}

	getProduct(id: string): IProduct | undefined {
		return this._items.find((item) => item.id === id);
	}

	setPreview(product: IProduct): void {
		this._preview = product.id;
		this.emitChanges('preview:changed', product);
	}

	getPreview(): IProduct | null {
		if (!this._preview) return null;
		return this.getProduct(this._preview) || null;
	}

	setLoading(state: boolean): void {
		this._loading = state;
	}
	getItems(): IProduct[] {
		return [...this._items];
	}

	isLoading(): boolean {
		return this._loading;
	}
}
