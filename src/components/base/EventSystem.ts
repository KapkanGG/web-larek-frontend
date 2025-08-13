type EventPattern = string | RegExp;
type EventHandler<T = unknown> = (payload?: T) => void;
type SystemEvent<T = unknown> = {
	type: string;
	payload: T;
};

export interface IEventSystem {
	subscribe<T extends object>(
		event: EventPattern,
		handler: EventHandler<T>
	): void;
	dispatch<T extends object>(eventType: string, payload?: T): void;
	createEventTrigger<T extends object>(
		eventType: string,
		context?: Partial<T>
	): (payload: T) => void;
	on<T extends object>(event: EventPattern, handler: EventHandler<T>): void;
}

export class EventDispatcher implements IEventSystem {
	private subscribers: Map<EventPattern, Set<EventHandler>>;

	constructor() {
		this.subscribers = new Map();
	}

	subscribe<T extends object>(
		eventPattern: EventPattern,
		handler: EventHandler<T>
	) {
		if (!this.subscribers.has(eventPattern)) {
			this.subscribers.set(eventPattern, new Set());
		}
		this.subscribers.get(eventPattern)?.add(handler);
	}

	unsubscribe(eventPattern: EventPattern, handler: EventHandler) {
		const handlers = this.subscribers.get(eventPattern);
		if (!handlers) return;

		handlers.delete(handler);
		handlers.size === 0 && this.subscribers.delete(eventPattern);
	}

	dispatch<T extends object>(eventType: string, payload?: T) {
		this.subscribers.forEach((handlers, pattern) => {
			if (pattern === '*') {
				handlers.forEach((handler) => handler({ type: eventType, payload }));
			}
			if (
				(pattern instanceof RegExp && pattern.test(eventType)) ||
				pattern === eventType
			) {
				handlers.forEach((handler) => handler(payload));
			}
		});
	}

	subscribeToAll(handler: EventHandler<SystemEvent>) {
		this.subscribe('*', handler);
	}

	clearAllSubscriptions() {
		this.subscribers.clear();
	}

	createEventTrigger<T extends object>(
		eventType: string,
		context?: Partial<T>
	) {
		return (payload: object = {}) => {
			this.dispatch(eventType, { ...payload, ...context });
		};
	}

	on<T extends object>(eventPattern: EventPattern, handler: EventHandler<T>) {
		this.subscribe(eventPattern, handler);
	}
}
