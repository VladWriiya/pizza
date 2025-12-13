import { OrderItem } from '@/lib/schemas/order-form-schema';
import React from 'react';

interface Props {
  orderId: number;
  items: OrderItem[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({ orderId, items }) => (
  <div>
    <h1>Thank you for your purchase! 🎉</h1>
    <p>Your order #{orderId} has been successfully paid.</p>
    <p>Order details:</p>
    <hr />
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} | {item.price} ILS x {item.quantity} = {item.price * item.quantity} ILS
        </li>
      ))}
    </ul>
  </div>
);
