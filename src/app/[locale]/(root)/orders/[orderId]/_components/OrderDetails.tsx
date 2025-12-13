import { MapPin, Phone, User, ShoppingBag } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  details?: string;
}

interface OrderDetailsProps {
  order: {
    id: number;
    fullName: string;
    address: string;
    phone: string;
    totalAmount: number;
    items: unknown;
    createdAt: Date;
  };
}

function parseOrderItems(items: unknown): OrderItem[] {
  if (Array.isArray(items)) {
    return items as OrderItem[];
  }
  return [];
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const items = parseOrderItems(order.items);

  return (
    <div className="pz-space-y-4">
      {/* Delivery Info */}
      <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-5">
        <h3 className="pz-font-semibold pz-mb-4 pz-flex pz-items-center pz-gap-2">
          <MapPin size={18} className="pz-text-gray-500" />
          Delivery Details
        </h3>
        <div className="pz-space-y-3 pz-text-sm">
          <div className="pz-flex pz-items-center pz-gap-3">
            <User size={16} className="pz-text-gray-400" />
            <span>{order.fullName}</span>
          </div>
          <div className="pz-flex pz-items-center pz-gap-3">
            <MapPin size={16} className="pz-text-gray-400" />
            <span>{order.address}</span>
          </div>
          <div className="pz-flex pz-items-center pz-gap-3">
            <Phone size={16} className="pz-text-gray-400" />
            <a href={`tel:${order.phone}`} className="pz-text-blue-600 hover:pz-underline">
              {order.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-5">
        <h3 className="pz-font-semibold pz-mb-4 pz-flex pz-items-center pz-gap-2">
          <ShoppingBag size={18} className="pz-text-gray-500" />
          Order Items
        </h3>
        <ul className="pz-divide-y pz-divide-gray-100">
          {items.map((item, idx) => (
            <li key={idx} className="pz-py-3 pz-flex pz-justify-between pz-items-start">
              <div>
                <span className="pz-font-medium">
                  {item.quantity}x {item.name}
                </span>
                {item.details && (
                  <p className="pz-text-sm pz-text-gray-500 pz-mt-1">{item.details}</p>
                )}
              </div>
              <span className="pz-text-gray-600">{item.price * item.quantity} ILS</span>
            </li>
          ))}
        </ul>
        <div className="pz-border-t pz-border-gray-200 pz-pt-3 pz-mt-3 pz-flex pz-justify-between pz-font-bold pz-text-lg">
          <span>Total</span>
          <span>{order.totalAmount} ILS</span>
        </div>
      </div>

      {/* Order Date */}
      <p className="pz-text-center pz-text-sm pz-text-gray-400">
        Ordered on {new Date(order.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
