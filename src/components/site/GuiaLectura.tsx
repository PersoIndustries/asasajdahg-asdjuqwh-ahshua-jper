import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Guia } from "@/lib/mock-data";
import placeholder from "@/assets/placeholder/under-construction-wide.jpg";

export function GuiaLectura({ guia, onClose }: { guia: Guia; onClose: () => void }) {
  return <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="max-w-4xl w-[calc(100%-2rem)] rounded-lg max-h-[92dvh] overflow-y-auto">
      <DialogTitle className="font-serif text-2xl pr-6">{guia.titulo}</DialogTitle>
      <DialogDescription>{guia.categoria} · {guia.minutos} min</DialogDescription>
      {guia.pdfUrl && <Button asChild className="justify-self-start"><a href={guia.pdfUrl} download={`jardiper-${guia.slug}.pdf`}><Download />Descargar PDF</a></Button>}
      <img src={guia.imagen} alt={guia.titulo} className="w-full max-h-72 object-cover rounded-lg" onError={(e) => { e.currentTarget.src = placeholder; }} />
      <p className="text-muted-foreground leading-relaxed">{guia.resumen}</p>
      {guia.contenido && <p className="whitespace-pre-line leading-relaxed">{guia.contenido}</p>}
      {guia.secciones.map((s, i) => <section key={i} className="space-y-3">{s.titulo && <h3 className="font-serif text-xl">{s.titulo}</h3>}{s.parrafos.map((p, j) => <p key={j} className="leading-relaxed whitespace-pre-line">{p}</p>)}</section>)}
      {!guia.contenido && !guia.secciones.length && guia.pdfUrl && <iframe title={guia.titulo} src={guia.pdfUrl} className="w-full min-h-[60dvh]" />}
    </DialogContent>
  </Dialog>;
}