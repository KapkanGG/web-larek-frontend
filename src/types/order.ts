export type PaymentMethod = 'cash' | 'online';

export interface IOrderForm {
	payment: PaymentMethod | null;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderModel {
	order: IOrder;
	formErrors: FormErrors;
	setField(
		field: keyof (IOrderForm & IContactsForm),
		value: string | PaymentMethod
	): void;
	clearOrder(): void;
}
