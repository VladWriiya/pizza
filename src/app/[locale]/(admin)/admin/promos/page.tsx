'use client';

import React from 'react';
import { Heading } from '@/shared/Heading';
import { PromoCardForm } from './_components/PromoCardForm';
import { PromoCardItem } from './_components/PromoCardItem';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { usePromoCards } from './_hooks/usePromoCards';
import { useReorderPromoCards } from './_hooks/useReorderPromoCards';

export default function PromosPage() {
  const { promoCards, setPromoCards, loading, fetchPromoCards } = usePromoCards();
  const { handleDragEnd } = useReorderPromoCards(promoCards, setPromoCards);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between">
        <Heading level="1">Promo Cards ({promoCards.length})</Heading>
      </div>

      <div className="pz-mt-8 pz-grid pz-grid-cols-3 pz-gap-8">
        <div className="pz-col-span-2 pz-space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : promoCards.length === 0 ? (
            <div className="pz-bg-white pz-p-8 pz-rounded-lg pz-text-center pz-text-gray-500">
              No promo cards yet. Create your first one!
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext items={promoCards} strategy={verticalListSortingStrategy}>
                {promoCards.map((promoCard) => (
                  <PromoCardItem key={promoCard.id} promoCard={promoCard} onUpdate={fetchPromoCards} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div>
          <PromoCardForm onCreated={fetchPromoCards} />
        </div>
      </div>
    </div>
  );
}
