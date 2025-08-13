import { DataEntity } from '../base/DataEntity';
import { IEventSystem } from '../base/EventSystem';

interface IStoreItem {
	id: string;
	title: string;
	price: number;
}

interface ICartItem {
	id: string;
	title: string;
	price: number;
}

interface ICartManager {
	addItem(item: IStoreItem): void;
	removeItem(id: string): void;
	emptyCart(): void;
	calculateTotal(): number;
	getItemCount(): number;
	hasItem(id: string): boolean;
	getCartContents(): ICartItem[];
}

export class ShoppingCartManager
	extends DataEntity<ICartManager>
	implements ICartManager
{
	private cartItems: Map<string, ICartItem> = new Map();

	constructor(initialData: Partial<ICartManager>, eventSystem: IEventSystem) {
		super(initialData, eventSystem);
	}

	addItem(item: IStoreItem): void {
		if (item.price === null) return;

		this.cartItems.set(item.id, {
			id: item.id,
			title: item.title,
			price: item.price,
		});
		this.notifyChanges('cart:update', this.getCartContents());
	}

	removeItem(id: string): void {
		this.cartItems.delete(id);
		this.notifyChanges('cart:update', this.getCartContents());
	}

	emptyCart(): void {
		this.cartItems.clear();
		this.notifyChanges('cart:update', this.getCartContents());
	}

	calculateTotal(): number {
		return [...this.cartItems.values()].reduce(
			(sum, item) => sum + item.price,
			0
		);
	}

	getItemCount(): number {
		return this.cartItems.size;
	}

	hasItem(id: string): boolean {
		return this.cartItems.has(id);
	}

	getCartContents(): ICartItem[] {
		return Array.from(this.cartItems.values());
	}
}
