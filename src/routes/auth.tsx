import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, Mail, Loader2, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceder · Área privada de Jardiper" },
      { name: "description", content: "Accede a tu cuenta de Jardiper con Google o email para gestionar la web y, próximamente, tu gestor de huerto personal." },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: "Acceder · Jardiper" },
      { property: "og:description", content: "Área privada del vivero Jardiper en Fraga." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: isAdmin ? "/admin" : "/cuenta", replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const entrarConGoogle = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth` },
    });
    if (error) setError(error.message);
  };

  const enviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    setMensaje(null);
    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) setError(error.message);
      else if (!data.session) setMensaje("Te hemos enviado un email para confirmar la cuenta.");
    }
    setEnviando(false);
  };

  return (
    <SiteLayout>
      <section className="py-20 md:py-28">
        <div className="container-page max-w-md">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-primary mb-4" aria-hidden />
            <h1 className="font-serif text-3xl font-medium mb-2">Área privada</h1>
            <p className="text-muted-foreground text-sm mb-8">
              Accede para gestionar la web o, si eres cliente, para lo que estamos preparando
              para ti y tu huerto.
            </p>

            <button
              type="button"
              onClick={entrarConGoogle}
              className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.1h6.6a5.7 5.7 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.4-5.2 3.4-8.6z" />
                <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
                <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.7l4-3z" />
                <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0A12 12 0 0 0 1.4 6.7l4 3.1C6.3 7 8.9 4.8 12 4.8z" />
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">o</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={enviarFormulario} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm mb-1.5">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {mensaje && <p className="text-sm text-primary">{mensaje}</p>}

              <button
                type="submit"
                disabled={enviando}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : modo === "login" ? <LogIn className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
                {modo === "login" ? "Entrar" : "Crear cuenta"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setModo(modo === "login" ? "registro" : "login"); setError(null); setMensaje(null); }}
              className="mt-5 w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {modo === "login" ? "¿No tienes cuenta? Regístrate" : "Ya tengo cuenta, entrar"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Volver a la web</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
