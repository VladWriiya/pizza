'use client';

import { PizzaImage } from './PizzaImage';
import type { PizzaSize } from '@/constants/pizza-options';

interface Props {
  isPizza: boolean;
  imageUrl: string;
  name: string;
  size: PizzaSize;
}

export const ProductImage = ({ isPizza, imageUrl, name, size }: Props) => {
  if (isPizza) {
    return <PizzaImage imageUrl={imageUrl} size={size} />;
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className="pz-w-[350px] pz-h-[350px] pz-object-contain"
    />
  );
};