import { Link, useNavigate } from "@tanstack/react-router";
import { LogIn, LogOut, Settings, User as UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth, cerrarSesion } from "@/hooks/use-auth";

export function AuthButton({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading && !user) {
    return <span className="h-8 w-20 rounded-full bg-muted/60 animate-pulse" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        onClick={onNavigate}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors"
      >
        <LogIn className="h-4 w-4" aria-hidden />
        Acceder
      </Link>
    );
  }

  const salir = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await cerrarSesion();
    onNavigate?.();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        to={isAdmin ? "/admin" : "/cuenta"}
        onClick={onNavigate}
        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary hover:border-primary/50 transition-colors"
      >
        {isAdmin ? <Settings className="h-4 w-4" aria-hidden /> : <UserIcon className="h-4 w-4" aria-hidden />}
        {isAdmin ? "Gestor" : "Mi cuenta"}
      </Link>
      <button
        type="button"
        onClick={salir}
        className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        aria-label="Cerrar sesión"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        <span className="sr-only md:not-sr-only">Salir</span>
      </button>
    </div>
  );
}
