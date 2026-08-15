// Capa de contenido: combina el contenido estático de la web con lo que haya
// en Supabase. Las filas de la base de datos mandan sobre el contenido
// estático (mismo slug) y las nuevas se añaden al final.
//
// Así el gestor de la web puede editar/añadir contenido sin romper nada aunque
// la base de datos todavía esté vacía.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  plantasDestacadas,
  calendario as calendarioEstatico,
  type Plant,
  type FilaCalendario,
} from "@/lib/mock-data";
import { noticias as noticiasEstaticas, type Noticia, type NoticiaSection, type CategoriaNoticia } from "@/lib/noticias";
import placeholder from "@/assets/placeholder/under-construction-wide.jpg";

export type PlantaRow = {
  id: string;
  slug: string;
  nombre: string;
  nombre_cientifico: string | null;
  categoria: string;
  imagen_url: string | null;
  descripcion: string;
  curiosidades: string | null;
  como_se_come: string | null;
  temporada: string | null;
  guia_id: string | null;
  calendario_key: string | null;
  es_temporada: boolean;
  orden: number;
  publicado: boolean;
  planta_enfermedades?: { nombre: string; combate: string; imagen_url: string | null; orden: number }[];
};

const imagenEstatica = (slug: string) => plantasDestacadas.find((p) => p.id === slug)?.imagen;

export function rowToPlant(row: PlantaRow): Plant {
  return {
    id: row.slug,
    nombre: row.nombre,
    nombreCientifico: row.nombre_cientifico ?? undefined,
    categoria: (row.categoria as Plant["categoria"]) ?? "hortícola",
    imagen: row.imagen_url || imagenEstatica(row.slug) || placeholder,
    descripcion: row.descripcion ?? "",
    curiosidades: row.curiosidades ?? "",
    comoSeCome: row.como_se_come ?? undefined,
    enfermedades: (row.planta_enfermedades ?? [])
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((e) => ({ nombre: e.nombre, combate: e.combate, imagen: e.imagen_url ?? undefined })),
    temporada: row.temporada ?? "",
    guiaId: row.guia_id ?? undefined,
    calendarioKey: row.calendario_key ?? undefined,
  };
}

export function plantToRow(p: Plant, extra?: { orden?: number; esTemporada?: boolean }) {
  return {
    slug: p.id,
    nombre: p.nombre,
    nombre_cientifico: p.nombreCientifico ?? null,
    categoria: p.categoria,
    // Las imágenes empaquetadas no tienen URL estable: se resuelven por slug.
    imagen_url: p.imagen.startsWith("http") ? p.imagen : null,
    descripcion: p.descripcion,
    curiosidades: p.curiosidades ?? null,
    como_se_come: p.comoSeCome ?? null,
    temporada: p.temporada ?? null,
    guia_id: p.guiaId ?? null,
    calendario_key: p.calendarioKey ?? null,
    es_temporada: extra?.esTemporada ?? false,
    orden: extra?.orden ?? 0,
    publicado: true,
  };
}

function fusionar<T extends { id: string }>(estaticos: T[], deBd: T[]): T[] {
  const mapa = new Map(estaticos.map((x) => [x.id, x]));
  for (const item of deBd) mapa.set(item.id, item);
  const orden = [...estaticos.map((x) => x.id), ...deBd.map((x) => x.id)];
  const vistos = new Set<string>();
  const out: T[] = [];
  for (const id of orden) {
    if (vistos.has(id)) continue;
    vistos.add(id);
    const item = mapa.get(id);
    if (item) out.push(item);
  }
  return out;
}

async function fetchPlantas(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from("plantas")
    .select("*, planta_enfermedades(nombre, combate, imagen_url, orden)")
    .eq("publicado", true)
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data as unknown as PlantaRow[]).map(rowToPlant);
}

export function usePlantas(): Plant[] {
  const { data } = useQuery({
    queryKey: ["cms", "plantas"],
    queryFn: fetchPlantas,
    placeholderData: [] as Plant[],
    staleTime: 60_000,
    retry: false,
  });
  return fusionar(plantasDestacadas, data ?? []);
}

export function useTemporada(): Plant[] {
  const plantas = usePlantas();
  const { data } = useQuery({
    queryKey: ["cms", "temporada"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plantas")
        .select("slug")
        .eq("publicado", true)
        .eq("es_temporada", true)
        .order("orden", { ascending: true });
      if (error) throw error;
      return data.map((r) => r.slug);
    },
    placeholderData: [] as string[],
    staleTime: 60_000,
    retry: false,
  });
  if (!data || data.length === 0) return plantas.slice(0, 6);
  return data.map((slug) => plantas.find((p) => p.id === slug)).filter(Boolean) as Plant[];
}

export function useCalendario(): FilaCalendario[] {
  const { data } = useQuery({
    queryKey: ["cms", "calendario"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planta_calendario")
        .select("planta_nombre, ciclo, meses, orden")
        .order("orden", { ascending: true });
      if (error) throw error;
      return data.map((r) => ({
        planta: r.planta_nombre,
        ciclo: r.ciclo ?? undefined,
        meses: r.meses ?? [],
      })) as FilaCalendario[];
    },
    placeholderData: [] as FilaCalendario[],
    staleTime: 60_000,
    retry: false,
  });
  return data && data.length > 0 ? data : calendarioEstatico;
}

export function rowToNoticia(row: {
  slug: string;
  titulo: string;
  resumen: string;
  categoria: string;
  imagen_url: string | null;
  autor: string;
  fecha: string;
  minutos: number;
  destacada: boolean;
  entradilla: string;
  secciones: unknown;
  tags: string[];
}): Noticia {
  const estatica = noticiasEstaticas.find((n) => n.slug === row.slug);
  return {
    id: row.slug,
    slug: row.slug,
    titulo: row.titulo,
    resumen: row.resumen,
    categoria: row.categoria as CategoriaNoticia,
    imagen: row.imagen_url || estatica?.imagen || placeholder,
    autor: row.autor,
    fecha: row.fecha,
    minutos: row.minutos,
    destacada: row.destacada,
    entradilla: row.entradilla,
    secciones: (Array.isArray(row.secciones) ? row.secciones : []) as NoticiaSection[],
    tags: row.tags ?? [],
  };
}

export function noticiaToRow(n: Noticia) {
  return {
    slug: n.slug,
    titulo: n.titulo,
    resumen: n.resumen,
    categoria: n.categoria,
    imagen_url: n.imagen.startsWith("http") ? n.imagen : null,
    autor: n.autor,
    fecha: n.fecha,
    minutos: n.minutos,
    destacada: n.destacada ?? false,
    entradilla: n.entradilla,
    secciones: n.secciones as unknown as never,
    tags: n.tags,
    publicado: true,
  };
}

export function useNoticias(): Noticia[] {
  const { data } = useQuery({
    queryKey: ["cms", "noticias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("publicado", true)
        .order("fecha", { ascending: false });
      if (error) throw error;
      return data.map(rowToNoticia);
    },
    placeholderData: [] as Noticia[],
    staleTime: 60_000,
    retry: false,
  });
  const todas = fusionar(noticiasEstaticas, data ?? []);
  return todas.slice().sort((a, b) => b.fecha.localeCompare(a.fecha));
}
