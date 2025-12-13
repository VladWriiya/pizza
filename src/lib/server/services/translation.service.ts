import { Prisma } from '@prisma/client';

export function buildTranslations(name_en: string, name_he: string): Prisma.JsonObject {
  return {
    en: { name: name_en },
    he: { name: name_he },
  };
}