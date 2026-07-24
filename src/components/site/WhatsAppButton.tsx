import { MessageCircle } from "lucide-react";

const PHONE = "34611321620";
const MESSAGE = encodeURIComponent(
  "Hola Jardiper, me gustaría recibir información sobre vuestros productos."
);

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </a>
  );
}
