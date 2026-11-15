import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type BloqueHorario = { dias: string; horas: string[] };
export type Horario = { titulo: string; bloques: BloqueHorario[]; nota: string };

export const HORARIO_POR_DEFECTO: Horario = {
  titulo: "Horario de invierno · Actual",
  bloques: [
    { dias: "Lunes a viernes", horas: ["8:00 – 13:00", "15:00 – 18:00"] },
    { dias: "Sábados", horas: ["9:00 – 13:00"] },
  ],
  nota: "Domingos y festivos cerrado",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tabla = () => (supabase as any).from("horario_tienda");

export function normalizarHorario(row: unknown): Horario {
  const r = (row ?? {}) as Partial<Horario>;
  const bloques = Array.isArray(r.bloques)
    ? r.bloques.map((b) => ({ dias: String(b?.dias ?? ""), horas: Array.isArray(b?.horas) ? b.horas.map(String) : [] }))
    : HORARIO_POR_DEFECTO.bloques;
  return { titulo: r.titulo ?? HORARIO_POR_DEFECTO.titulo, bloques, nota: r.nota ?? HORARIO_POR_DEFECTO.nota };
}

export async function cargarHorario(): Promise<Horario> {
  const { data, error } = await tabla().select("titulo,bloques,nota").eq("id", "actual").maybeSingle();
  if (error || !data) return HORARIO_POR_DEFECTO;
  return normalizarHorario(data);
}

export async function guardarHorario(h: Horario) {
  const { error } = await tabla().upsert({ id: "actual", ...h });
  if (error) throw error;
}

export const useHorario = () =>
  useQuery({ queryKey: ["cms", "horario"], queryFn: cargarHorario, placeholderData: HORARIO_POR_DEFECTO });
