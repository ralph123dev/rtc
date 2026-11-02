import type { ImageSourcePropType } from 'react-native';

export const SHOP_CATEGORIES = [
  'RTC - Général',
  'RTC - 14 - 18 ans',
  'RTC - Étudiant +',
  'RTC - 65+',
  'STLévis',
  'RTC + Communauto',
  'RTC - ÉquiMobilité',
  'STAC - ÉquiMobilité',
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];

export type ShopProduct = {
  id: string;
  title: string;
  priceInCents: number;
  description: string;
  image: ImageSourcePropType;
  requiresJustification?: boolean;
};

const ticketImage = require('../../assets/images/img/ticket_bleu.png');
const passImage = require('../../assets/images/img/rtc_autre.png');

export const SHOP_PRODUCTS: Record<ShopCategory, ShopProduct[]> = {
  'RTC - Général': [
    {
      id: 'general-one-trip',
      title: 'RTC - 1 passage - Général',
      priceInCents: 385,
      description: 'Titre valide dès la validation à bord.',
      image: ticketImage,
    },
    {
      id: 'general-twenty-tickets',
      title: 'RTC - Lot de 20 billets économique',
      priceInCents: 6700,
      description: 'Carnet de 20 billets du réseau général du RTC.',
      image: ticketImage,
    },
    {
      id: 'general-ninety-days',
      title: 'RTC - 90 jours consécutifs - Général',
      priceInCents: 27675,
      description: 'Titre valide pour 90 jours consécutifs sur le réseau général du RTC.',
      image: ticketImage,
    },
    {
      id: 'general-thirty-days',
      title: 'RTC - 30 jours - Général',
      priceInCents: 10250,
      description: 'Titre valide pour 30 jours sur le réseau général du RTC.',
      image: ticketImage,
    },
    {
      id: 'general-one-day',
      title: 'RTC - 1 jour - General',
      priceInCents: 1050,
      description: 'Titre valide pendant une journée sur le réseau général du RTC.',
      image: passImage,
    },
    {
      id: 'general-five-consecutive-days',
      title: 'RTC - 5 jours consécutifs - General',
      priceInCents: 3475,
      description: 'Titre valide pendant 5 jours consécutifs sur le réseau général du RTC.',
      image: passImage,
    },
    {
      id: 'general-unlimited-weekend',
      title: 'RTC - Week-end illimité - General',
      priceInCents: 1900,
      description: 'Titre valide sans limite pendant le week-end sur le réseau général du RTC.',
      image: passImage,
    },
  ],
  'RTC - 14 - 18 ans': [
    {
      id: 'teen-one-trip',
      title: 'RTC - 1 passage - 14 - 18 ans',
      priceInCents: 315,
      description: 'Titre valide dès la validation à bord pour les 14 à 18 ans.',
      image: ticketImage,
      requiresJustification: true,
    },
    {
      id: 'teen-october-monthly',
      title: 'RTC - Mensuel - octobre - 14 - 18 ans',
      priceInCents: 6835,
      description: 'Titre mensuel pour octobre destiné aux 14 à 18 ans.',
      image: passImage,
      requiresJustification: true,
    },
  ],
  'RTC - Étudiant +': [
    {
      id: 'student-plus-one-trip',
      title: 'RTC - 1 passage - Étudiant+',
      priceInCents: 385,
      description: 'Titre étudiant valide dès la validation à bord.',
      image: ticketImage,
    },
    {
      id: 'student-plus-october-monthly',
      title: 'RTC - Mensuel - octobre - Étudiant+',
      priceInCents: 6835,
      description: 'Titre mensuel pour octobre destiné aux étudiants.',
      image: passImage,
      requiresJustification: true,
    },
    {
      id: 'student-plus-five-days',
      title: 'RTC - 5 jours consécutifs - Étudiant+',
      priceInCents: 2875,
      description: 'Titre valide pendant 5 jours consécutifs.',
      image: passImage,
      requiresJustification: true,
    },
    {
      id: 'student-plus-weekend',
      title: 'RTC - Week-end illimité - Étudiant+',
      priceInCents: 1900,
      description: 'Titre valide sans limite pendant le week-end.',
      image: passImage,
      requiresJustification: true,
    },
  ],
  'RTC - 65+': [
    {
      id: 'senior-65-one-trip',
      title: 'RTC - 1 passage - 65+',
      priceInCents: 315,
      description: 'Titre valide dès la validation à bord.',
      image: ticketImage,
      requiresJustification: true,
    },
    {
      id: 'senior-65-october-monthly',
      title: 'RTC - Mensuel - octobre - 65+',
      priceInCents: 6835,
      description: 'Titre mensuel pour le mois d’octobre destiné aux personnes de 65 ans et plus.',
      image: passImage,
      requiresJustification: true,
    },
    {
      id: 'senior-65-ten-off-peak',
      title: 'RTC - 10 passages hors pointe - 65+',
      priceInCents: 2300,
      description: 'Lot de 10 passages hors pointe destiné aux personnes de 65 ans et plus.',
      image: ticketImage,
      requiresJustification: true,
    },
    {
      id: 'senior-65-five-days',
      title: 'RTC - 5 jours consécutifs - 65+',
      priceInCents: 2875,
      description: 'Titre valide pendant 5 jours consécutifs pour les personnes de 65 ans et plus.',
      image: passImage,
      requiresJustification: true,
    },
  ],
  STLévis: [
    {
      id: 'stlevis-october-monthly-regular',
      title: 'STLévis - Mensuel - octobre - Régulier',
      priceInCents: 10250,
      description: 'Titre mensuel régulier STLévis pour octobre.',
      image: ticketImage,
    },
    {
      id: 'stlevis-october-monthly-privilege',
      title: 'STLévis - Mensuel - octobre - Privilège 14 à 23 ans',
      priceInCents: 7700,
      description: 'Titre mensuel Privilège STLévis pour les 14 à 23 ans.',
      image: ticketImage,
      requiresJustification: true,
    },
  ],
  'RTC + Communauto': [
    {
      id: 'rtc-communauto-october-monthly',
      title: 'RTC - Mensuel - octobre - BUS+LE Xauto',
      priceInCents: 10500,
      description: 'Titre mensuel combiné RTC et Communauto pour octobre.',
      image: passImage,
    },
  ],
  'RTC - ÉquiMobilité': [
    {
      id: 'rtc-equimobility-one-trip',
      title: 'RTC - 1 passage - ÉquiMobilité',
      priceInCents: 205,
      description: 'Titre ÉquiMobilité valide dès la validation à bord.',
      image: ticketImage,
      requiresJustification: true,
    },
    {
      id: 'rtc-equimobility-october-monthly',
      title: 'RTC - Mensuel - octobre - ÉquiMobilité',
      priceInCents: 5100,
      description: 'Titre mensuel ÉquiMobilité pour octobre.',
      image: ticketImage,
      requiresJustification: true,
    },
  ],
  'STAC - ÉquiMobilité': [
    {
      id: 'stac-equimobility-one-trip',
      title: 'STAC - 1 passage - ÉquiMobilité',
      priceInCents: 205,
      description: 'Titre STAC ÉquiMobilité valide dès la validation à bord.',
      image: ticketImage,
      requiresJustification: true,
    },
    {
      id: 'stac-equimobility-october-monthly',
      title: 'STAC - Mensuel - octobre - ÉquiMobilité',
      priceInCents: 5100,
      description: 'Titre mensuel STAC ÉquiMobilité pour octobre.',
      image: ticketImage,
      requiresJustification: true,
    },
  ],
};

export function formatShopPrice(priceInCents: number): string {
  const dollars = Math.floor(priceInCents / 100);
  const cents = String(priceInCents % 100).padStart(2, '0');
  return `${dollars},${cents} $CA`;
}
