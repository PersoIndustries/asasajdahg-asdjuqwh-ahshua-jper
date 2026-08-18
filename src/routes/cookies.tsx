import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { businessInfo } from "@/lib/business-info";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies · Jardiper SC" },
      { name: "description", content: "Qué cookies y almacenamiento local usa la web de Jardiper SC, para qué sirven y cómo aceptar, rechazar o revocar tu consentimiento." },
      { property: "og:title", content: "Política de cookies · Jardiper SC" },
      { property: "og:description", content: "Tipos de cookies utilizadas en jardiper.es y cómo gestionarlas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const revocar = () => {
    try {
      localStorage.removeItem("jardiper-cookie-consent");
    } catch {
      // noop
    }
    window.location.reload();
  };

  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de cookies"
      intro="Usamos el mínimo imprescindible: cookies técnicas para que la web funcione y almacenamiento local para recordar tus preferencias."
    >
      <LegalSection title="1. Qué es una cookie">
        <p>
          Una cookie es un pequeño archivo que un sitio guarda en tu navegador. Junto a ellas usamos
          almacenamiento local (localStorage), que funciona de forma parecida y también se describe
          aquí.
        </p>
      </LegalSection>

      <LegalSection title="2. Cookies y almacenamiento que utilizamos">
        <ul>
          <li>
            <strong>Técnicas / necesarias:</strong> sesión de acceso al área privada (Supabase Auth),
            necesarias para mantenerte identificado. No requieren consentimiento.
          </li>
          <li>
            <strong>Preferencias:</strong> <code>jardiper-cookie-consent</code> guarda si aceptaste o
            rechazaste, e idioma seleccionado en el conmutador de idiomas.
          </li>
          <li>
            <strong>Analíticas agregadas:</strong> métricas básicas de tráfico y errores del sitio,
            sin identificarte personalmente. Solo se activan si aceptas.
          </li>
        </ul>
        <p>No utilizamos cookies publicitarias ni de perfilado comercial.</p>
      </LegalSection>

      <LegalSection title="3. Cómo gestionar tu consentimiento">
        <p>
          Al entrar por primera vez te mostramos un aviso donde puedes aceptar o rechazar las cookies
          no esenciales. Puedes cambiar tu decisión cuando quieras:
        </p>
        <p>
          <button
            type="button"
            onClick={revocar}
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Revocar mi consentimiento de cookies
          </button>
        </p>
        <p>
          También puedes bloquear o eliminar cookies desde la configuración de tu navegador (Chrome,
          Firefox, Safari o Edge). Ten en cuenta que bloquear las técnicas puede impedir el acceso al
          área privada.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies de terceros">
        <p>
          Al usar el mapa de Google o el botón de WhatsApp, esos servicios pueden instalar sus propias
          cookies bajo sus políticas. También Google, si eliges iniciar sesión con tu cuenta.
        </p>
      </LegalSection>

      <LegalSection title="5. Contacto">
        <p>
          Para cualquier duda sobre esta política escríbenos a {businessInfo.email}. Consulta también
          el <Link to="/aviso-legal" className="text-primary hover:underline">aviso legal</Link> y la{" "}
          <Link to="/privacidad" className="text-primary hover:underline">política de privacidad</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
