'use-client';
import { cn } from "@/lib/utils";
import React from "react";

export type Variant = {
    name: string,
    value: string,
    disabled?: boolean;
}

interface VariantSelectorProps {
    items: readonly Variant[];
    onClick?: (value: Variant['value']) => void;
    className?: string;
    value?: Variant['value'];
}

export const VariantSelector = ({ items, onClick, className, value }: VariantSelectorProps) => {
    return (
        <div className={cn(className, 'pz-flex pz-items-center pz-justify-between pz-bg-[#f3f3f7] pz-rounded-3xl pz-p-1 pz-select-none')}>
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => !item.disabled && onClick?.(item.value)}
                    className={cn(
                        'pz-flex pz-items-center pz-justify-center pz-h-[30px] pz-px-5 pz-flex-1 pz-rounded-3xl pz-transition-all pz-duration-400 pz-text-sm',
                        {
                            'pz-bg-white pz-shadow': item.value === value,
                            'pz-text-gray-500 pz-opacity-50 pz-pointer-events-none': item.disabled,
                            'pz-cursor-pointer': !item.disabled
                        },
                    )}>
                    {item.name}
                </button>
            ))}
        </div>
    );
}