'use client';
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import React from "react";

interface IngredientCardProps {
    imageUrl: string;
    name: string;
    price: number;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    isAvailable?: boolean; 
}

export const IngredientCard = ({ className, isActive, price, name, imageUrl, onClick, isAvailable = true }: IngredientCardProps) => {
    return (
        <div
            className={cn(
                'pz-flex pz-items-center pz-flex-col pz-p-1 pz-rounded-md pz-w-full pz-text-center pz-relative pz-shadow-md pz-bg-white pz-transition-opacity',
                { 'pz-border pz-border-primary': isActive },
                { 'pz-opacity-50 pz-cursor-not-allowed': !isAvailable },
                { 'pz-cursor-pointer': isAvailable },
                className
            )}
            onClick={isAvailable ? onClick : undefined} 
        >
            {isActive && <CircleCheck className="pz-absolute pz-top-2 pz-right-2 pz-text-primary" />}
            {!isAvailable && (
                <div className="pz-absolute pz-inset-0 pz-bg-gray-200/50 pz-rounded-md" />
            )}
            <img
                className="pz-w-[70px] pz-h-[70px] sm:pz-w-[90px] sm:pz-h-[90px] md:pz-w-[110px] md:pz-h-[110px] pz-object-contain"
                src={imageUrl}
                alt={name}
            />
            <span className="pz-text-[10px] sm:pz-text-xs pz-mb-1 pz-line-clamp-2 pz-leading-tight">{name}</span>
            <span className="pz-font-bold pz-text-sm sm:pz-text-base">{price} ₪</span>
        </div>
    );
};