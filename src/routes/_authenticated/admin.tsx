import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  Loader2, Plus, Save, Trash2, RefreshCw, Star, StarOff, Eye, EyeOff, LogOut, ShieldAlert, X, Search, Copy,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, cerrarSesion } from "@/hooks/use-auth";
import { plantasDestacadas, meses, guias } from "@/lib/mock-data";
import { IMAGEN_PLAGA_POR_DEFECTO, imagenDePlaga, type PlagaRow } from "@/lib/cms";
import { SeccionPlagas } from "@/components/site/SeccionPlagas";
import type { PlagaFicha } from "@/lib/mock-data";

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

type Tab = "plantas" | "calendario" | "enfermedades" | "materiales" | "blog";

const input =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const btn =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";

/** Miniatura con respaldo: si no hay imagen (o falla) se muestra el placeholder. */
function Miniatura({ src, alt, slug }: { src?: string | null; alt: string; slug?: string }) {
  const estatica = slug ? plantasDestacadas.find((p) => p.id === slug)?.imagen : undefined;
  const [url, setUrl] = useState(src || estatica || IMAGEN_PLAGA_POR_DEFECTO);
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setUrl(IMAGEN_PLAGA_POR_DEFECTO)}
      className="h-10 w-10 rounded-lg object-cover border border-border shrink-0"
    />
  );
}


/** Convierte un campo de texto con ids separados por comas en lista. */
function listaIds(valor: string): string[] {
  return valor.split(",").map((v) => v.trim()).filter(Boolean);
}

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
                ["materiales", "Tierras y material"],
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
          {tab === "enfermedades" && <PanelPlagas />}
          {tab === "materiales" && <PanelMateriales />}
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

/** Vista previa de la sección de plagas tal y como se verá en la ficha pública. */
function PreviaPlagas({
  nombre,
  slug,
  plagaIds,
  onClose,
}: {
  nombre: string;
  slug: string;
  plagaIds: string[];
  onClose: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "previa-plagas", plagaIds],
    queryFn: async () => {
      if (plagaIds.length === 0) return [] as PlagaRow[];
      const { data, error } = await supabase
        .from("plagas")
        .select("id, slug, nombre, descripcion, prevencion, combate, otros_datos, imagen_url, plaga_imagenes(imagen_url, tag, orden)")
        .in("id", plagaIds);
      if (error) throw error;
      return data as unknown as PlagaRow[];
    },
  });

  const claves = [slug, nombre].filter(Boolean);
  const orden = new Map(plagaIds.map((id, i) => [id, i]));
  const fichas: PlagaFicha[] = (data ?? [])
    .slice()
    .sort((a, b) => (orden.get(a.id) ?? 0) - (orden.get(b.id) ?? 0))
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.descripcion?.trim() || undefined,
      prevencion: p.prevencion?.trim() || undefined,
      combate: p.combate?.trim() || undefined,
      otrosDatos: p.otros_datos?.trim() || undefined,
      imagen: imagenDePlaga(p, claves),
    }));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Vista previa de la ficha</p>
            <h3 className="font-serif text-2xl mt-1">{nombre || "Planta sin nombre"}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Así se verá el bloque de plagas y enfermedades en el catálogo público. Las imágenes se eligen por etiqueta ({claves.join(", ") || "sin claves"}).
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-muted" aria-label="Cerrar vista previa">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          {isLoading ? (
            <Cargando />
          ) : fichas.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Esta planta no tiene plagas asociadas: la sección no aparecerá en su ficha del catálogo.
            </p>
          ) : (
            <SeccionPlagas plagas={fichas} />
          )}
        </div>
      </div>
    </div>
  );
}

function PanelPlantas() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<PlantaForm | null>(null);
  const [plagasSel, setPlagasSel] = useState<string[]>([]);
  const [previa, setPrevia] = useState<{ nombre: string; slug: string; ids: string[] } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaF, setCategoriaF] = useState("todas");
  const [temporadaF, setTemporadaF] = useState("todas");
  const [publicadoF, setPublicadoF] = useState("todas");

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

  const [refrescando, setRefrescando] = useState(false);
  const recargar = async () => {
    setRefrescando(true);
    await queryClient.refetchQueries({ queryKey: ["admin", "plantas"] });
    await queryClient.refetchQueries({ queryKey: ["admin", "planta_plagas"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
    setRefrescando(false);
    setAviso("Datos recargados desde la base de datos.");
  };


  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (data ?? []).filter((p) => {
      const texto = `${p.nombre} ${p.slug} ${p.nombre_cientifico ?? ""} ${p.categoria}`.toLowerCase();
      if (q && !texto.includes(q)) return false;
      if (categoriaF !== "todas" && p.categoria !== categoriaF) return false;
      if (temporadaF === "si" && !p.es_temporada) return false;
      if (temporadaF === "no" && p.es_temporada) return false;
      if (publicadoF === "si" && !p.publicado) return false;
      if (publicadoF === "no" && p.publicado) return false;
      return true;
    });
  }, [data, busqueda, categoriaF, temporadaF, publicadoF]);

  return (
    <div className="space-y-6">
      <Barra
        titulo="Plantas del catálogo"
        descripcion="La base de datos manda: la web muestra exactamente estas plantas. Si borras una aquí, desaparece del catálogo público."
        aviso={aviso}
        info={
          <>
            <b>Producto de temporada</b>: aparece en el bloque de temporada de la portada.
            <b> Publicada</b>: visible en el catálogo público. Las plagas y enfermedades se crean en su propia
            pestaña y aquí solo se asocian a cada planta.
          </>
        }
        acciones={
          <>
            <button
              type="button"
              title="Vuelve a leer las plantas de la base de datos. No añade ni restaura nada."
              onClick={() => void recargar()}
              disabled={refrescando}
              className={`${btn} border border-border hover:text-primary`}>
              {refrescando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
              Refrescar datos
            </button>

            <button type="button" onClick={() => { setPlagasSel([]); setEdit({ ...plantaVacia }); }}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva planta
            </button>
          </>
        }
      />


      <div className="rounded-2xl border border-border bg-card p-4 flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-muted-foreground mb-1" htmlFor="buscar-plantas">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
            <input id="buscar-plantas" type="search" className={`${input} pl-9`} placeholder="Nombre, slug o nombre científico…"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          </div>
        </div>
        <div className="w-full lg:w-48">
          <label className="block text-xs text-muted-foreground mb-1" htmlFor="filtro-categoria">Categoría</label>
          <select id="filtro-categoria" className={input} value={categoriaF} onChange={(e) => setCategoriaF(e.target.value)}>
            <option value="todas">Todas</option>
            {["hortícola", "ornamental", "árbol", "arbusto", "flor", "aromática", "frutal"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="w-full lg:w-44">
          <label className="block text-xs text-muted-foreground mb-1" htmlFor="filtro-temporada">Temporada</label>
          <select id="filtro-temporada" className={input} value={temporadaF} onChange={(e) => setTemporadaF(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="si">Solo de temporada</option>
            <option value="no">Fuera de temporada</option>
          </select>
        </div>
        <div className="w-full lg:w-40">
          <label className="block text-xs text-muted-foreground mb-1" htmlFor="filtro-publicado">Estado</label>
          <select id="filtro-publicado" className={input} value={publicadoF} onChange={(e) => setPublicadoF(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="si">Publicadas</option>
            <option value="no">Ocultas</option>
          </select>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{filtradas.length} de {(data ?? []).length}</span>
          <button type="button" className={`${btn} border border-border hover:text-primary`}
            onClick={() => { setBusqueda(""); setCategoriaF("todas"); setTemporadaF("todas"); setPublicadoF("todas"); }}>
            Limpiar
          </button>
        </div>
      </div>

      {edit && (
        <form
          onSubmit={(e) => { e.preventDefault(); guardar.mutate({ f: edit, seleccion: plagasSel }); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4"
        >
          <Campo
            label="Identificador (slug)"
            info={<>Nombre corto en minúsculas y con guiones. Identifica la planta dentro de la web (ej. <code>calcots</code>).</>}
          ><input className={input} required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo label="Nombre"><input className={input} required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Campo>
          <Campo label="Nombre científico"><input className={input} value={edit.nombre_cientifico} onChange={(e) => setEdit({ ...edit, nombre_cientifico: e.target.value })} /></Campo>
          <Campo label="Categoría">
            <select className={input} value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>
              {["hortícola", "ornamental", "árbol", "arbusto", "flor", "aromática", "frutal"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
          <CampoImagen
            label="Imagen de la planta"
            slug={edit.slug}
            valor={edit.imagen_url}
            onChange={(v) => setEdit({ ...edit, imagen_url: v })}
            info={<>Pega la dirección (URL) de la foto de la planta. Si la dejas vacía se muestra el placeholder «web en construcción» en la ficha del catálogo.</>}
          />
          <Campo label="Temporada (texto)"><input className={input} value={edit.temporada} onChange={(e) => setEdit({ ...edit, temporada: e.target.value })} /></Campo>
          <Campo label="Descripción" ancho><textarea className={input} rows={2} value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} /></Campo>
          <Campo label="Cómo se come" ancho><textarea className={input} rows={2} value={edit.como_se_come} onChange={(e) => setEdit({ ...edit, como_se_come: e.target.value })} /></Campo>
          <Campo label="Curiosidades" ancho><textarea className={input} rows={2} value={edit.curiosidades} onChange={(e) => setEdit({ ...edit, curiosidades: e.target.value })} /></Campo>
          <Campo
            label="Clave de calendario"
            info={<>Nombre con el que se busca su calendario en la pestaña «Calendario de cultivo». Vacío = se usa el nombre de la planta.</>}
          ><input className={input} value={edit.calendario_key} onChange={(e) => setEdit({ ...edit, calendario_key: e.target.value })} /></Campo>
          <Campo label="Orden" info={<>Número menor = aparece antes en el catálogo.</>}><input type="number" className={input} value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: Number(e.target.value) })} /></Campo>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.es_temporada} onChange={(e) => setEdit({ ...edit, es_temporada: e.target.checked })} /> Producto de temporada</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.publicado} onChange={(e) => setEdit({ ...edit, publicado: e.target.checked })} /> Publicada</label>
          </div>

          <SelectorMultiple
            titulo="Guías de cultivo asociadas"
            placeholder="Buscar guía por título o etiqueta…"
            vacio="Sin guías asociadas: la ficha no mostrará el bloque de guías."
            info={<>Guías de cultivo de «Tu Huerto» que se enlazan desde la ficha de esta planta. Puedes elegir varias. No tiene relación con el slug del blog.</>}
            opciones={guias.map((g) => ({ id: g.id, nombre: g.titulo, imagen: g.imagen, extra: g.tags.join(" · ") }))}
            valor={listaIds(edit.guia_id)}
            onChange={(v) => setEdit({ ...edit, guia_id: v.join(",") })}
          />

          <SelectorMultiple
            titulo="Plagas y enfermedades asociadas"
            placeholder="Buscar plaga o enfermedad…"
            vacio="Sin plagas asociadas: la ficha del producto no mostrará esa sección."
            info={<>Plagas del catálogo global que afectan a esta planta. Se crean y editan en la pestaña «Plagas y enfermedades».</>}
            opciones={(plagas ?? []).map((pl) => ({ id: pl.id, nombre: pl.nombre, imagen: pl.imagen_url }))}
            valor={plagasSel}
            onChange={setPlagasSel}
          />

          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setPrevia({ nombre: edit.nombre, slug: edit.slug, ids: plagasSel })}
              className={`${btn} border border-border hover:text-primary`}>
              <Eye className="h-4 w-4" aria-hidden /> Vista previa de plagas
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio={(data ?? []).length === 0
            ? "Todavía no hay plantas en la base de datos. Usa «Importar catálogo actual» para empezar."
            : "Ninguna planta coincide con la búsqueda o los filtros."}
          filas={filtradas.map((p) => ({
            key: p.id,
            contenido: (
              <>
                <Miniatura src={p.imagen_url} slug={p.slug} alt={p.nombre} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{p.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.slug} · {p.categoria} · {(vinculos ?? []).filter((v) => v.planta_id === p.id).length} plagas
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconoEstado activo={p.es_temporada} on={Star} off={StarOff} titulo="Producto de temporada" />
                  <IconoEstado activo={p.publicado} on={Eye} off={EyeOff} titulo="Publicada" />
                  <button type="button" className="p-2 hover:text-primary" title="Vista previa de plagas"
                    aria-label={`Vista previa de plagas de ${p.nombre}`}
                    onClick={() => setPrevia({
                      nombre: p.nombre,
                      slug: p.slug,
                      ids: (vinculos ?? []).filter((v) => v.planta_id === p.id).sort((a, b) => a.orden - b.orden).map((v) => v.plaga_id),
                    })}>
                    <Eye className="h-4 w-4" aria-hidden />
                  </button>
                  <button type="button" className="p-2 hover:text-primary" onClick={() => {
                    setPlagasSel(
                      (vinculos ?? [])
                        .filter((v) => v.planta_id === p.id)
                        .sort((a, b) => a.orden - b.orden)
                        .map((v) => v.plaga_id),
                    );
                    setEdit({
                      id: p.id, slug: p.slug, nombre: p.nombre,
                      nombre_cientifico: p.nombre_cientifico ?? "", categoria: p.categoria,
                      imagen_url: p.imagen_url ?? "", descripcion: p.descripcion,
                      curiosidades: p.curiosidades ?? "", como_se_come: p.como_se_come ?? "",
                      temporada: p.temporada ?? "", guia_id: p.guia_id ?? "",
                      calendario_key: p.calendario_key ?? "", es_temporada: p.es_temporada,
                      orden: p.orden, publicado: p.publicado,
                    });
                  }}>Editar</button>
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

      {previa && (
        <PreviaPlagas nombre={previa.nombre} slug={previa.slug} plagaIds={previa.ids} onClose={() => setPrevia(null)} />
      )}
    </div>
  );
}

/* ───────────────────────── Calendario ───────────────────────── */

function PanelCalendario() {
  const queryClient = useQueryClient();
  const [aviso, setAviso] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState<{ planta: string; ciclo: string } | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cicloF, setCicloF] = useState<"todos" | "con" | "sin">("todos");
  const [laboresF, setLaboresF] = useState<"todas" | "S" | "T" | "C" | "vacias">("todas");


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

  const duplicar = useMutation({
    mutationFn: async (f: { planta_nombre: string; ciclo: string | null; orden: number; meses: string[] }) => {
      const { error } = await supabase.from("planta_calendario").insert({
        planta_nombre: f.planta_nombre,
        ciclo: f.ciclo ? `${f.ciclo} (copia)` : "Ciclo nuevo",
        meses: f.meses,
        orden: f.orden,
      });
      if (error) throw error;
    },
    onSuccess: () => { setAviso("Fila duplicada."); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });


  const filas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return (data ?? []).filter((f) => {
      const texto = `${f.planta_nombre} ${f.ciclo ?? ""}`.toLowerCase();
      if (q && !texto.includes(q)) return false;
      if (cicloF === "con" && !f.ciclo) return false;
      if (cicloF === "sin" && f.ciclo) return false;
      const celdas = (f.meses ?? []).join("").toUpperCase();
      if (laboresF === "vacias" && celdas.trim()) return false;
      if (["S", "T", "C"].includes(laboresF) && !celdas.includes(laboresF)) return false;
      return true;
    });
  }, [data, busqueda, cicloF, laboresF]);


  const [refrescando, setRefrescando] = useState(false);
  const recargar = async () => {
    setRefrescando(true);
    await queryClient.refetchQueries({ queryKey: ["admin", "calendario"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
    setRefrescando(false);
    setAviso("Datos recargados desde la base de datos.");
  };


  return (
    <div className="space-y-6">
      <Barra
        titulo="Calendario de cultivo"
        descripcion="Cada fila es un ciclo de una planta (una misma planta puede tener varias filas: por ejemplo «ciclo de primavera» y «ciclo de otoño»). Puedes editar el nombre, el ciclo, el orden y los meses directamente en la tabla."
        aviso={aviso}
        info={
          <>
            En cada casilla de mes escribe las labores: <b>S</b> siembra, <b>T</b> trasplante, <b>C</b> cosecha.
            Añade <b>1</b> (primera quincena) o <b>2</b> (segunda) detrás de la letra: <code>T1</code>,
            <code>C</code>, <code>S1C2</code>. El <b>orden</b> controla la posición de la fila en «Tu Huerto».
          </>
        }
        acciones={
          <>
            <button
              type="button"
              title="Vuelve a leer el calendario de la base de datos. No añade ni restaura nada."
              onClick={() => void recargar()}
              disabled={refrescando}
              className={`${btn} border border-border hover:text-primary`}>
              {refrescando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
              Refrescar datos
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
          <Campo
            label="Planta"
            info={<>Es la clave de enlace: la ficha del catálogo muestra esta fila si el nombre coincide con el de la planta o con su «clave de calendario».</>}
          ><input className={input} required value={nuevo.planta} onChange={(e) => setNuevo({ ...nuevo, planta: e.target.value })} /></Campo>
          <Campo
            label="Ciclo (opcional)"
            info={<>Texto libre que aparece como subtítulo en la web («Ciclo de primavera», «Siembra temprana»…). Vacío si la planta solo tiene un ciclo.</>}
          ><input className={input} value={nuevo.ciclo} onChange={(e) => setNuevo({ ...nuevo, ciclo: e.target.value })} /></Campo>
          <button type="submit" className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}><Save className="h-4 w-4" aria-hidden /> Crear</button>
          <button type="button" onClick={() => setNuevo(null)} className={`${btn} border border-border`}>Cancelar</button>
        </form>
      )}

      {isLoading ? <Cargando /> : (data ?? []).length === 0 ? (
        <Vacio texto="Todavía no hay filas de calendario. Crea filas nuevas con «Nueva fila»." />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap items-end gap-3">
            <Campo label="Buscar planta o ciclo">
              <input className={input} value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Tomate, primavera…" />
            </Campo>
            <Campo label="Ciclo">
              <select className={input} value={cicloF} onChange={(e) => setCicloF(e.target.value as typeof cicloF)}>
                <option value="todos">Todos</option>
                <option value="con">Con ciclo</option>
                <option value="sin">Sin ciclo</option>
              </select>
            </Campo>
            <Campo label="Labores">
              <select className={input} value={laboresF} onChange={(e) => setLaboresF(e.target.value as typeof laboresF)}>
                <option value="todas">Todas</option>
                <option value="S">Con siembra (S)</option>
                <option value="T">Con trasplante (T)</option>
                <option value="C">Con cosecha (C)</option>
                <option value="vacias">Sin labores</option>
              </select>
            </Campo>
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
              <span>{filas.length} de {(data ?? []).length} filas</span>
              {(busqueda || cicloF !== "todos" || laboresF !== "todas") && (
                <button type="button" onClick={() => { setBusqueda(""); setCicloF("todos"); setLaboresF("todas"); }}
                  className="underline hover:text-primary">Limpiar</button>
              )}
            </div>
          </div>

          {filas.length === 0 ? (
            <Vacio texto="Ninguna fila coincide con la búsqueda." />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="min-w-[1100px] w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="p-2 font-medium text-xs text-muted-foreground">Orden</th>
                    <th className="text-left p-3 font-medium">Planta y ciclo</th>
                    {meses.map((m) => <th key={m} className="p-2 font-medium text-xs text-muted-foreground">{m}</th>)}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filas.map((fila) => (
                    <FilaCalendarioEditable
                      key={fila.id}
                      fila={fila}
                      onGuardar={(v) => guardarFila.mutate({ id: fila.id, ...v })}
                      onDuplicar={() => duplicar.mutate({
                        planta_nombre: fila.planta_nombre,
                        ciclo: fila.ciclo,
                        orden: fila.orden,
                        meses: Array.from({ length: 12 }, (_, i) => fila.meses[i] ?? ""),
                      })}
                      onBorrar={() => { if (confirm(`¿Borrar la fila de ${fila.planta_nombre}?`)) borrar.mutate(fila.id); }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

    </div>
  );
}

type FilaCalEdit = { planta_nombre: string; ciclo: string | null; orden: number; meses: string[] };

function FilaCalendarioEditable({
  fila, onGuardar, onBorrar, onDuplicar,
}: {
  fila: { id: string; planta_nombre: string; ciclo: string | null; orden: number; meses: string[] };
  onGuardar: (valores: FilaCalEdit) => void;
  onBorrar: () => void;
  onDuplicar: () => void;

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
      <td className="p-1">
        <input
          type="number"
          aria-label="Orden"
          className="w-16 rounded-lg border border-border bg-background px-2 py-1 text-center text-xs"
          value={v.orden}
          onChange={(e) => setV({ ...v, orden: Number(e.target.value) })}
        />
      </td>
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
        <button type="button" onClick={onDuplicar} className="p-2 text-muted-foreground hover:text-primary" aria-label="Duplicar fila" title="Duplicar ciclo">
          <Copy className="h-4 w-4" aria-hidden />
        </button>
        <button type="button" onClick={onBorrar} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Borrar fila">

          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </td>
    </tr>
  );
}

/* ───────────────────────── Plagas y enfermedades ───────────────────────── */

type PlagaForm = {
  id?: string;
  slug: string;
  nombre: string;
  descripcion: string;
  prevencion: string;
  combate: string;
  otros_datos: string;
  imagen_url: string;
};

const plagaVacia: PlagaForm = { slug: "", nombre: "", descripcion: "", prevencion: "", combate: "", otros_datos: "", imagen_url: "" };

const aSlug = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function PanelPlagas() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<PlagaForm | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [imagenesDe, setImagenesDe] = useState<{ id: string; nombre: string } | null>(null);
  const [nuevaImagen, setNuevaImagen] = useState({ imagen_url: "", tag: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "plagas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plagas")
        .select("*, plaga_imagenes(id, imagen_url, tag, orden)")
        .order("nombre");
      if (error) throw error;
      return data as unknown as (PlagaForm & {
        id: string;
        plaga_imagenes: { id: string; imagen_url: string; tag: string; orden: number }[];
      })[];
    },
  });

  const { data: plantas } = useQuery({
    queryKey: ["admin", "plantas", "lista"],
    queryFn: async () => {
      const { data, error } = await supabase.from("plantas").select("id, nombre, slug").order("nombre");
      if (error) throw error;
      return data;
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "plagas"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "planta_plagas"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async (f: PlagaForm) => {
      const fila = {
        slug: f.slug || aSlug(f.nombre),
        nombre: f.nombre,
        descripcion: f.descripcion,
        prevencion: f.prevencion,
        combate: f.combate,
        otros_datos: f.otros_datos,
        imagen_url: f.imagen_url || null,
      };
      const { error } = f.id
        ? await supabase.from("plagas").update(fila).eq("id", f.id)
        : await supabase.from("plagas").insert(fila);
      if (error) throw error;
    },
    onSuccess: () => { setEdit(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plagas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const anadirImagen = useMutation({
    mutationFn: async ({ plagaId, imagen_url, tag }: { plagaId: string; imagen_url: string; tag: string }) => {
      const { error } = await supabase.from("plaga_imagenes").insert({ plaga_id: plagaId, imagen_url, tag, orden: 0 });
      if (error) throw error;
    },
    onSuccess: () => { setNuevaImagen({ imagen_url: "", tag: "" }); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrarImagen = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("plaga_imagenes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const [refrescando, setRefrescando] = useState(false);
  const recargar = async () => {
    setRefrescando(true);
    await queryClient.refetchQueries({ queryKey: ["admin", "plagas"] });
    await queryClient.refetchQueries({ queryKey: ["admin", "planta_plagas"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
    setRefrescando(false);
    setAviso("Datos recargados desde la base de datos.");
  };

  const visibles = (data ?? []).filter((e) =>
    filtro ? e.nombre.toLowerCase().includes(filtro.toLowerCase()) : true,
  );
  const plagaImagenes = imagenesDe ? (data ?? []).find((p) => p.id === imagenesDe.id)?.plaga_imagenes ?? [] : [];

  return (
    <div className="space-y-6">
      <Barra
        titulo="Plagas y enfermedades"
        descripcion="Catálogo global de plagas. Cada plaga se crea una sola vez y luego se asocia a las plantas que quieras desde la pestaña «Catálogo y temporada»."
        aviso={aviso}
        info={
          <>
            Creas la plaga una vez (por ejemplo «Pulgón») y la reutilizas en todas las plantas que la sufran.
            Para asociarla, edita la planta en «Catálogo y temporada». Si una planta no tiene plagas asociadas,
            esa sección no aparece en su ficha.
          </>
        }
        acciones={
          <>
            <button type="button" onClick={() => void recargar()} disabled={refrescando}
              title="Vuelve a leer las plagas de la base de datos. No añade ni restaura nada."
              className={`${btn} border border-border hover:text-primary`}>
              {refrescando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
              Refrescar datos
            </button>
            <button type="button" onClick={() => setEdit({ ...plagaVacia })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nueva plaga
            </button>
          </>
        }
      />

      {edit && (
        <form onSubmit={(e) => { e.preventDefault(); guardar.mutate(edit); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4">
          <Campo label="Nombre de la plaga o enfermedad"><input className={input} required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Campo>
          <Campo label="Identificador (slug)" info={<>Nombre corto en minúsculas y con guiones. Si lo dejas vacío se genera solo a partir del nombre.</>}><input className={input} value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo label="Descripción" ancho info={<>Si dejas el campo vacío, no se muestra en la ficha del producto.</>}><textarea className={input} rows={2} value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} /></Campo>
          <Campo label="Prevención" ancho info={<>Aparece dentro del desplegable de la plaga en la ficha pública.</>}><textarea className={input} rows={2} value={edit.prevencion} onChange={(e) => setEdit({ ...edit, prevencion: e.target.value })} /></Campo>
          <Campo label="Cómo combatirla" ancho info={<>Tratamientos y dosis (ml o g por litro). Aparece en el desplegable de la ficha.</>}><textarea className={input} rows={2} value={edit.combate} onChange={(e) => setEdit({ ...edit, combate: e.target.value })} /></Campo>
          <Campo label="Otros datos" ancho><textarea className={input} rows={2} value={edit.otros_datos} onChange={(e) => setEdit({ ...edit, otros_datos: e.target.value })} /></Campo>
          <CampoImagen
            label="Imagen principal"
            ancho
            valor={edit.imagen_url}
            onChange={(v) => setEdit({ ...edit, imagen_url: v })}
            info={<>Foto general de la plaga. Puedes añadir además fotos por planta con etiqueta desde el botón «Imágenes». Si no hay ninguna se usa el placeholder.</>}
          />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      {imagenesDe && (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-lg">Imágenes de «{imagenesDe.nombre}»</h3>
            <button type="button" onClick={() => setImagenesDe(null)} className={`${btn} border border-border hover:text-primary`}>Cerrar</button>
          </div>
          <p className="text-xs text-muted-foreground">
            La etiqueta indica en qué planta se usa esa foto (por ejemplo «tomate»). Sin etiqueta, la foto sirve como imagen general.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {plagaImagenes.map((im) => (
              <div key={im.id} className="flex items-center gap-3 rounded-xl border border-border p-2">
                <Miniatura src={im.imagen_url} alt={im.tag || imagenesDe.nombre} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{im.tag || "Sin etiqueta"}</p>
                  <p className="text-xs text-muted-foreground truncate">{im.imagen_url}</p>
                </div>
                <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label="Borrar imagen"
                  onClick={() => borrarImagen.mutate(im.id)}>
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
            {plagaImagenes.length === 0 && <p className="text-sm text-muted-foreground">Sin imágenes todavía: se usará el placeholder.</p>}
          </div>
          <form
            className="grid sm:grid-cols-[2fr_1fr_auto] gap-2 items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (!nuevaImagen.imagen_url) return;
              anadirImagen.mutate({ plagaId: imagenesDe.id, ...nuevaImagen });
            }}
          >
            <CampoImagen
              label="URL de la imagen"
              valor={nuevaImagen.imagen_url}
              onChange={(v) => setNuevaImagen({ ...nuevaImagen, imagen_url: v })}
              info={<>Foto de esta plaga en una planta concreta. La etiqueta sirve para mostrarla en la ficha de esa planta.</>}
            />
            <Campo label="Etiqueta (planta)"><input className={input} placeholder="tomate" value={nuevaImagen.tag} onChange={(e) => setNuevaImagen({ ...nuevaImagen, tag: e.target.value })} /></Campo>
            <button type="submit" disabled={anadirImagen.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Añadir
            </button>
          </form>
        </div>
      )}

      <input
        className={`${input} max-w-sm`}
        placeholder="Buscar plaga…"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio="Todavía no hay plagas en la base de datos. Usa «Importar las actuales» para empezar."
          filas={visibles.map((e) => ({
            key: e.id,
            contenido: (
              <>
                <Miniatura src={e.imagen_url || e.plaga_imagenes?.[0]?.imagen_url} alt={e.nombre} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{e.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {e.plaga_imagenes?.length ?? 0} imágenes · {(e.combate || e.descripcion || "Sin texto").slice(0, 80)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setImagenesDe({ id: e.id, nombre: e.nombre })}>Imágenes</button>
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setEdit({
                    id: e.id, slug: e.slug, nombre: e.nombre,
                    descripcion: e.descripcion ?? "", prevencion: e.prevencion ?? "",
                    combate: e.combate ?? "", otros_datos: e.otros_datos ?? "", imagen_url: e.imagen_url ?? "",
                  })}>Editar</button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Borrar ${e.nombre}`}
                    onClick={() => { if (confirm(`¿Borrar "${e.nombre}"? Se quitará de todas las plantas.`)) borrar.mutate(e.id); }}>
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



/* ───────────────────── Tierras y material ───────────────────── */

type MaterialForm = {
  id?: string;
  seccion: string;
  nombre: string;
  uso: string;
  formato: string;
  detalle: string;
  marca: string;
  imagen_url: string;
  orden: number;
  publicado: boolean;
};

const SECCIONES_MATERIAL: [string, string][] = [
  ["sustratos", "Tierras y sustratos"],
  ["compost", "Compost"],
  ["piedras", "Piedras y áridos"],
  ["macetas", "Macetas y jardineras"],
];

const materialVacio: MaterialForm = {
  seccion: "sustratos", nombre: "", uso: "", formato: "", detalle: "", marca: "",
  imagen_url: "", orden: 0, publicado: true,
};

function PanelMateriales() {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState<MaterialForm | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("");
  const [seccionFiltro, setSeccionFiltro] = useState("todas");
  const [refrescando, setRefrescando] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "materiales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materiales")
        .select("*")
        .order("seccion")
        .order("orden");
      if (error) throw error;
      return data as unknown as (MaterialForm & { id: string })[];
    },
  });

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "materiales"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
  };

  const guardar = useMutation({
    mutationFn: async (f: MaterialForm) => {
      const fila = {
        seccion: f.seccion, nombre: f.nombre, uso: f.uso, formato: f.formato,
        detalle: f.detalle, marca: f.marca, imagen_url: f.imagen_url || null,
        orden: Number(f.orden) || 0, publicado: f.publicado,
      };
      const { error } = f.id
        ? await supabase.from("materiales").update(fila).eq("id", f.id)
        : await supabase.from("materiales").insert(fila);
      if (error) throw error;
    },
    onSuccess: () => { setEdit(null); refrescar(); },
    onError: (e: Error) => setAviso(e.message),
  });

  const borrar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("materiales").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const duplicar = useMutation({
    mutationFn: async (m: MaterialForm & { id: string }) => {
      const { id: _id, ...resto } = m;
      const { error } = await supabase.from("materiales").insert({
        ...resto, nombre: `${m.nombre} (copia)`, imagen_url: m.imagen_url || null,
      });
      if (error) throw error;
    },
    onSuccess: refrescar,
    onError: (e: Error) => setAviso(e.message),
  });

  const recargar = async () => {
    setRefrescando(true);
    await queryClient.refetchQueries({ queryKey: ["admin", "materiales"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
    setRefrescando(false);
    setAviso("Datos recargados desde la base de datos.");
  };

  const visibles = (data ?? []).filter((m) => {
    const texto = `${m.nombre} ${m.uso} ${m.marca} ${m.detalle}`.toLowerCase();
    if (filtro && !texto.includes(filtro.toLowerCase())) return false;
    if (seccionFiltro !== "todas" && m.seccion !== seccionFiltro) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <Barra
        titulo="Tierras, sustratos y material de jardinería"
        descripcion="Contenido de las pestañas «Tierras y sustratos» y «Material para jardinería» de la página de Productos: sustratos, compost, piedras y macetas."
        aviso={aviso}
        acciones={
          <>
            <button type="button" onClick={() => void recargar()} disabled={refrescando}
              title="Vuelve a leer los materiales de la base de datos. No añade ni restaura nada."
              className={`${btn} border border-border hover:text-primary`}>
              {refrescando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
              Refrescar datos
            </button>
            <button type="button" onClick={() => setEdit({ ...materialVacio })}
              className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              <Plus className="h-4 w-4" aria-hidden /> Nuevo material
            </button>
          </>
        }
      />

      {edit && (
        <form onSubmit={(e) => { e.preventDefault(); guardar.mutate(edit); }}
          className="rounded-2xl border border-border bg-card p-6 grid md:grid-cols-2 gap-4">
          <Campo
            label="Sección"
            info={<>«Tierras y sustratos» y «Compost» se muestran en la pestaña <b>Tierras y sustratos</b>; «Piedras y áridos» y «Macetas» en <b>Material para jardinería</b>.</>}
          >
            <select className={input} value={edit.seccion} onChange={(e) => setEdit({ ...edit, seccion: e.target.value })}>
              {SECCIONES_MATERIAL.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </Campo>
          <Campo label="Nombre"><input className={input} required value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} /></Campo>
          <Campo label="Uso (frase corta)" info={<>Frase corta que aparece bajo el nombre del producto.</>}><input className={input} value={edit.uso} onChange={(e) => setEdit({ ...edit, uso: e.target.value })} /></Campo>
          <Campo label="Formato o medida" info={<>Se muestra como etiqueta sobre la foto: «70 L», «Big bag 1 m³», «Ø 10–60 cm»…</>}><input className={input} value={edit.formato} onChange={(e) => setEdit({ ...edit, formato: e.target.value })} /></Campo>
          <Campo label="Marca o proveedor" info={<>Texto pequeño en mayúsculas (Suliflor España, Liett Ibérica…). Si lo dejas vacío se usa el de por defecto de la sección.</>}><input className={input} value={edit.marca} onChange={(e) => setEdit({ ...edit, marca: e.target.value })} /></Campo>
          <CampoImagen
            label="Imagen del producto"
            valor={edit.imagen_url}
            onChange={(v) => setEdit({ ...edit, imagen_url: v })}
            info={<>Pega la dirección (URL) de la foto. Si la dejas vacía se usa el placeholder «web en construcción».</>}
          />
          <Campo label="Detalle" ancho info={<>Línea que se muestra con el check verde.</>}><textarea className={input} rows={2} value={edit.detalle} onChange={(e) => setEdit({ ...edit, detalle: e.target.value })} /></Campo>
          <Campo label="Orden" info={<>Número menor = aparece antes en la web.</>}><input type="number" className={input} value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: Number(e.target.value) })} /></Campo>
          <label className="flex items-center gap-2 text-sm mt-6">
            <input type="checkbox" checked={edit.publicado} onChange={(e) => setEdit({ ...edit, publicado: e.target.checked })} />
            Publicado en la web
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={guardar.isPending} className={`${btn} bg-primary text-primary-foreground hover:bg-primary/90`}>
              {guardar.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />} Guardar
            </button>
            <button type="button" onClick={() => setEdit(null)} className={`${btn} border border-border hover:text-primary`}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input className={`${input} pl-9 w-64`} placeholder="Buscar material…" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
        <select className={`${input} w-auto`} value={seccionFiltro} onChange={(e) => setSeccionFiltro(e.target.value)}>
          <option value="todas">Todas las secciones</option>
          {SECCIONES_MATERIAL.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>

      {isLoading ? <Cargando /> : (
        <Tabla
          vacio="No hay materiales que coincidan con la búsqueda."
          filas={visibles.map((m) => ({
            key: m.id,
            contenido: (
              <>
                <span className="w-10 text-xs text-muted-foreground tabular-nums shrink-0">{m.orden}</span>
                <Miniatura src={m.imagen_url} alt={m.nombre} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{m.nombre}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {SECCIONES_MATERIAL.find(([k]) => k === m.seccion)?.[1] ?? m.seccion}
                    {m.formato ? ` · ${m.formato}` : ""}{m.uso ? ` · ${m.uso}` : ""}
                  </p>
                </div>
                <IconoEstado activo={m.publicado} on={Eye} off={EyeOff} titulo="Publicado" />
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" className="p-2 hover:text-primary" aria-label={`Duplicar ${m.nombre}`}
                    onClick={() => duplicar.mutate(m)}>
                    <Copy className="h-4 w-4" aria-hidden />
                  </button>
                  <button type="button" className="p-2 hover:text-primary" onClick={() => setEdit({
                    id: m.id, seccion: m.seccion, nombre: m.nombre, uso: m.uso ?? "", formato: m.formato ?? "",
                    detalle: m.detalle ?? "", marca: m.marca ?? "", imagen_url: m.imagen_url ?? "",
                    orden: m.orden ?? 0, publicado: m.publicado,
                  })}>Editar</button>
                  <button type="button" className="p-2 text-muted-foreground hover:text-destructive" aria-label={`Borrar ${m.nombre}`}
                    onClick={() => { if (confirm(`¿Borrar "${m.nombre}"? Desaparecerá de la web.`)) borrar.mutate(m.id); }}>
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

  const [refrescando, setRefrescando] = useState(false);
  const recargar = async () => {
    setRefrescando(true);
    await queryClient.refetchQueries({ queryKey: ["admin", "noticias"] });
    void queryClient.invalidateQueries({ queryKey: ["cms"] });
    setRefrescando(false);
    setAviso("Datos recargados desde la base de datos.");
  };

  return (
    <div className="space-y-6">
      <Barra
        titulo="Noticias y curiosidades"
        descripcion="La base de datos manda: el blog muestra exactamente estas noticias. Si borras una aquí, desaparece de la web. En el cuerpo, una línea que empiece por ## crea un subtítulo."
        aviso={aviso}
        info={
          <>
            Esta pestaña gestiona el <b>blog</b> (<code>/blog</code>): novedades del vivero, ferias y curiosidades.
            Las <b>guías de cultivo</b> son otra cosa y viven en «Tu Huerto». <b>Destacada</b> resalta el artículo
            en la portada del blog; <b>Publicada</b> lo hace visible al público.
          </>
        }
        acciones={
          <>
            <button
              type="button"
              title="Vuelve a leer las noticias de la base de datos. No añade ni restaura nada."
              onClick={() => void recargar()}
              disabled={refrescando}
              className={`${btn} border border-border hover:text-primary`}>
              {refrescando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <RefreshCw className="h-4 w-4" aria-hidden />}
              Refrescar datos
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
          <Campo
            label="Identificador (slug)"
            info={<>Dirección web del artículo (<code>/blog/mi-slug</code>). Minúsculas y guiones. No lo cambies una vez publicado: romperías los enlaces. No tiene relación con las guías de cultivo de «Tu Huerto».</>}
          ><input className={input} required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo label="Título"><input className={input} required value={edit.titulo} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} /></Campo>
          <Campo label="Categoría">
            <select className={input} value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>
              {["Novedades", "Ferias y eventos", "Temporada", "Curiosidades"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
          <Campo label="Fecha"><input type="date" className={input} value={edit.fecha} onChange={(e) => setEdit({ ...edit, fecha: e.target.value })} /></Campo>
          <Campo label="Autor"><input className={input} value={edit.autor} onChange={(e) => setEdit({ ...edit, autor: e.target.value })} /></Campo>
          <Campo label="Minutos de lectura"><input type="number" className={input} value={edit.minutos} onChange={(e) => setEdit({ ...edit, minutos: Number(e.target.value) })} /></Campo>
          <CampoImagen
            label="Imagen del artículo"
            ancho
            valor={edit.imagen_url}
            onChange={(v) => setEdit({ ...edit, imagen_url: v })}
            info={<>Pega la dirección (URL) de la foto de portada del artículo. Si la dejas vacía se usa el placeholder «web en construcción».</>}
          />
          <Campo label="Resumen" ancho info={<>Texto corto que se ve en el listado del blog.</>}><textarea className={input} rows={2} value={edit.resumen} onChange={(e) => setEdit({ ...edit, resumen: e.target.value })} /></Campo>
          <Campo label="Entradilla" ancho info={<>Primer párrafo destacado dentro del artículo.</>}><textarea className={input} rows={2} value={edit.entradilla} onChange={(e) => setEdit({ ...edit, entradilla: e.target.value })} /></Campo>
          <Campo label="Cuerpo" ancho info={<>Escribe párrafos normales. Una línea que empiece por <code>##</code> se convierte en subtítulo de sección.</>}><textarea className={input} rows={10} value={edit.cuerpo} onChange={(e) => setEdit({ ...edit, cuerpo: e.target.value })} /></Campo>
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
                <Miniatura src={n.imagen_url} alt={n.titulo} />
                <div className="min-w-0 flex-1">
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

/** Ventana modal de edición: se abre sobre la lista y se cierra con la X,
 *  con «Cancelar», con la tecla Esc o pulsando fuera. Así se puede pasar de
 *  editar un elemento a otro sin quedarse bloqueado. */
function ModalEdicion({ titulo, descripcion, onClose, children }: {
  titulo: string;
  descripcion?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", alPulsar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alPulsar);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-foreground/50 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-border bg-card px-6 py-4">
          <div className="min-w-0">
            <h3 className="font-serif text-xl">{titulo}</h3>
            {descripcion && <p className="text-xs text-muted-foreground mt-1">{descripcion}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar"
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-primary shrink-0">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/** Botón (i) con explicación emergente al pasar por encima o al enfocar. */
function InfoTip({ texto }: { texto: React.ReactNode }) {
  return (
    <span className="relative inline-flex group align-middle">
      <button
        type="button"
        aria-label="Más información"
        onClick={(e) => e.preventDefault()}
        className="h-4 w-4 inline-flex items-center justify-center rounded-full border border-border text-[10px] font-semibold leading-none text-muted-foreground hover:text-primary hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        i
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full z-50 mb-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-card p-3 text-left text-xs font-normal leading-relaxed text-muted-foreground shadow-xl opacity-0 invisible transition-opacity group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible [&_b]:text-foreground [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1"
      >
        {texto}
      </span>
    </span>
  );
}

/** Campo de imagen con miniatura de vista previa y botón para vaciarlo. */
function CampoImagen({ label, valor, onChange, info, ancho, slug }: {
  label: string;
  valor: string;
  onChange: (v: string) => void;
  info?: React.ReactNode;
  ancho?: boolean;
  slug?: string;
}) {
  return (
    <Campo label={label} info={info} ancho={ancho}>
      <div className="flex items-center gap-3">
        <Miniatura key={valor} src={valor} slug={slug} alt="Vista previa de la imagen" />
        <input
          className={input}
          value={valor}
          placeholder="https://…  (si lo dejas vacío se usa el placeholder)"
          onChange={(e) => onChange(e.target.value)}
        />
        {valor && (
          <button type="button" onClick={() => onChange("")} aria-label="Quitar imagen"
            className="p-2 text-muted-foreground hover:text-destructive shrink-0">
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </Campo>
  );
}

/** Selector múltiple con buscador, etiquetas de lo elegido y lista desplegable. */
function SelectorMultiple({ titulo, info, opciones, valor, onChange, vacio, placeholder }: {
  titulo: string;
  info?: React.ReactNode;
  opciones: { id: string; nombre: string; imagen?: string | null; extra?: string }[];
  valor: string[];
  onChange: (v: string[]) => void;
  vacio: string;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const elegidas = valor
    .map((id) => opciones.find((o) => o.id === id))
    .filter(Boolean) as typeof opciones;
  const busqueda = q.trim().toLowerCase();
  const lista = opciones.filter((o) =>
    busqueda ? `${o.nombre} ${o.extra ?? ""}`.toLowerCase().includes(busqueda) : true,
  );
  const alternar = (id: string) =>
    onChange(valor.includes(id) ? valor.filter((x) => x !== id) : [...valor, id]);

  return (
    <div className="md:col-span-2 rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium flex items-center gap-2">
          {titulo} {info && <InfoTip texto={info} />}
          <span className="text-xs font-normal text-muted-foreground">({valor.length} seleccionadas)</span>
        </p>
        <div className="flex items-center gap-2">
          {valor.length > 0 && (
            <button type="button" className="text-xs text-muted-foreground hover:text-destructive" onClick={() => onChange([])}>
              Quitar todas
            </button>
          )}
          <button type="button" className="text-xs text-primary hover:underline" onClick={() => setAbierto(!abierto)}>
            {abierto ? "Cerrar lista" : "Añadir / editar"}
          </button>
        </div>
      </div>

      {elegidas.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {elegidas.map((o) => (
            <span key={o.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 pl-1 pr-2 py-1 text-xs">
              <img
                src={o.imagen || IMAGEN_PLAGA_POR_DEFECTO}
                alt=""
                className="h-5 w-5 rounded-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMAGEN_PLAGA_POR_DEFECTO; }}
              />
              <span className="max-w-[14rem] truncate">{o.nombre}</span>
              <button type="button" aria-label={`Quitar ${o.nombre}`} onClick={() => alternar(o.id)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">{vacio}</p>
      )}

      {abierto && (
        <div className="mt-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
            <input type="search" className={`${input} pl-9`} placeholder={placeholder ?? "Buscar…"} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-border divide-y divide-border">
            {lista.length === 0 && <p className="p-3 text-xs text-muted-foreground">Sin resultados.</p>}
            {lista.map((o) => {
              const marcada = valor.includes(o.id);
              return (
                <label key={o.id} className={`flex items-center gap-3 p-2 text-sm cursor-pointer ${marcada ? "bg-secondary/50" : "hover:bg-secondary/30"}`}>
                  <input type="checkbox" checked={marcada} onChange={() => alternar(o.id)} />
                  <Miniatura src={o.imagen} alt={o.nombre} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{o.nombre}</span>
                    {o.extra && <span className="block text-xs text-muted-foreground truncate">{o.extra}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Barra({ titulo, descripcion, acciones, aviso, info }: {
  titulo: string; descripcion: string; acciones: React.ReactNode; aviso: string | null; info?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl font-medium flex items-center gap-2">
            {titulo} {info && <InfoTip texto={info} />}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{descripcion}</p>
        </div>
        <div className="flex flex-wrap gap-2">{acciones}</div>
      </div>
      {aviso && <p className="mt-4 text-sm text-accent">{aviso}</p>}
    </div>
  );
}

function Campo({ label, children, ancho, info }: { label: string; children: React.ReactNode; ancho?: boolean; info?: React.ReactNode }) {
  return (
    <label className={`block text-sm ${ancho ? "md:col-span-2" : ""}`}>
      <span className="mb-1.5 flex items-center gap-2 text-muted-foreground">
        {label} {info && <InfoTip texto={info} />}
      </span>
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
        <li key={f.key} className="flex items-center gap-3 p-4 text-sm">{f.contenido}</li>
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
