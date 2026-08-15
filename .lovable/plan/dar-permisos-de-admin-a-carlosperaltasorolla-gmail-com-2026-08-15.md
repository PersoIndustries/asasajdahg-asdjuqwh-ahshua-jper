# Dar permisos de admin a carlosperaltasorolla@gmail.com

Tu cuenta ya existe y está verificada, pero solo tiene el rol `user`. Hay dos formas de arreglarlo.

## Opción A: lo hago yo (recomendado)

Aplico una migración que añade el rol `admin` a tu usuario (id `53794c66-f6f7-4d9c-9044-3dd3c870e5ec`) en la tabla `user_roles`, sin tocar el resto de cuentas. Tras aprobarla, cierras sesión y vuelves a entrar y ya verás `/admin`.

## Opción B: lo haces tú desde Supabase

1. Entra en el panel de Supabase, sección SQL Editor.
2. Ejecuta:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
where email = 'carlosperaltasorolla@gmail.com'
on conflict (user_id, role) do nothing;
```

3. Cierra sesión en la web y vuelve a entrar.

Nota: `user_roles` no permite escritura desde la app (por seguridad), así que los roles se asignan siempre desde SQL o por un admin ya existente.

## Detalle técnico

- La tabla `public.user_roles` tiene RLS con solo lectura para el propio usuario; INSERT/UPDATE/DELETE están denegados a `authenticated`, por eso se hace vía migración/SQL editor.
- El hook `useAuth` consulta `user_roles` al iniciar sesión, por lo que hace falta re-login (o refrescar) para que el rol se aplique.
