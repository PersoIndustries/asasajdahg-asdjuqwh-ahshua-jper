import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { guardarHorario, useHorario, type Horario } from "@/lib/horario";

export function PanelHorario() {
  const qc = useQueryClient();
  const { data, isFetching } = useHorario();
  const [h, setH] = useState<Horario | null>(null);
  const [estado, setEstado] = useState("");
  const [guardando, setGuardando] = useState(false);
  useEffect(() => { if (data && !isFetching && !h) setH(structuredClone(data)); }, [data, isFetching, h]);
  if (!h) return <Loader2 className="animate-spin" />;

  const setBloque = (i: number, b: Horario["bloques"][number]) => setH({ ...h, bloques: h.bloques.map((x, j) => (j === i ? b : x)) });
  const guardar = async () => {
    setGuardando(true); setEstado("");
    try {
      const limpio = { ...h, bloques: h.bloques.map((b) => ({ dias: b.dias.trim(), horas: b.horas.map((x) => x.trim()).filter(Boolean) })).filter((b) => b.dias) };
      await guardarHorario(limpio);
      await qc.invalidateQueries({ queryKey: ["cms", "horario"] });
      setEstado("Horario guardado. Ya se ve en la página de contacto.");
    } catch (e) { setEstado(`Error: ${(e as Error).message}`); }
    setGuardando(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-serif text-2xl">Horario de la tienda</h2>
      <label className="block space-y-2 text-sm text-muted-foreground">Título (p. ej. «Horario de verano · Actual»)
        <Input value={h.titulo} onChange={(e) => setH({ ...h, titulo: e.target.value })} />
      </label>
      {h.bloques.map((b, i) => (
        <div key={i} className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input aria-label="Días" placeholder="Lunes a viernes" value={b.dias} onChange={(e) => setBloque(i, { ...b, dias: e.target.value })} />
            <Button variant="ghost" size="icon" aria-label="Quitar días" onClick={() => setH({ ...h, bloques: h.bloques.filter((_, j) => j !== i) })}><Trash2 /></Button>
          </div>
          {b.horas.map((hr, k) => (
            <div key={k} className="flex gap-2 pl-4">
              <Input aria-label="Franja horaria" placeholder="8:00 – 13:00" value={hr} onChange={(e) => setBloque(i, { ...b, horas: b.horas.map((x, m) => (m === k ? e.target.value : x)) })} />
              <Button variant="ghost" size="icon" aria-label="Quitar franja" onClick={() => setBloque(i, { ...b, horas: b.horas.filter((_, m) => m !== k) })}><Trash2 /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="ml-4" onClick={() => setBloque(i, { ...b, horas: [...b.horas, ""] })}><Plus />Añadir franja</Button>
        </div>
      ))}
      <Button variant="outline" onClick={() => setH({ ...h, bloques: [...h.bloques, { dias: "", horas: [""] }] })}><Plus />Añadir días</Button>
      <label className="block space-y-2 text-sm text-muted-foreground">Nota final
        <Input value={h.nota} onChange={(e) => setH({ ...h, nota: e.target.value })} />
      </label>
      <div className="flex items-center gap-3">
        <Button onClick={() => void guardar()} disabled={guardando}>{guardando ? <Loader2 className="animate-spin" /> : <Save />}Guardar horario</Button>
        {estado && <p role="status" className="text-sm">{estado}</p>}
      </div>
    </div>
  );
}
