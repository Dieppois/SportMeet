import type { SportLevel } from "./localUserService";

export type Group = {
  id: string;
  sport: string;
  level: SportLevel;
  city?: string;
  membersCount: number;
  description: string;
};

const GROUPS: Group[] = [
  {
    id: "g_handball_debutant",
    sport: "Handball",
    level: "Débutant",
    city: "Paris",
    membersCount: 18,
    description: "Idéal pour découvrir le handball en douceur et progresser en équipe.",
  },
  {
    id: "g_handball_intermediaire",
    sport: "Handball",
    level: "Intermédiaire",
    city: "Lyon",
    membersCount: 24,
    description:
      "Matches réguliers avec un bon rythme de jeu pour continuer à monter en niveau.",
  },
  {
    id: "g_handball_expert",
    sport: "Handball",
    level: "Avancé",
    city: "Marseille",
    membersCount: 16,
    description:
      "Groupe compétitif pour joueuses et joueurs expérimentés qui cherchent du challenge.",
  },
  {
    id: "g_football_debutant",
    sport: "Football",
    level: "Débutant",
    city: "Toulouse",
    membersCount: 20,
    description: "Foot loisir pour se remettre en forme dans une bonne ambiance.",
  },
  {
    id: "g_football_intermediaire",
    sport: "Football",
    level: "Intermédiaire",
    city: "Lille",
    membersCount: 22,
    description:
      "Matches hebdomadaires en foot à 5 ou à 7, rythme soutenu mais accessible.",
  },
  {
    id: "g_tennis_loisir",
    sport: "Tennis",
    level: "Intermédiaire",
    city: "Bordeaux",
    membersCount: 14,
    description:
      "Organisation de simples et doubles en soirée, parfait pour progresser en match.",
  },
  {
    id: "g_tennis_avance",
    sport: "Tennis",
    level: "Avancé",
    city: "Paris",
    membersCount: 10,
    description: "Groupe orienté performance avec recherche de partenaires réguliers.",
  },
  {
    id: "g_running_debutant",
    sport: "Course à pied",
    level: "Débutant",
    city: "Nantes",
    membersCount: 30,
    description: "Sorties running tranquilles pour (re)commencer à courir sans pression.",
  },
  {
    id: "g_running_intermediaire",
    sport: "Course à pied",
    level: "Intermédiaire",
    city: "Lyon",
    membersCount: 26,
    description:
      "Séances structurées (fractionné, tempo) pour préparer des distances 10 km / semi.",
  },
  {
    id: "g_padel_loisir",
    sport: "Padel",
    level: "Débutant",
    city: "Nice",
    membersCount: 12,
    description: "Découvre le padel en petits groupes, idéal après le travail.",
  },
  {
    id: "g_basket_loisir",
    sport: "Basketball",
    level: "Intermédiaire",
    city: "Montpellier",
    membersCount: 18,
    description: "Pickup games en 3v3 ou 5v5, bonne intensité mais esprit fair-play.",
  },
];

export function getAllGroups(): Group[] {
  return GROUPS;
}

export function getGroupById(id: string): Group | undefined {
  return GROUPS.find((group) => group.id === id);
}


