'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/shared/ui';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="pz-gap-1"
      title={enabled ? 'Mute alert sounds' : 'Enable alert sounds'}
    >
      {enabled ? (
        <Volume2 className="pz-w-4 pz-h-4" />
      ) : (
        <VolumeX className="pz-w-4 pz-h-4 pz-text-gray-400" />
      )}
      <span className="pz-text-xs pz-hidden sm:pz-inline">
        {enabled ? 'Sound On' : 'Sound Off'}
      </span>
    </Button>
  );
}
