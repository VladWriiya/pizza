'use client';

import React from 'react';
import { Heading } from '@/shared/Heading';
import { CategoryForm } from './_components/CategoryForm';
import { CategoryItem } from './_components/CategoryItem';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useCategories } from './_hooks/useCategories';
import { useReorderCategories } from './_hooks/useReorderCategories';

export default function CategoriesPage() {
  const { categories, setCategories, loading, fetchCategories } = useCategories();
  const { handleDragEnd } = useReorderCategories(categories, setCategories);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between">
        <Heading level="1">Categories ({categories.length})</Heading>
      </div>

      <div className="pz-mt-8 pz-grid pz-grid-cols-3 pz-gap-8">
        <div className="pz-col-span-2 pz-space-y-2">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
            >
              <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                {categories.map((category) => (
                  <CategoryItem key={category.id} category={category} onUpdate={fetchCategories} />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div>
          <CategoryForm onCategoryCreated={fetchCategories} />
        </div>
      </div>
    </div>
  );
}