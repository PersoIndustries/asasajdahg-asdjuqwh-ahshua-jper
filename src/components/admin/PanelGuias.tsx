import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw, Pencil, Trash2, Save, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { rowToGuia, IMAGEN_PLAGA_POR_DEFECTO } from "@/lib/cms";
import type { GuiaSection } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GuiaLectura } from "@/components/site/GuiaLectura";

type Row = Database["public"]["Tables"]["guias"]["Row"];
type Form = Omit<Row, "created_at" | "updated_at" | "secciones"> & { secciones: GuiaSection[] };
const vacia = (): Form => ({ id: "", slug: "", titulo: "", resumen: "", categoria: "Huerto", minutos: 5, contenido: "", secciones: [], tags: [], imagen_url: "", pdf_url: "", publicado: true, orden: 0, fecha_publicacion: new Date().toISOString().slice(0, 10) });
function Campo({ titulo, ayuda, children }: { titulo: string; ayuda?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><div className="flex items-center gap-2 text-sm text-muted-foreground">{titulo}{ayuda && <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5" aria-label={`Información sobre ${titulo}`}>ⓘ</Button></TooltipTrigger><TooltipContent className="max-w-64">{ayuda}</TooltipContent></Tooltip>}</div>{children}</div>;
}
export function PanelGuias() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Form | null>(null);
  const [previa, setPrevia] = useState<Form | null>(null);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("todos");
  const [error, setError] = useState("");
  const { data = [], isPending, error: loadError } = useQuery({ queryKey: ["admin", "guias"], queryFn: async () => {
    const { data, error } = await supabase.from("guias").select("*").order("orden"); if (error) throw error; return data;
  }});
  const refrescar = async () => { await Promise.all([qc.invalidateQueries({ queryKey: ["admin", "guias"] }), qc.invalidateQueries({ queryKey: ["cms", "guias"] })]); };
  const guardar = useMutation({ mutationFn: async (f: Form) => {
    const { id, ...rest } = f;
    const row = { ...rest, slug: f.slug.trim(), titulo: f.titulo.trim(), imagen_url: f.imagen_url?.trim() || null, pdf_url: f.pdf_url?.trim() || null, secciones: f.secciones as unknown as Json };
    const result = id ? await supabase.from("guias").update(row).eq("id", id).select("id").single() : await supabase.from("guias").insert(row).select("id").single();
    if (result.error) throw result.error;
  }, onSuccess: async () => { setEdit(null); await refrescar(); }, onError: (e: Error) => setError(e.message) });
  const borrar = useMutation({ mutationFn: async (id: string) => {
    const { data, error } = await supabase.from("guias").delete().eq("id", id).select("id"); if (error) throw error; if (!data?.length) throw new Error("No se pudo borrar la guía.");
  }, onSuccess: refrescar, onError: (e: Error) => setError(e.message) });
  const abrir = (r: Row) => { setError(""); setEdit({ ...r, secciones: (Array.isArray(r.secciones) ? r.secciones : []) as unknown as GuiaSection[] }); };
  const visibles = data.filter((g) => `${g.titulo} ${g.categoria} ${g.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()) && (estado === "todos" || g.publicado === (estado === "publicadas")));
  return <TooltipProvider><div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-4"><h2 className="font-serif text-2xl">Guías de cultivo</h2><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => void refrescar()}><RefreshCw />Refrescar datos</Button><Button onClick={() => { setError(""); setEdit(vacia()); }}><Plus />Nueva guía</Button></div></div>
    <div className="flex flex-wrap gap-3"><Input aria-label="Buscar guías" placeholder="Buscar guía, categoría o etiqueta…" className="sm:max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} /><select aria-label="Estado de guías" className="border border-input rounded-md bg-background p-2 text-sm" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="todos">Todos los estados</option><option value="publicadas">Publicadas</option><option value="ocultas">Ocultas</option></select></div>
    {(error || loadError) && <p role="alert" className="text-destructive">{error || loadError?.message}</p>}
    {isPending ? <Loader2 className="animate-spin" /> : <ul className="divide-y divide-border border border-border rounded-lg">{visibles.map((r) => <li key={r.id} className="p-4 flex flex-wrap items-center gap-3"><img src={r.imagen_url || IMAGEN_PLAGA_POR_DEFECTO} alt={r.titulo} className="h-12 w-12 object-cover rounded-md" onError={(e) => { e.currentTarget.src = IMAGEN_PLAGA_POR_DEFECTO; }} /><div className="flex-1 min-w-40"><p className="font-medium">{r.titulo}</p><p className="text-xs text-muted-foreground">{r.categoria} · {r.publicado ? "Publicada" : "Oculta"}</p></div><Button variant="ghost" aria-label={`Editar ${r.titulo}`} onClick={() => abrir(r)}><Pencil />Editar</Button><Button variant="ghost" size="icon" aria-label={`Borrar ${r.titulo}`} disabled={borrar.isPending} onClick={() => { if (confirm(`¿Borrar «${r.titulo}»? Desaparecerá de Tu Huerto y del catálogo.`)) borrar.mutate(r.id); }}><Trash2 /></Button></li>)}{!visibles.length && <li className="p-8 text-center text-muted-foreground">No hay guías que coincidan.</li>}</ul>}
    <Dialog open={edit !== null} onOpenChange={(v) => { if (!v) setEdit(null); }}><DialogContent className="w-[calc(100%-2rem)] max-w-4xl rounded-lg max-h-[92dvh] overflow-y-auto"><DialogTitle>{edit?.id ? "Editar guía" : "Nueva guía"}</DialogTitle><DialogDescription>Guías de cultivo de Tu Huerto, independientes de las noticias del blog.</DialogDescription>
      {edit && <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setError(""); guardar.mutate(edit); }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Campo titulo="Título"><Input aria-label="Título" required value={edit.titulo} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} /></Campo>
          <Campo titulo="Identificador" ayuda="Nombre único, en minúsculas y con guiones. Mantén el mismo identificador si la guía ya está asociada a plantas."><Input aria-label="Identificador" required value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} /></Campo>
          <Campo titulo="Categoría"><select aria-label="Categoría" className="w-full border border-input bg-background p-2 rounded-md" value={edit.categoria} onChange={(e) => setEdit({ ...edit, categoria: e.target.value })}>{["Huerto", "Jardín", "Sustratos", "Compost", "Frutales"].map((c) => <option key={c}>{c}</option>)}</select></Campo>
          <Campo titulo="Minutos de lectura"><Input aria-label="Minutos de lectura" type="number" min={1} required value={edit.minutos} onChange={(e) => setEdit({ ...edit, minutos: Number(e.target.value) })} /></Campo>
          <Campo titulo="Imagen" ayuda="URL o ruta local /media/…; sin foto se muestra Web under construction."><Input aria-label="Imagen" value={edit.imagen_url ?? ""} onChange={(e) => setEdit({ ...edit, imagen_url: e.target.value })} /><img src={edit.imagen_url || IMAGEN_PLAGA_POR_DEFECTO} alt="Vista previa" className="h-24 w-24 object-cover rounded-md" onError={(e) => { e.currentTarget.src = IMAGEN_PLAGA_POR_DEFECTO; }} /></Campo>
          <Campo titulo="PDF" ayuda="Opcional. Pega una URL o ruta local del PDF. La guía se puede leer sin PDF."><Input aria-label="PDF" value={edit.pdf_url ?? ""} onChange={(e) => setEdit({ ...edit, pdf_url: e.target.value })} /></Campo>
          <Campo titulo="Orden"><Input aria-label="Orden" type="number" value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: Number(e.target.value) })} /></Campo>
          <Campo titulo="Fecha"><Input aria-label="Fecha" type="date" required value={edit.fecha_publicacion} onChange={(e) => setEdit({ ...edit, fecha_publicacion: e.target.value })} /></Campo>
        </div>
        <Campo titulo="Resumen"><Textarea aria-label="Resumen" value={edit.resumen} onChange={(e) => setEdit({ ...edit, resumen: e.target.value })} /></Campo>
        <Campo titulo="Introducción"><Textarea aria-label="Introducción" rows={4} value={edit.contenido} onChange={(e) => setEdit({ ...edit, contenido: e.target.value })} /></Campo>
        <Campo titulo="Etiquetas" ayuda="Separa las etiquetas con comas; sirven como filtros en Tu Huerto."><Input aria-label="Etiquetas" value={edit.tags.join(",")} onChange={(e) => setEdit({ ...edit, tags: e.target.value.split(",") })} /></Campo>
        {edit.secciones.map((s, i) => <section key={i} className="space-y-2 border-t border-border pt-4"><div className="flex gap-2"><Input aria-label={`Título sección ${i + 1}`} placeholder="Título de sección" value={s.titulo ?? ""} onChange={(e) => setEdit({ ...edit, secciones: edit.secciones.map((v, j) => j === i ? { ...v, titulo: e.target.value } : v) })} /><Button variant="ghost" type="button" aria-label={`Quitar sección ${i + 1}`} onClick={() => setEdit({ ...edit, secciones: edit.secciones.filter((_, j) => j !== i) })}><Trash2 /></Button></div><Textarea aria-label={`Texto sección ${i + 1}`} rows={5} value={s.parrafos.join("\n\n")} onChange={(e) => setEdit({ ...edit, secciones: edit.secciones.map((v, j) => j === i ? { ...v, parrafos: e.target.value.split("\n\n") } : v) })} /></section>)}
        <Button type="button" variant="outline" onClick={() => setEdit({ ...edit, secciones: [...edit.secciones, { titulo: "", parrafos: [""] }] })}><Plus />Añadir sección</Button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.publicado} onChange={(e) => setEdit({ ...edit, publicado: e.target.checked })} />Publicada</label>
        {error && <p role="alert" className="text-destructive">{error}</p>}
        <div className="flex flex-wrap gap-2"><Button type="submit" disabled={guardar.isPending}>{guardar.isPending ? <Loader2 className="animate-spin" /> : <Save />}Guardar</Button><Button type="button" variant="outline" onClick={() => setPrevia(edit)}><Eye />Vista previa</Button><Button type="button" variant="ghost" onClick={() => setEdit(null)}>Cancelar</Button></div>
      </form>}
    </DialogContent></Dialog>
    {previa && <GuiaLectura guia={rowToGuia(previa)} onClose={() => setPrevia(null)} />}
  </div></TooltipProvider>;
}
