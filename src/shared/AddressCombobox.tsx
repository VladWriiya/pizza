'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/shared/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useDebouncedCallback } from 'use-debounce';
import type { PhotonFeature, PhotonResponse } from '@/shared/api/photon/photon';

interface AddressComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function AddressCombobox({ value, onChange }: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [results, setResults] = React.useState<PhotonFeature[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchAddresses = useDebouncedCallback(async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en&lat=32.0853&lon=34.7818`
      );
      const data: PhotonResponse = await response.json();
      setResults(data.features || []);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleInputChange = (query: string) => {
    setSearchQuery(query);
    fetchAddresses(query);
  };

  const formatAddress = (feature: PhotonFeature | undefined): string => {
    if (!feature) return '';
    const { housenumber, street, city, name } = feature.properties;

    const addressParts = [housenumber, street, city, name];

    const filteredParts = addressParts.filter(Boolean);

    return filteredParts.join(', ');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="pz-w-full pz-justify-between pz-h-12">
          <span className="pz-truncate">{value || 'Select address...'}</span>
          <ChevronsUpDown className="pz-ml-2 pz-h-4 pz-w-4 pz-shrink-0 pz-opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pz-w-[400px] pz-p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search address..." value={searchQuery} onValueChange={handleInputChange} />
          <CommandEmpty>{loading ? 'Loading...' : 'No address found.'}</CommandEmpty>
          <CommandGroup>
            {results.map((feature) => {
              const formatted = formatAddress(feature);
              return (
                <CommandItem
                  key={feature.properties.osm_id}
                  value={formatted}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn('pz-mr-2 pz-h-4 pz-w-4', value === formatted ? 'pz-opacity-100' : 'pz-opacity-0')}
                  />
                  {formatted}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
