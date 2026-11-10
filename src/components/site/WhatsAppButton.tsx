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
      className="fixed bottom-24 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden>
        <path d="M16.04 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.72 6.39L3.2 28.8l6.6-1.72a12.77 12.77 0 0 0 6.24 1.6h.01c7.05 0 12.79-5.74 12.79-12.8 0-3.42-1.33-6.63-3.75-9.04a12.7 12.7 0 0 0-9.05-3.75Zm0 23.31h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4 1.05 1.07-3.9-.25-.4a10.58 10.58 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.5 1.11 7.51 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.6-10.65 10.6Zm5.83-7.94c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66s1.14 3.08 1.3 3.29c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}

