/** Digits only, for tel: and wa.me links: "+260 761 809 955" → "260761809955". */
const digits = (phone: string) => phone.replace(/\D/g, "");

export const telHref = (phone: string) => `tel:+${digits(phone)}`;

/** Opens a WhatsApp chat with the number, with a greeting already typed. */
export const whatsappHref = (phone: string) =>
  `https://wa.me/${digits(phone)}?text=${encodeURIComponent("Hi Dalitso, I came across your website and wanted to get in touch.")}`;

export const mailtoHref = (email: string) => `mailto:${email}`;
