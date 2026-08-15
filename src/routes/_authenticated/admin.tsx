import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Loader2, Plus, Save, Trash2, Download, Star, StarOff, Eye, EyeOff, LogOut, ShieldAlert,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, cerrarSesion } from "@/hooks/use-auth";
import { plantasDestacadas, calendario as calendarioEstatico, meses } from "@/lib/mock-data";
import { noticias as noticiasEstaticas } from "@/lib/noticias";
import { plantToRow, noticiaToRow } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Gestor de la web · Jardiper" },
      { name: "description", content: "Panel de administración para editar catálogo, calendario de cultivo, productos de temporada y noticias de Jardiper." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Gestor de la web · Jardiper" },
      { property: "og:description", content: "Panel privado de administración de contenidos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Tab = "plantas" | "calendario" | "enfermedades" | "blog";

const input =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const btn =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";

function AdminPage() {
  const { isAdmin, loading, user } = useAuth();
  const [tab, setTab] = useState<Tab>("plantas");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const salir = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await cerrarSesion();
    navigate({ to: "/", replace: true });
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="py-32 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="container-page max-w-lg text-center rounded-3xl border border-border bg-card p-10">
            <ShieldAlert className="h-8 w-8 text-accent mx-auto mb-4" aria-hidden />
            <h1 className="font-serif text-3xl font-medium mb-3">Solo para administradores</h1>
            <p className="text-muted-foreground mb-8">
              Tu cuenta no tiene permisos de gestión. Puedes volver a tu área personal.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/cuenta" className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
                Ir a mi cuenta
              </Link>
              <button type="button" onClick={salir} className={`${btn} border border-border hover:text-primary`}>
                <LogOut className="h-4 w-4" aria-hidden /> Cerrar sesión
              </button>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">Administración</p>
              <h1 className="font-serif text-4xl font-medium">Gestor de la web</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sesión: {user?.email}. Los cambios se publican al guardar.
              </p>
            </div>
            <button type="button" onClick={salir} className={`${btn} border border-border hover:text-primary`}>
              <LogOut className="h-4 w-4" aria-hidden /> Cerrar sesión
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {(
              [
                ["plantas", "Catálogo y temporada"],
                ["calendario", "Calendario de cultivo"],
                ["enfermedades", "Plagas y enfermedades"],
                ["blog", "Noticias del blog"],
              ] as [Tab, string][]
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`${btn} border ${tab === k ? "bg-primary text-primary-foreground border-primary" : "border-border hover:text-primary"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "plantas" && <PanelPlantas />}
          {tab === "calendario" && <PanelCalendario />}
          {tab === "enfermedades" && <PanelEnfermedades />}
          {tab === "blog" && <PanelBlog />}
        </div>
      </section>
    </SiteLayout>
  );
}

/* ───────────────────────── Plantas ───────────────────────── */

type PlantaForm = {
  id?: string;
  slug: string;
  nombre: string;
  nombre_cientifico: string;
  categoria: string;
  imagen_url: string;
  descripcion: string;
  curiosidades: string;
  como_se_come: string;
  temporada: string;
  guia_id: string;
  calendario_key: string;
  es_temporada: boolean;
  orden: number;
  publicado: boolean;
};

const plantaVacia: PlantaForm = {
  slug: "", nombre: "", nombre_cientifico: "", categoria: "hortícola", imagen_url: "",
  descripcion: "", curiosidades: "", como_se_come: "", temporada: "", guia_id: "",
  calendario_key: "", es_temporada: false, orden: 0, publicado: true,
};

function PanelPlantas() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<PlantaForm | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "plantas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plantas").select("*").order("orden");
      if (error) throw error;
      return data;
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "plantas"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async (f: PlantaForm) => {
      const fila = {
        slug: f.slug, nombre: f.nombre,
        nombre_cientifico: f.nombre_cientifico || null,
        categoria: f.categoria,
        imagen_url: f.imagen_url || null,
        descripcion: f.descripcion,
        curiosidades: f.curiosidades || null,
        como_se_come: f.como_se_come || null,
        temporada: f.temporada || null,
        guia_id: f.guia_id || null,
        calendario_key: f.calendario_key || null,
        es_temporada: f.es_temporada,
        orden: Number(f.orden) || 0,
        publicado: f.publicado,
      };
      const { error } = f.id
        ? await supabase.from("plantas").update(fila).eq("id", f.id)
        : await supabase.from("plantas").insert(fila);
      if (error) throw error;
    },
    onSuccess: () => { setEdit(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plantas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const importar = useMutation({
    mutationFn: async () => {
      const filas = plantasDestacadas.map((p, i) =>
        plantToRow(p, { orden: i, esTemporada: i < 6 }),
      );
      const { error } = await supabase.from("plantas").upsert(filas, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => { setAviso("Catálogo actual importado a la base de datos."); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  return (
    <div className="space-y-6">
      <Barra
        titulo="Plantas del catálogo"
        descripcion="Lo que guardes aquí sustituye al contenido por defecto de la web (mismo identificador) y las plantas nuevas se añaden al catálogo."
        aviso={aviso}
        acciones={
          <>
            <button type="button" onClick={() => importar.mutate()} disabled={importar.isPending}
              className={`${btn} border border-border hover:text-primary`}>
              {importar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              Importar catálogo actual
            </button>
            <button type="button" onClick={() => setEdit({ ...plantaVacia })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva planta
            </button>
          </>
        }
      />

      {edit && (
        <form
          onSubmit={(e) => { e.preventDefault(); guardar.mutate(edit); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4"
        >
          <Campo label="Identificador (slug)"><input className={input} required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo label="Nombre"><input className={input} required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Campo>
          <Campo label="Nombre científico"><input className={input} value={edit.nombre_cientifico} onChange={(e) => setEdit({ ...edit, nombre_cientifico: e.target.value })} /></Campo>
          <Campo label="Categoría">
            <select className={input} value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>
              {["hortícola", "ornamental", "árbol", "arbusto", "flor", "aromática"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo label="URL de imagen (opcional)"><input className={input} value={edit.imagen_url} onChange={(e) => setEdit({ ...edit, imagen_url: e.target.value })} /></Campo>
          <Campo label="Temporada (texto)"><input className={input} value={edit.temporada} onChange={(e) => setEdit({ ...edit, temporada: e.target.value })} /></Campo>
          <Campo label="Descripción" ancho><textarea className={input} rows={2} value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} /></Campo>
          <Campo label="Cómo se come" ancho><textarea className={input} rows={2} value={edit.como_se_come} onChange={(e) => setEdit({ ...edit, como_se_come: e.target.value })} /></Campo>
          <Campo label="Curiosidades" ancho><textarea className={input} rows={2} value={edit.curiosidades} onChange={(e) => setEdit({ ...edit, curiosidades: e.target.value })} /></Campo>
          <Campo label="Guía asociada (id)"><input className={input} value={edit.guia_id} onChange={(e) => setEdit({ ...edit, guia_id: e.target.value })} /></Campo>
          <Campo label="Clave de calendario"><input className={input} value={edit.calendario_key} onChange={(e) => setEdit({ ...edit, calendario_key: e.target.value })} /></Campo>
          <Campo label="Orden"><input type="number" className={input} value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: Number(e.target.value) })} /></Campo>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.es_temporada} onChange={(e) => setEdit({ ...edit, es_temporada: e.target.checked })} /> Producto de temporada</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.publicado} onChange={(e) => setEdit({ ...edit, publicado: e.target.checked })} /> Publicada</label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio="Todavía no hay plantas en la base de datos. Usa «Importar catálogo actual» para empezar."
          filas={(data ?? []).map((p) => ({
            key: p.id,
            contenido: (
              <>
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">{p.slug} · {p.categoria}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconoEstado activo={p.es_temporada} on={Star} off={StarOff} titulo="Producto de temporada" />
                  <IconoEstado activo={p.publicado} on={Eye} off={EyeOff} titulo="Publicada" />
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setEdit({
                    id: p.id, slug: p.slug, nombre: p.nombre,
                    nombre_cientifico: p.nombre_cientifico ?? "", categoria: p.categoria,
                    imagen_url: p.imagen_url ?? "", descripcion: p.descripcion,
                    curiosidades: p.curiosidades ?? "", como_se_come: p.como_se_come ?? "",
                    temporada: p.temporada ?? "", guia_id: p.guia_id ?? "",
                    calendario_key: p.calendario_key ?? "", es_temporada: p.es_temporada,
                    orden: p.orden, publicado: p.publicado,
                  })}>Editar</button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Borrar ${p.nombre}`}
                    onClick={() => { if (confirm(`¿Borrar ${p.nombre}?`)) borrar.mutate(p.id); }}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </>
            ),
          }))}
        />
      )}
    </div>
  );
}

/* ───────────────────────── Calendario ───────────────────────── */

function PanelCalendario() {
  const queryClient = useQueryClient();
  const [aviso, setAviso] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<{ planta: string; ciclo: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "calendario"],
    queryFn: async () => {
      const { data, error } = await supabase.from("planta_calendario").select("*").order("orden");
      if (error) throw error;
      return data;
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "calendario"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardarFila = useMutation({
    mutationFn: async (f: { id: string; planta_nombre: string; ciclo: string | null; orden: number; meses: string[] }) => {
      const { error } = await supabase
        .from("planta_calendario")
        .update({ planta_nombre: f.planta_nombre, ciclo: f.ciclo, orden: f.orden, meses: f.meses })
        .eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const crear = useMutation({
    mutationFn: async (f: { planta: string; ciclo: string }) => {
      const { error } = await supabase.from("planta_calendario").insert({
        planta_nombre: f.planta,
        ciclo: f.ciclo || null,
        meses: Array.from({ length: 12 }, () => ""),
        orden: (data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { setNuevo(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("planta_calendario").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const importar = useMutation({
    mutationFn: async () => {
      const filas = calendarioEstatico.map((f, i) => ({
        planta_nombre: f.planta,
        ciclo: f.ciclo ?? null,
        meses: f.meses.map((m) => m ?? ""),
        orden: i,
      }));
      const { error } = await supabase.from("planta_calendario").insert(filas);
      if (error) throw error;
    },
    onSuccess: () => { setAviso("Calendario actual importado."); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  return (
    <div className="space-y-6">
      <Barra
        titulo="Calendario de cultivo"
        descripcion="Cada fila es un ciclo. Escribe en cada mes las labores: S = siembra, T = trasplante, C = cosecha, y 1 o 2 para la quincena (ej. «T1», «S1C2»)."
        aviso={aviso}
        acciones={
          <>
            <button type="button" onClick={() => importar.mutate()} disabled={importar.isPending}
              className={`${btn} border border-border hover:text-primary`}>
              {importar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              Importar calendario actual
            </button>
            <button type="button" onClick={() => setNuevo({ planta: "", ciclo: "" })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva fila
            </button>
          </>
        }
      />

      {nuevo && (
        <form onSubmit={(e) => { e.preventDefault(); crear.mutate(nuevo); }}
          className="rounded-2xl border border-border bg-card p-6 flex flex-wrap gap-4 items-end">
          <Campo label="Planta"><input className={input} required value={nuevo.planta} onChange={(e) => setNuevo({ ...nuevo, planta: e.target.value })} /></Campo>
          <Campo label="Ciclo (opcional)"><input className={input} value={nuevo.ciclo} onChange={(e) => setNuevo({ ...nuevo, ciclo: e.target.value })} /></Campo>
          <button type="submit" className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}><Save className="h-4 w-4" aria-hidden /> Crear</button>
          <button type="button" onClick={() => setNuevo(null)} className={`${btn} border border-border`}>Cancelar</button>
        </form>
      )}

      {isLoading ? <Cargando /> : (data ?? []).length === 0 ? (
        <Vacio texto="Todavía no hay filas de calendario. Importa el calendario actual para poder editarlo." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Planta</th>
                {meses.map((m) => <th key={m} className="p-2 font-medium text-xs text-muted-foreground">{m}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((fila) => (
                <FilaCalendarioEditable
                  key={fila.id}
                  fila={fila}
                  onGuardar={(m) => guardarCelda.mutate({ id: fila.id, meses: m })}
                  onBorrar={() => { if (confirm(`¿Borrar la fila de ${fila.planta_nombre}?`)) borrar.mutate(fila.id); }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FilaCalendarioEditable({
  fila, onGuardar, onBorrar,
}: {
  fila: { id: string; planta_nombre: string; ciclo: string | null; meses: string[] };
  onGuardar: (meses: string[]) => void;
  onBorrar: () => void;
}) {
  const inicial = useMemo(
    () => Array.from({ length: 12 }, (_, i) => fila.meses[i] ?? ""),
    [fila.meses],
  );
  const [valores, setValores] = useState<string[]>(inicial);
  const sucio = valores.join("|") !== inicial.join("|");

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="p-3">
        <p className="font-medium">{fila.planta_nombre}</p>
        {fila.ciclo && <p className="text-xs text-muted-foreground">{fila.ciclo}</p>}
      </td>
      {valores.map((v, i) => (
        <td key={i} className="p-1">
          <input
            aria-label={`${fila.planta_nombre} ${meses[i]}`}
            className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-center text-xs uppercase"
            value={v}
            onChange={(e) => setValores(valores.map((x, j) => (j === i ? e.target.value.toUpperCase() : x)))}
          />
        </td>
      ))}
      <td className="p-2 whitespace-nowrap">
        <button type="button" disabled={!sucio} onClick={() => onGuardar(valores)}
          className="p-2 text-primary disabled:opacity-30" aria-label="Guardar fila">
          <Save className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={onBorrar} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Borrar fila">
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </td>
    </tr>
  );
}

/* ───────────────────────── Blog ───────────────────────── */

type NoticiaForm = {
  id?: string;
  slug: string; titulo: string; resumen: string; categoria: string; imagen_url: string;
  autor: string; fecha: string; minutos: number; destacada: boolean; entradilla: string;
  cuerpo: string; tags: string; publicado: boolean;
};

const noticiaVacia: NoticiaForm = {
  slug: "", titulo: "", resumen: "", categoria: "Novedades", imagen_url: "",
  autor: "Equipo Jardiper", fecha: new Date().toISOString().slice(0, 10), minutos: 3,
  destacada: false, entradilla: "", cuerpo: "", tags: "", publicado: true,
};

/** El cuerpo se edita como texto: una línea «## Título» abre sección; el resto son párrafos. */
function cuerpoASecciones(cuerpo: string) {
  const secciones: { titulo?: string; parrafos: string[] }[] = [];
  let actual: { titulo?: string; parrafos: string[] } | null = null;
  for (const linea of cuerpo.split("\n")) {
    const t = linea.trim();
    if (!t) continue;
    if (t.startsWith("##")) {
      actual = { titulo: t.replace(/^#+/, "").trim(), parrafos: [] };
      secciones.push(actual);
    } else {
      if (!actual) { actual = { parrafos: [] }; secciones.push(actual); }
      actual.parrafos.push(t);
    }
  }
  return secciones;
}

function seccionesACuerpo(secciones: unknown) {
  if (!Array.isArray(secciones)) return "";
  return (secciones as { titulo?: string; parrafos?: string[] }[])
    .map((s) => [s.titulo ? `## ${s.titulo}` : null, ...(s.parrafos ?? [])].filter(Boolean).join("\n\n"))
    .join("\n\n");
}

function PanelBlog() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<NoticiaForm | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "noticias"],
    queryFn: async () => {
      const { data, error } = await supabase.from("noticias").select("*").order("fecha", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "noticias"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async (f: NoticiaForm) => {
      const fila = {
        slug: f.slug, titulo: f.titulo, resumen: f.resumen, categoria: f.categoria,
        imagen_url: f.imagen_url || null, autor: f.autor, fecha: f.fecha,
        minutos: Number(f.minutos) || 3, destacada: f.destacada, entradilla: f.entradilla,
        secciones: cuerpoASecciones(f.cuerpo) as unknown as never,
        tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean),
        publicado: f.publicado,
      };
      const { error } = f.id
        ? await supabase.from("noticias").update(fila).eq("id", f.id)
        : await supabase.from("noticias").insert(fila);
      if (error) throw error;
    },
    onSuccess: () => { setEdit(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const importar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("noticias")
        .upsert(noticiasEstaticas.map(noticiaToRow), { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => { setAviso("Noticias actuales importadas."); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  return (
    <div className="space-y-6">
      <Barra
        titulo="Noticias y curiosidades"
        descripcion="Publica novedades del vivero. En el cuerpo, una línea que empiece por ## crea un subtítulo; el resto son párrafos."
        aviso={aviso}
        acciones={
          <>
            <button type="button" onClick={() => importar.mutate()} disabled={importar.isPending}
              className={`${btn} border border-border hover:text-primary`}>
              {importar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              Importar noticias actuales
            </button>
            <button type="button" onClick={() => setEdit({ ...noticiaVacia })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva noticia
            </button>
          </>
        }
      />

      {edit && (
        <form onSubmit={(e) => { e.preventDefault(); guardar.mutate(edit); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4">
          <Campo label="Identificador (slug)"><input className={input} required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo label="Título"><input className={input} required value={edit.titulo} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} /></Campo>
          <Campo label="Categoría">
            <select className={input} value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>
              {["Novedades", "Ferias y eventos", "Temporada", "Curiosidades"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo label="Fecha"><input type="date" className={input} value={edit.fecha} onChange={(e) => setEdit({ ...edit, fecha: e.target.value })} /></Campo>
          <Campo label="Autor"><input className={input} value={edit.autor} onChange={(e) => setEdit({ ...edit, autor: e.target.value })} /></Campo>
          <Campo label="Minutos de lectura"><input type="number" className={input} value={edit.minutos} onChange={(e) => setEdit({ ...edit, minutos: Number(e.target.value) })} /></Campo>
          <Campo label="URL de imagen (opcional)" ancho><input className={input} value={edit.imagen_url} onChange={(e) => setEdit({ ...edit, imagen_url: e.target.value })} /></Campo>
          <Campo label="Resumen" ancho><textarea className={input} rows={2} value={edit.resumen} onChange={(e) => setEdit({ ...edit, resumen: e.target.value })} /></Campo>
          <Campo label="Entradilla" ancho><textarea className={input} rows={2} value={edit.entradilla} onChange={(e) => setEdit({ ...edit, entradilla: e.target.value })} /></Campo>
          <Campo label="Cuerpo" ancho><textarea className={input} rows={10} value={edit.cuerpo} onChange={(e) => setEdit({ ...edit, cuerpo: e.target.value })} /></Campo>
          <Campo label="Etiquetas (separadas por comas)" ancho><input className={input} value={edit.tags} onChange={(e) => setEdit({ ...edit, tags: e.target.value })} /></Campo>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.destacada} onChange={(e) => setEdit({ ...edit, destacada: e.target.checked })} /> Destacada</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.publicado} onChange={(e) => setEdit({ ...edit, publicado: e.target.checked })} /> Publicada</label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio="Todavía no hay noticias en la base de datos."
          filas={(data ?? []).map((n) => ({
            key: n.id,
            contenido: (
              <>
                <div className="min-w-0">
                  <p className="font-medium truncate">{n.titulo}</p>
                  <p className="text-xs text-muted-foreground">{n.fecha} · {n.categoria}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconoEstado activo={n.destacada} on={Star} off={StarOff} titulo="Destacada" />
                  <IconoEstado activo={n.publicado} on={Eye} off={EyeOff} titulo="Publicada" />
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setEdit({
                    id: n.id, slug: n.slug, titulo: n.titulo, resumen: n.resumen,
                    categoria: n.categoria, imagen_url: n.imagen_url ?? "", autor: n.autor,
                    fecha: n.fecha, minutos: n.minutos, destacada: n.destacada,
                    entradilla: n.entradilla, cuerpo: seccionesACuerpo(n.secciones),
                    tags: (n.tags ?? []).join(", "), publicado: n.publicado,
                  })}>Editar</button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Borrar ${n.titulo}`}
                    onClick={() => { if (confirm(`¿Borrar "${n.titulo}"?`)) borrar.mutate(n.id); }}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </>
            ),
          }))}
        />
      )}
    </div>
  );
}

/* ───────────────────────── UI compartida ───────────────────────── */

function Barra({ titulo, descripcion, acciones, aviso }: {
  titulo: string; descripcion: string; acciones: React.ReactNode; aviso: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl font-medium">{titulo}</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{descripcion}</p>
        </div>
        <div className="flex flex-wrap gap-2">{acciones}</div>
      </div>
      {aviso && <p className="mt-4 text-sm text-accent">{aviso}</p>}
    </div>
  );
}

function Campo({ label, children, ancho }: { label: string; children: React.ReactNode; ancho?: boolean }) {
  return (
    <label className={`block text-sm ${ancho ? "md:col-span-2" : ""}`}>
      <span className="block mb-1.5 text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Cargando() {
  return <div className="py-16 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden /></div>;
}

function Vacio({ texto }: { texto: string }) {
  return <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{texto}</p>;
}

function Tabla({ filas, vacio }: { filas: { key: string; contenido: React.ReactNode }[]; vacio: string }) {
  if (filas.length === 0) return <Vacio texto={vacio} />;
  return (
    <ul className="rounded-2xl border border-border bg-card divide-y divide-border">
      {filas.map((f) => (
        <li key={f.key} className="flex items-center justify-between gap-4 p-4 text-sm">{f.contenido}</li>
      ))}
    </ul>
  );
}

function IconoEstado({ activo, on: On, off: Off, titulo }: {
  activo: boolean; on: typeof Star; off: typeof StarOff; titulo: string;
}) {
  const Icono = activo ? On : Off;
  return (
    <span title={`${titulo}: ${activo ? "sí" : "no"}`} className={activo ? "text-accent p-2" : "text-muted-foreground/50 p-2"}>
      <Icono className="h-4 w-4" aria-hidden />
      <span className="sr-only">{`${titulo}: ${activo ? "sí" : "no"}`}</span>
    </span>
  );
}
