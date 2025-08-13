import { IEventSystem as IEventDispatcher } from './EventSystem';

export abstract class DataEntity<EntityType> {
    constructor(
        initialData: Partial<EntityType>, 
        protected eventDispatcher: IEventDispatcher
    ) {
        Object.assign(this, initialData);
    }

    notifyChanges(eventType: string, data?: object) {
        this.eventDispatcher.dispatch(eventType, data ?? {});
    }
}