'use client';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  details?: string;
}

interface OrderItemsListProps {
  items: OrderItem[];
  comment?: string | null;
}

export function OrderItemsList({ items, comment }: OrderItemsListProps) {
  return (
    <div className="pz-p-4">
      <ul className="pz-space-y-2">
        {items.map((item, idx) => {
          // Parse details to highlight removed ingredients in red
          const detailParts = item.details?.split(' | ') || [];

          return (
            <li key={idx} className="pz-flex pz-justify-between pz-text-sm">
              <span>
                <span className="pz-font-semibold">{item.quantity}x</span> {item.name}
                {detailParts.length > 0 && (
                  <span className="pz-text-xs pz-block pz-ms-4">
                    {detailParts.map((part, partIdx) => {
                      const isRemoved = part.startsWith('-');
                      const isAdded = part.startsWith('+');
                      return (
                        <span
                          key={partIdx}
                          className={
                            isRemoved
                              ? 'pz-text-red-600 pz-font-medium'
                              : isAdded
                              ? 'pz-text-green-600'
                              : 'pz-text-gray-500'
                          }
                        >
                          {part}
                          {partIdx < detailParts.length - 1 && (
                            <span className="pz-text-gray-400"> | </span>
                          )}
                        </span>
                      );
                    })}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {comment && (
        <div className="pz-mt-3 pz-p-2 pz-bg-yellow-50 pz-rounded pz-text-sm">
          <span className="pz-font-semibold">Note:</span> {comment}
        </div>
      )}
    </div>
  );
}
