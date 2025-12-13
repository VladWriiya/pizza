'use client';

import React from 'react';
import { PromoCard } from '@prisma/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ExternalLink, Link as LinkIcon, MousePointer, Copy, Info, Layout } from 'lucide-react';
import { EditPromoCardDialog } from './EditPromoCardDialog';
import { DeletePromoCardButton } from './DeletePromoCardButton';
import { cn } from '@/lib/utils';

interface Props {
  promoCard: PromoCard;
  onUpdate: () => void;
}

const actionTypeIcons: Record<string, React.ReactNode> = {
  scroll: <MousePointer size={14} />,
  link: <LinkIcon size={14} />,
  external: <ExternalLink size={14} />,
  copy: <Copy size={14} />,
  modal: <Layout size={14} />,
  info: <Info size={14} />,
};

export const PromoCardItem: React.FC<Props> = ({ promoCard, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: promoCard.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'pz-flex pz-items-center pz-bg-white pz-p-3 pz-rounded-lg pz-shadow-sm pz-gap-3',
        !promoCard.isActive && 'pz-opacity-50'
      )}
    >
      {/* Drag handle */}
      <button {...attributes} {...listeners} className="pz-cursor-grab pz-touch-none">
        <GripVertical className="pz-text-gray-400" />
      </button>

      {/* Image preview */}
      <div
        className="pz-w-12 pz-h-16 pz-rounded pz-bg-cover pz-bg-center pz-flex-shrink-0"
        style={{ backgroundImage: `url(${promoCard.imageUrl})` }}
      />

      {/* Content */}
      <div className="pz-flex-1 pz-min-w-0">
        <div className="pz-font-medium pz-truncate">{promoCard.title_en}</div>
        <div className="pz-text-sm pz-text-gray-500 pz-truncate">{promoCard.subtitle_en}</div>
      </div>

      {/* Action type badge */}
      <div className="pz-flex pz-items-center pz-gap-1 pz-text-xs pz-bg-gray-100 pz-px-2 pz-py-1 pz-rounded">
        {actionTypeIcons[promoCard.actionType]}
        <span className="pz-capitalize">{promoCard.actionType}</span>
      </div>

      {/* Status badge */}
      <div
        className={cn(
          'pz-text-xs pz-px-2 pz-py-1 pz-rounded',
          promoCard.isActive
            ? 'pz-bg-green-100 pz-text-green-700'
            : 'pz-bg-gray-100 pz-text-gray-500'
        )}
      >
        {promoCard.isActive ? 'Active' : 'Inactive'}
      </div>

      {/* Actions */}
      <div className="pz-flex pz-items-center pz-gap-1">
        <EditPromoCardDialog promoCard={promoCard} onUpdated={onUpdate} />
        <DeletePromoCardButton promoCardId={promoCard.id} onDeleted={onUpdate} />
      </div>
    </div>
  );
};
