export interface Player {
  id: string;
  name: string;
  position?: string;
  image_url?: string;
}

export interface EvaluationForm {
  yellowCards: number;
  redCards: number;
  goals: number;
  goalTypes: string[];
  assists: number;
  minutesPlayed: number;
  saves: number;
  crosses: number;
  rating: number;
  comments: string;
  playedPosition: string;
}

export interface PlayerEvaluation {
  id: string;
  yellow_cards: number;
  red_cards: number;
  goals: number;
  goal_types: Array<{ type: string }>;
  assists: number;
  minutes_played: number;
  saves: number;
  crosses: number;
  rating: number;
  comments: string;
  player_id: string;
  played_position: string | null;
}

export const positions = {
  portero: "Portero",
  defensa_central: "Defensa Central",
  lateral_izquierdo: "Lateral Izquierdo",
  lateral_derecho: "Lateral Derecho",
  mediocampista_ofensivo: "Mediocampista Ofensivo",
  mediocampista_defensivo: "Mediocampista Defensivo",
  mediocampista_mixto: "Mediocampista Mixto",
  delantero_centro: "Delantero Centro",
  extremo_izquierdo: "Extremo Izquierdo",
  extremo_derecho: "Extremo Derecho",
} as const;

export const goalTypeOptions = [
  { value: "header", label: "De cabeza" },
  { value: "penalty", label: "De penal" },
  { value: "outside_box", label: "Fuera del área con pie" },
  { value: "inside_box", label: "Dentro del área con pie" },
];