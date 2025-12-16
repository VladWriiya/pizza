import { cn } from '@/lib/utils';
import React from 'react';
import { PizzaSize } from '../../constants/pizza-options';


interface PizzaImageProps {
  imageUrl: string;
  size: PizzaSize;
  className?: string;
}

const circleClass =
  'pz-absolute pz-left-1/2 pz-top-1/2 -pz-translate-x-1/2 -pz-translate-y-1/2 pz-border-dashed pz-border-2 pz-rounded-full';

export const PizzaImage = ({ imageUrl, size, className }: PizzaImageProps) => {
  return (
    <div className={cn('pz-flex pz-items-center pz-justify-center pz-flex-1 pz-relative pz-w-full pz-max-w-full pz-overflow-hidden', className)}>
      <img
        src={imageUrl}
        alt="Pizza"
        className={cn('pz-relative pz-left-1 pz-top-1 md:pz-left-2 md:pz-top-2 pz-transition-all pz-duration-300 pz-z-10', {
          'pz-w-[140px] pz-h-[140px] sm:pz-w-[200px] sm:pz-h-[200px] md:pz-w-[300px] md:pz-h-[300px]': size === 20,
          'pz-w-[170px] pz-h-[170px] sm:pz-w-[250px] sm:pz-h-[250px] md:pz-w-[400px] md:pz-h-[400px]': size === 30,
          'pz-w-[200px] pz-h-[200px] sm:pz-w-[280px] sm:pz-h-[280px] md:pz-w-[500px] md:pz-h-[500px]': size === 40,
        })}
      />

      <div className={cn(circleClass, 'pz-border-gray-200 pz-w-[220px] pz-h-[220px] sm:pz-w-[300px] sm:pz-h-[300px] md:pz-w-[450px] md:pz-h-[450px]')}></div>
      <div className={cn(circleClass, 'pz-border-gray-100 pz-w-[180px] pz-h-[180px] sm:pz-w-[240px] sm:pz-h-[240px] md:pz-w-[370px] md:pz-h-[370px]')}></div>
    </div>
  );
};
