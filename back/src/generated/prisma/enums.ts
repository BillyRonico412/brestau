
/* !!! This is code generated by Prisma. Do not edit directly. !!! */
/* eslint-disable */
/* @ts-nocheck */
/**
* This file exports all enum related types from the schema.
*
* 🟢 You can import this file directly.
*/
export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED'
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]


export const OrderItemStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export type OrderItemStatus = (typeof OrderItemStatus)[keyof typeof OrderItemStatus]
