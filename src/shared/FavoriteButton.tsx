'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleFavoriteAction } from '@/app/[locale]/actions/favorites';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  productId: number;
  initialFavorite?: boolean;
  className?: string;
  size?: number;
}

export function FavoriteButton({
  productId,
  initialFavorite = false,
  className,
  size = 24,
}: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleFavoriteAction(productId);
      if (result.success) {
        setIsFavorite(result.isFavorite ?? false);
        toast.success(result.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      } else {
        toast.error(result.error || 'Failed to update favorites');
      }
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'pz-p-2 pz-rounded-full pz-transition-all pz-duration-200',
        'hover:pz-scale-110 active:pz-scale-95',
        'focus:pz-outline-none focus:pz-ring-2 focus:pz-ring-primary/50',
        isLoading && 'pz-opacity-50 pz-cursor-not-allowed',
        isFavorite
          ? 'pz-bg-red-50 pz-text-red-500 hover:pz-bg-red-100'
          : 'pz-bg-white/80 pz-text-gray-400 hover:pz-text-red-400 hover:pz-bg-white',
        className
      )}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={size}
        className={cn(
          'pz-transition-all',
          isFavorite && 'pz-fill-current'
        )}
      />
    </button>
  );
}
