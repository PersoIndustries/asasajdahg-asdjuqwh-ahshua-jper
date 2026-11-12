import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Grid2X2, Pause, Play, Rows3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { FotoGaleria } from "@/lib/galerias";

export function GaleriaFotos({ titulo, fotos }: { titulo: string; fotos: FotoGaleria[] }) {
  const [todas, setTodas] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [hover, setHover] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [ref, api] = useEmblaCarousel({ loop: true, align: "start", duration: 65 });
  useEffect(() => {
    if (!api || todas || pausado || hover || zoom !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), 6500);
    const parar = () => setPausado(true);
    api.on("pointerDown", parar);
    return () => { window.clearInterval(timer); api.off("pointerDown", parar); };
  }, [api, todas, pausado, hover, zoom]);
  const foto = zoom === null ? undefined : fotos[zoom];
  const figura = (f: FotoGaleria, i: number) => (
    <figure>
      <Button variant="ghost" className="h-auto w-full p-0 overflow-hidden rounded-lg block" onClick={() => setZoom(i)} aria-label={`Ampliar ${f.texto}`}>
        <img src={f.src} alt={f.texto} loading="lazy" width={1280} height={960} className="aspect-[4/3] w-full object-cover" />
      </Button>
      <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.texto}</figcaption>
    </figure>
  );
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="mb-5 flex flex-wrap justify-end gap-2">
        {!todas && <>
          <Button variant="outline" size="icon" aria-label={`Foto anterior de ${titulo}`} onClick={() => { setPausado(true); api?.scrollPrev(); }}><ArrowLeft /></Button>
          <Button variant="outline" size="icon" aria-label={`Foto siguiente de ${titulo}`} onClick={() => { setPausado(true); api?.scrollNext(); }}><ArrowRight /></Button>
          <Button variant="outline" size="icon" aria-label={pausado ? "Reanudar carrusel" : "Pausar carrusel"} onClick={() => setPausado(!pausado)}>{pausado ? <Play /> : <Pause />}</Button>
        </>}
        <Button variant="outline" onClick={() => setTodas(!todas)}>{todas ? <Rows3 /> : <Grid2X2 />}{todas ? "Ver carrusel" : "Ver todas"}</Button>
      </div>
      {todas ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{fotos.map((f, i) => <div key={f.id}>{figura(f, i)}</div>)}</div> :
        <div ref={ref} className="overflow-hidden" aria-label={titulo} aria-roledescription="carrusel">
          <div className="flex touch-pan-y -ml-5">{fotos.map((f, i) => <div key={f.id} className="pl-5 shrink-0 min-w-0 basis-[88%] sm:basis-1/2 lg:basis-1/3">{figura(f, i)}</div>)}</div>
        </div>}
      <Dialog open={foto !== undefined} onOpenChange={(open) => { if (!open) setZoom(null); }}>
        <DialogContent className="max-w-5xl max-h-[94dvh] overflow-y-auto w-[calc(100%-2rem)] rounded-lg">
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>{foto?.texto}</DialogDescription>
          {foto && <img src={foto.src} alt={foto.texto} className="max-h-[68dvh] w-full object-contain" />}
          <div className="flex items-center justify-between">
            <Button variant="outline" aria-label="Foto anterior" onClick={() => setZoom(((zoom ?? 0) - 1 + fotos.length) % fotos.length)}><ArrowLeft /></Button>
            <span className="text-sm text-muted-foreground">{(zoom ?? 0) + 1} / {fotos.length}</span>
            <Button variant="outline" aria-label="Foto siguiente" onClick={() => setZoom(((zoom ?? 0) + 1) % fotos.length)}><ArrowRight /></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}