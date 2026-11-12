import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { galerias, promptTextosFotos } from "@/lib/galerias";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export function PanelTextosFotos() {
  const inicial = () => Object.fromEntries(galerias.flatMap((g) => g.fotos.map((f) => [f.id, f.texto])));
  const [textos, setTextos] = useState<Record<string, string>>(inicial);
  const [mensaje, setMensaje] = useState("");
  const [manual, setManual] = useState(false);
  const copiar = async () => { try { await navigator.clipboard.writeText(promptTextosFotos(textos)); setMensaje("Textos copiados."); } catch { setManual(true); setMensaje("Selecciona y copia el texto de abajo."); } };
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-4"><h2 className="font-serif text-2xl">Textos de las galerías</h2><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { if (confirm("¿Descartar los textos redactados?")) setTextos(inicial()); }}><RotateCcw />Restablecer</Button><Button onClick={() => void copiar()}><Copy />Copiar todos los textos</Button></div></div><p className="text-sm text-muted-foreground">Borrador sin guardar: los cambios no se publican y se pierden al salir. Copia los textos antes de cerrar.</p><p role="status" className="text-primary">{mensaje}</p>{galerias.map((g) => <section key={g.id}><h3 className="font-serif text-xl mb-4">{g.titulo}</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{g.fotos.map((f) => <div key={f.id} className="space-y-3"><img src={f.src} alt={f.texto} className="w-full aspect-[4/3] object-cover rounded-lg" /><label className="block text-sm text-muted-foreground">{f.id}<Textarea aria-label={`Descripción ${f.id}`} rows={3} value={textos[f.id]} onChange={(e) => setTextos({ ...textos, [f.id]: e.target.value })} className="mt-2" /></label></div>)}</div></section>)}{manual && <Textarea aria-label="Texto para copiar" readOnly rows={12} value={promptTextosFotos(textos)} onFocus={(e) => e.target.select()} />}</div>;
}
