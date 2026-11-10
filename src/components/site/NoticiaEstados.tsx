import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

export function NoticiaNotFound() {
  return (
    <SiteLayout>
      <div className="container-page max-w-2xl py-40 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">Blog</p>
        <h1 className="font-serif text-4xl md:text-5xl">Este artículo ya no está disponible</h1>
        <p className="mt-4 text-muted-foreground">
          Puede que lo hayamos movido o que el enlace esté mal escrito. Echa un vistazo al resto de noticias.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
      </div>
    </SiteLayout>
  );
}

export function NoticiaError() {
  return (
    <SiteLayout>
      <div className="container-page max-w-2xl py-40 text-center">
        <h1 className="font-serif text-4xl md:text-5xl">No hemos podido cargar el artículo</h1>
        <p className="mt-4 text-muted-foreground">
          Ha ocurrido un problema al mostrar esta noticia. Prueba a recargar la página.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
      </div>
    </SiteLayout>
  );
}
