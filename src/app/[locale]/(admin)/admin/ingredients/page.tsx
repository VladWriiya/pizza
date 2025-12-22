import React from 'react';
import { prisma } from '../../../../../../prisma/prisma-client';
import { Heading } from '@/shared/Heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { IngredientForm } from './_components/IngredientForm';
import { DeleteIngredientButton } from './_components/DeleteIngredientButton';
import { UpdateIngredientAvailabilityButton } from './_components/UpdateIngredientAvailabilityButton';
import { EditIngredientDialog } from './_components/EditIngredientDialog';

export default async function IngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between">
        <Heading level="1">Ingredients ({ingredients.length})</Heading>
      </div>

      <div className="pz-mt-8 pz-grid pz-grid-cols-3 pz-gap-8">
        <div className="pz-col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="pz-text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.id}>
                  <TableCell>
                    <img src={ingredient.imageUrl} alt={ingredient.name} width={40} height={40} className="pz-rounded-full" />
                  </TableCell>
                  <TableCell className="pz-font-medium">{ingredient.name}</TableCell>
                  <TableCell>{ingredient.price}</TableCell>
                  <TableCell>
                    <UpdateIngredientAvailabilityButton
                      id={ingredient.id}
                      isAvailable={ingredient.isAvailable}
                    />
                  </TableCell>
                  <TableCell className="pz-text-right pz-space-x-2">
                    <EditIngredientDialog ingredient={ingredient} />
                    <DeleteIngredientButton ingredientId={ingredient.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <IngredientForm />
        </div>
      </div>
    </div>
  );
}