import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { businessInfo } from "@/lib/business-info";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad · Jardiper SC" },
      { name: "description", content: "Cómo trata Jardiper SC tus datos personales: finalidades, base legal, plazos de conservación, encargados como Supabase y cómo ejercer tus derechos RGPD." },
      { property: "og:title", content: "Política de privacidad · Jardiper SC" },
      { property: "og:description", content: "Tratamiento de datos, base legal y derechos RGPD en la web del vivero Jardiper." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/privacidad" }],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Política de privacidad"
      intro="Qué datos recogemos, para qué los usamos y cómo puedes controlarlos."
    >
      <LegalSection title="1. Responsable del tratamiento">
        <ul>
          <li><strong>Responsable:</strong> Jardiper SC</li>
          <li><strong>Dirección:</strong> {businessInfo.address.streetAddress}, {businessInfo.address.postalCode} {businessInfo.address.addressLocality} ({businessInfo.address.addressRegion})</li>
          <li><strong>Contacto:</strong> {businessInfo.email} · 974 47 21 58</li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Datos que tratamos y finalidades">
        <ul>
          <li>
            <strong>Formulario de contacto:</strong> nombre, apellidos, email, teléfono opcional y el
            mensaje. Finalidad: atender tu consulta o pedido.
          </li>
          <li>
            <strong>Registro y acceso a la cuenta:</strong> email e identificador de usuario (y, si
            entras con Google, el email y nombre que Google nos comparte). Finalidad: crear y
            gestionar tu cuenta y el acceso al área privada.
          </li>
          <li>
            <strong>Datos de tráfico y uso:</strong> páginas visitadas, tipo de dispositivo y
            estadísticas agregadas. Finalidad: mantener el servicio, detectar errores y mejorar la
            web.
          </li>
        </ul>
        <p>No elaboramos perfiles comerciales ni tomamos decisiones automatizadas sobre ti.</p>
      </LegalSection>

      <LegalSection title="3. Base legal">
        <ul>
          <li><strong>Consentimiento:</strong> al enviar el formulario, registrarte o aceptar cookies no esenciales.</li>
          <li><strong>Ejecución de la relación:</strong> gestión de tu cuenta y de los pedidos o consultas.</li>
          <li><strong>Interés legítimo:</strong> seguridad del sitio y estadísticas agregadas de uso.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Conservación">
        <p>
          Conservamos los mensajes de contacto el tiempo necesario para atenderlos y durante los
          plazos legales aplicables. Los datos de tu cuenta se conservan mientras la mantengas activa;
          si solicitas su eliminación, la borramos salvo obligación legal de conservación.
        </p>
      </LegalSection>

      <LegalSection title="5. Destinatarios y encargados">
        <p>
          No vendemos tus datos ni los cedemos a terceros con fines comerciales. Utilizamos
          proveedores tecnológicos que actúan como encargados del tratamiento:
        </p>
        <ul>
          <li><strong>Supabase</strong> — autenticación y base de datos del sitio.</li>
          <li><strong>Proveedor de alojamiento web</strong> — publicación y entrega del sitio.</li>
          <li><strong>Google</strong> — solo si eliges iniciar sesión con tu cuenta de Google.</li>
        </ul>
        <p>
          Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo, en cuyo caso se
          amparan en cláusulas contractuales tipo aprobadas por la Comisión Europea.
        </p>
      </LegalSection>

      <LegalSection title="6. Tus derechos">
        <p>
          Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad escribiendo a {businessInfo.email}, indicando el derecho que ejerces. También
          puedes retirar tu consentimiento en cualquier momento y presentar una reclamación ante la
          Agencia Española de Protección de Datos (aepd.es).
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad y menores">
        <p>
          Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (acceso
          restringido, cifrado en tránsito y control de permisos en la base de datos). El registro
          está dirigido a mayores de 14 años.
        </p>
        <p>
          Consulta también el <Link to="/aviso-legal" className="text-primary hover:underline">aviso legal</Link>{" "}
          y la <Link to="/cookies" className="text-primary hover:underline">política de cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
