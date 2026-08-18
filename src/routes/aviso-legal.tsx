import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/site/LegalPage";
import { businessInfo } from "@/lib/business-info";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal · Jardiper SC · Vivero en Fraga" },
      { name: "description", content: "Aviso legal de Jardiper SC: titular del sitio, datos identificativos, condiciones de uso, propiedad intelectual y responsabilidad de la web del vivero de Fraga." },
      { property: "og:title", content: "Aviso legal · Jardiper SC" },
      { property: "og:description", content: "Datos identificativos y condiciones de uso de la web de Jardiper SC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/aviso-legal" }],
  }),
  component: AvisoLegalPage,
});

function AvisoLegalPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Aviso legal"
      intro="Información general sobre el titular de esta web y las condiciones de uso del sitio."
    >
      <LegalSection title="1. Titular del sitio web">
        <ul>
          <li><strong>Denominación:</strong> Jardiper SC</li>
          <li><strong>Domicilio:</strong> {businessInfo.address.streetAddress}, {businessInfo.address.postalCode} {businessInfo.address.addressLocality} ({businessInfo.address.addressRegion})</li>
          <li><strong>Teléfonos:</strong> 974 47 21 58 · 611 32 16 20</li>
          <li><strong>Email:</strong> {businessInfo.email}</li>
          <li><strong>Actividad:</strong> vivero y garden center</li>
        </ul>
        <p>
          Si necesitas datos registrales o fiscales adicionales, puedes solicitarlos escribiendo a{" "}
          {businessInfo.email}.
        </p>
      </LegalSection>

      <LegalSection title="2. Objeto y condiciones de uso">
        <p>
          Esta web tiene carácter informativo sobre los productos y servicios del vivero. El acceso y
          la navegación implican aceptar este aviso legal. Te comprometes a usar el sitio conforme a
          la ley, sin realizar actividades que puedan dañar, sobrecargar o impedir su funcionamiento
          normal, ni intentar accesos no autorizados a áreas privadas.
        </p>
      </LegalSection>

      <LegalSection title="3. Catálogo, precios y disponibilidad">
        <p>
          Los contenidos del catálogo (variedades, fechas de cultivo, materiales) son orientativos y
          pueden estar incompletos o desactualizados. La disponibilidad real de plantas y materiales
          depende de la temporada y del stock del vivero, por lo que recomendamos contactar con
          nosotros antes de desplazarte.
        </p>
      </LegalSection>

      <LegalSection title="4. Propiedad intelectual e industrial">
        <p>
          Los textos, fotografías, guías, calendarios de cultivo, logotipos y demás elementos del
          sitio son titularidad de Jardiper SC o se utilizan con autorización. No se permite su
          reproducción o distribución con fines comerciales sin consentimiento previo por escrito. Sí
          puedes descargar e imprimir las guías y calendarios en PDF para uso personal.
        </p>
      </LegalSection>

      <LegalSection title="5. Enlaces a terceros">
        <p>
          El sitio puede incluir enlaces a servicios de terceros (mapas, redes sociales, WhatsApp).
          Jardiper SC no controla ni se responsabiliza de sus contenidos ni de sus políticas de
          privacidad.
        </p>
      </LegalSection>

      <LegalSection title="6. Responsabilidad">
        <p>
          Los consejos de cultivo publicados son recomendaciones generales basadas en la experiencia
          del vivero en el Bajo Cinca; los resultados dependen del clima, el suelo y el manejo de cada
          huerto. Jardiper SC no se responsabiliza de daños derivados del uso de la información del
          sitio ni de interrupciones técnicas ajenas a su control.
        </p>
      </LegalSection>

      <LegalSection title="7. Legislación aplicable">
        <p>
          Este aviso legal se rige por la legislación española. Para cualquier controversia serán
          competentes los juzgados y tribunales del domicilio del titular, salvo que la normativa de
          consumo disponga otro fuero.
        </p>
        <p>
          Consulta también nuestra <Link to="/privacidad" className="text-primary hover:underline">política de privacidad</Link>{" "}
          y la <Link to="/cookies" className="text-primary hover:underline">política de cookies</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
