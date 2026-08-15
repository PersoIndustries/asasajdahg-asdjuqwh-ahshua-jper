import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
};

async function esAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

/** Sesión de Supabase + rol de administrador (comprobado en la base de datos). */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
    isAdmin: false,
  });

  useEffect(() => {
    let activo = true;

    const aplicar = async (session: Session | null) => {
      if (!activo) return;
      if (!session?.user) {
        setState({ loading: false, session: null, user: null, isAdmin: false });
        return;
      }
      setState({ loading: true, session, user: session.user, isAdmin: false });
      const admin = await esAdmin(session.user.id);
      if (!activo) return;
      setState({ loading: false, session, user: session.user, isAdmin: admin });
    };

    supabase.auth.getSession().then(({ data }) => aplicar(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      void aplicar(session);
    });

    return () => {
      activo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export async function cerrarSesion() {
  await supabase.auth.signOut();
}
