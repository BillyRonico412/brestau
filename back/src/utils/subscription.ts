import EventEmitter from "events"

export const eventEmitter = new EventEmitter()

export const eventNames = {
	ORDER_CREATED: "orderCreated",
	ORDER_UPDATED: "orderUpdated",
}
