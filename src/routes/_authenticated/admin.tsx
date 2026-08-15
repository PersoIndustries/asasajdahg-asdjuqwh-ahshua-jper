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
  const [plagasSel, setPlagasSel] = useState<string[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  const { data: plagas } = useQuery({
    queryKey: ["admin", "plagas", "lista"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plagas").select("id, nombre, imagen_url").order("nombre");
      if (error) throw error;
      return data;
    },
  });

  const { data: vinculos } = useQuery({
    queryKey: ["admin", "planta_plagas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("planta_plagas").select("planta_id, plaga_id, orden");
      if (error) throw error;
      return data;
    },
  });


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
    void queryClient.invalidateQueries({ queryKey: ["admin", "planta_plagas"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async ({ f, seleccion }: { f: PlantaForm; seleccion: string[] }) => {
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
      const { data: guardada, error } = f.id
        ? await supabase.from("plantas").update(fila).eq("id", f.id).select("id").single()
        : await supabase.from("plantas").insert(fila).select("id").single();
      if (error) throw error;

      // Se rehacen los vínculos con el catálogo de plagas.
      const plantaId = guardada.id;
      const { error: errBorrar } = await supabase.from("planta_plagas").delete().eq("planta_id", plantaId);
      if (errBorrar) throw errBorrar;
      if (seleccion.length > 0) {
        const { error: errInsertar } = await supabase
          .from("planta_plagas")
          .insert(seleccion.map((plaga_id, i) => ({ planta_id: plantaId, plaga_id, orden: i })));
        if (errInsertar) throw errInsertar;
      }
    },
    onSuccess: () => { setEdit(null); setPlagasSel([]); refrescar(); },
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

      <Ayuda titulo="Guía de campos del catálogo">
        <li><b>Identificador (slug)</b>: nombre corto en minúsculas y con guiones. Identifica la planta y sustituye a la ficha estática con el mismo identificador.</li>
        <li><b>Clave de calendario</b>: nombre con el que se busca su calendario en la pestaña «Calendario de cultivo». Déjalo vacío para usar el nombre de la planta (ej.: «Tomate cherry» encuentra la fila «Tomate»).</li>
        <li><b>Guía asociada (id)</b>: identificador de una guía de cultivo de «Tu Huerto» (ej. <code>cultivar-calçots</code>). No confundir con el slug del blog.</li>
        <li><b>Producto de temporada</b>: aparece en el bloque de temporada de la portada. <b>Publicada</b>: visible en el catálogo público.</li>
        <li>Las plagas y enfermedades de cada planta se gestionan en su propia pestaña.</li>
      </Ayuda>



      {edit && (
        <form
          onSubmit={(e) => { e.preventDefault(); guardar.mutate({ f: edit, seleccion: plagasSel }); }}
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
          <div className="md:col-span-2">
            <p className="text-sm font-medium mb-1">Plagas y enfermedades asociadas</p>
            <p className="text-xs text-muted-foreground mb-2">
              Marca las plagas del catálogo global que afectan a esta planta. Se crean y editan en la pestaña
              «Plagas y enfermedades». Si no marcas ninguna, la ficha del producto no mostrará esa sección.
            </p>
            {(plagas ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay plagas creadas.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(plagas ?? []).map((pl) => (
                  <label key={pl.id} className="flex items-center gap-2 text-sm rounded-lg border border-border p-2">
                    <input
                      type="checkbox"
                      checked={plagasSel.includes(pl.id)}
                      onChange={(e) =>
                        setPlagasSel(e.target.checked ? [...plagasSel, pl.id] : plagasSel.filter((x) => x !== pl.id))
                      }
                    />
                    <Miniatura src={pl.imagen_url} alt={pl.nombre} />
                    <span className="truncate">{pl.nombre}</span>
                  </label>
                ))}
              </div>
            )}
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
        descripcion="Cada fila es un ciclo de una planta (una misma planta puede tener varias filas: por ejemplo «ciclo de primavera» y «ciclo de otoño»). Puedes editar el nombre, el ciclo, el orden y los meses directamente en la tabla."
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

      <Ayuda titulo="Cómo se rellena el calendario">
        <li><b>Nombre de planta</b>: es la clave de enlace. La ficha del catálogo muestra esta fila si el nombre coincide con el de la planta o con su «clave de calendario» (campo <i>calendario_key</i> en la pestaña Catálogo). Ej.: fila «Tomate» → se muestra en «Tomate cherry», «Tomate rosa», etc.</li>
        <li><b>Ciclo</b>: texto libre que aparece como subtítulo del bloque en la web («Ciclo de primavera», «Siembra temprana»…). Déjalo vacío si la planta solo tiene un ciclo.</li>
        <li><b>Meses</b>: en cada casilla escribe las labores. <b>S</b> = siembra, <b>T</b> = trasplante, <b>C</b> = cosecha. Añade <b>1</b> (primera quincena) o <b>2</b> (segunda quincena) detrás de la letra.</li>
        <li>Ejemplos: <code>T1</code> = trasplante a inicios de mes · <code>C</code> = cosecha todo el mes · <code>S1C2</code> = siembra la primera quincena y cosecha la segunda.</li>
        <li><b>Orden</b>: controla la posición de la fila en la tabla de «Tu Huerto». Números más bajos aparecen antes.</li>
      </Ayuda>

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
          <table className="min-w-[1100px] w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium">Planta y ciclo</th>
                <th className="p-2 font-medium text-xs text-muted-foreground">Orden</th>
                {meses.map((m) => <th key={m} className="p-2 font-medium text-xs text-muted-foreground">{m}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((fila) => (
                <FilaCalendarioEditable
                  key={fila.id}
                  fila={fila}
                  onGuardar={(v) => guardarFila.mutate({ id: fila.id, ...v })}
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

type FilaCalEdit = { planta_nombre: string; ciclo: string | null; orden: number; meses: string[] };

function FilaCalendarioEditable({
  fila, onGuardar, onBorrar,
}: {
  fila: { id: string; planta_nombre: string; ciclo: string | null; orden: number; meses: string[] };
  onGuardar: (valores: FilaCalEdit) => void;
  onBorrar: () => void;
}) {
  const inicial = useMemo<FilaCalEdit>(
    () => ({
      planta_nombre: fila.planta_nombre,
      ciclo: fila.ciclo ?? "",
      orden: fila.orden,
      meses: Array.from({ length: 12 }, (_, i) => fila.meses[i] ?? ""),
    }),
    [fila],
  );
  const [v, setV] = useState<FilaCalEdit>(inicial);
  const sucio = JSON.stringify(v) !== JSON.stringify(inicial);

  return (
    <tr className="border-b border-border/60 last:border-0 align-top">
      <td className="p-2 space-y-1">
        <input
          aria-label="Nombre de la planta"
          className="w-40 rounded-lg border border-border bg-background px-2 py-1 text-sm font-medium"
          value={v.planta_nombre}
          onChange={(e) => setV({ ...v, planta_nombre: e.target.value })}
        />
        <input
          aria-label="Ciclo"
          placeholder="Ciclo (opcional)"
          className="w-40 rounded-lg border border-border bg-background px-2 py-1 text-xs text-muted-foreground"
          value={v.ciclo ?? ""}
          onChange={(e) => setV({ ...v, ciclo: e.target.value })}
        />
      </td>
      <td className="p-1">
        <input
          type="number"
          aria-label="Orden"
          className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-center text-xs"
          value={v.orden}
          onChange={(e) => setV({ ...v, orden: Number(e.target.value) })}
        />
      </td>
      {v.meses.map((celda, i) => (
        <td key={i} className="p-1">
          <input
            aria-label={`${v.planta_nombre} ${meses[i]}`}
            className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-center text-xs uppercase"
            value={celda}
            onChange={(e) => setV({ ...v, meses: v.meses.map((x, j) => (j === i ? e.target.value.toUpperCase() : x)) })}
          />
        </td>
      ))}
      <td className="p-2 whitespace-nowrap">
        <button type="button" disabled={!sucio} onClick={() => onGuardar({ ...v, ciclo: v.ciclo?.trim() ? v.ciclo.trim() : null })}
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

/* ───────────────────────── Plagas y enfermedades ───────────────────────── */

type EnfermedadForm = {
  id?: string;
  planta_id: string;
  nombre: string;
  combate: string;
  imagen_url: string;
  orden: number;
};

const enfermedadVacia: EnfermedadForm = { planta_id: "", nombre: "", combate: "", imagen_url: "", orden: 0 };

function PanelEnfermedades() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<EnfermedadForm | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");

  const { data: plantas } = useQuery({
    queryKey: ["admin", "plantas", "lista"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plantas").select("id, nombre, slug").order("nombre");
      if (error) throw error;
      return data;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "enfermedades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("planta_enfermedades")
        .select("*, plantas(nombre, slug)")
        .order("orden");
      if (error) throw error;
      return data as unknown as (EnfermedadForm & { id: string; plantas: { nombre: string; slug: string } | null })[];
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "enfermedades"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async (f: EnfermedadForm) => {
      const fila = {
        planta_id: f.planta_id,
        nombre: f.nombre,
        combate: f.combate,
        imagen_url: f.imagen_url || null,
        orden: Number(f.orden) || 0,
      };
      const { error } = f.id
        ? await supabase.from("planta_enfermedades").update(fila).eq("id", f.id)
        : await supabase.from("planta_enfermedades").insert(fila);
      if (error) throw error;
    },
    onSuccess: () => { setEdit(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("planta_enfermedades").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const importar = useMutation({
    mutationFn: async () => {
      const porSlug = new Map((plantas ?? []).map((p) => [p.slug, p.id]));
      const filas = plantasDestacadas.flatMap((p) => {
        const plantaId = porSlug.get(p.id);
        if (!plantaId) return [];
        return (p.enfermedades ?? []).map((e, i) => ({
          planta_id: plantaId,
          nombre: e.nombre,
          combate: e.combate,
          imagen_url: e.imagen?.startsWith("http") ? e.imagen : null,
          orden: i,
        }));
      });
      if (filas.length === 0) throw new Error("Importa antes el catálogo de plantas en la pestaña «Catálogo y temporada».");
      const { error } = await supabase.from("planta_enfermedades").insert(filas);
      if (error) throw error;
    },
    onSuccess: () => { setAviso("Plagas y enfermedades del contenido actual importadas."); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const visibles = (data ?? []).filter((e) =>
    filtro ? `${e.nombre} ${e.plantas?.nombre ?? ""}`.toLowerCase().includes(filtro.toLowerCase()) : true,
  );

  return (
    <div className="space-y-6">
      <Barra
        titulo="Plagas y enfermedades"
        descripcion="Cada ficha del catálogo muestra la lista de plagas y enfermedades de esa planta con la forma de combatirlas. Aquí puedes añadir, editar o quitar fichas."
        aviso={aviso}
        acciones={
          <>
            <button type="button" onClick={() => importar.mutate()} disabled={importar.isPending}
              className={`${btn} border border-border hover:text-primary`}>
              {importar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}
              Importar las actuales
            </button>
            <button type="button" onClick={() => setEdit({ ...enfermedadVacia, planta_id: plantas?.[0]?.id ?? "" })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva enfermedad
            </button>
          </>
        }
      />

      <Ayuda titulo="Qué se guarda en cada ficha">
        <li><b>Planta</b>: a qué planta del catálogo pertenece. Solo aparecen las plantas guardadas en la base de datos (pestaña «Catálogo y temporada»).</li>
        <li><b>Nombre</b>: nombre de la plaga o enfermedad (ej. «Mildiu», «Pulgón»).</li>
        <li><b>Cómo combatirla</b>: tratamiento y prevención recomendados; es el texto que lee el cliente en la ficha.</li>
        <li><b>Imagen</b>: URL opcional; si la dejas vacía se usa la imagen por defecto.</li>
        <li><b>Orden</b>: posición dentro de la lista de esa planta.</li>
      </Ayuda>

      {edit && (
        <form onSubmit={(e) => { e.preventDefault(); guardar.mutate(edit); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4">
          <Campo label="Planta">
            <select className={input} required value={edit.planta_id} onChange={(e) => setEdit({ ...edit, planta_id: e.target.value })}>
              <option value="">— Selecciona una planta —</option>
              {(plantas ?? []).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Campo>
          <Campo label="Nombre de la plaga o enfermedad"><input className={input} required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Campo>
          <Campo label="Cómo combatirla" ancho><textarea className={input} rows={3} value={edit.combate} onChange={(e) => setEdit({ ...edit, combate: e.target.value })} /></Campo>
          <Campo label="URL de imagen (opcional)"><input className={input} value={edit.imagen_url} onChange={(e) => setEdit({ ...edit, imagen_url: e.target.value })} /></Campo>
          <Campo label="Orden"><input type="number" className={input} value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: Number(e.target.value) })} /></Campo>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      <input
        className={`${input} max-w-sm`}
        placeholder="Buscar por planta o enfermedad…"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio="Todavía no hay plagas ni enfermedades en la base de datos."
          filas={visibles.map((e) => ({
            key: e.id,
            contenido: (
              <>
                <div className="min-w-0">
                  <p className="font-medium truncate">{e.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {e.plantas?.nombre ?? "Sin planta"} · {e.combate.slice(0, 80)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setEdit({
                    id: e.id, planta_id: e.planta_id, nombre: e.nombre, combate: e.combate,
                    imagen_url: e.imagen_url ?? "", orden: e.orden,
                  })}>Editar</button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Borrar ${e.nombre}`}
                    onClick={() => { if (confirm(`¿Borrar "${e.nombre}"?`)) borrar.mutate(e.id); }}>
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

      <Ayuda titulo="El blog NO son las guías de cultivo">
        <li>Esta pestaña gestiona el <b>blog de noticias y curiosidades</b> (<code>/blog</code>): novedades del vivero, ferias, curiosidades del mundo vegetal. Las <b>guías de cultivo</b> son otra cosa y viven en la página «Tu Huerto» (PDFs y fichas), no se editan aquí.</li>
        <li><b>Identificador (slug)</b>: es únicamente la dirección web del artículo (<code>/blog/mi-slug</code>). <b>No</b> tiene relación con la guía de una planta. Usa minúsculas y guiones, y no lo cambies una vez publicado (rompería los enlaces).</li>
        <li>El campo «Guía asociada» de una planta (pestaña Catálogo) sí enlaza con una guía de «Tu Huerto», pero es un campo distinto de este slug.</li>
        <li><b>Resumen</b>: texto que se ve en el listado. <b>Entradilla</b>: primer párrafo destacado dentro del artículo.</li>
        <li><b>Cuerpo</b>: escribe párrafos normales; una línea que empiece por <code>##</code> se convierte en subtítulo de sección.</li>
        <li><b>Destacada</b> resalta el artículo en la portada del blog; <b>Publicada</b> lo hace visible al público.</li>
      </Ayuda>



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

/** Bloque de documentación desplegable que explica cómo se usa cada panel. */
function Ayuda({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <details className="rounded-2xl border border-border bg-secondary/30 p-5 text-sm" open>
      <summary className="cursor-pointer font-medium">{titulo}</summary>
      <ul className="mt-3 space-y-2 list-disc pl-5 text-muted-foreground leading-relaxed [&_code]:rounded [&_code]:bg-background [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_b]:text-foreground">
        {children}
      </ul>
    </details>
  );
}

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
