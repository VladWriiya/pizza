import React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl }) => (
  <div>
    <h1>Order #{orderId} Confirmed</h1>
    <p>
      Thank you for your order! The total amount is <b>{totalAmount} ILS</b>.
    </p>
    <p>
      <a href={paymentUrl}>View Your Order Status</a>
    </p>
  </div>
);
