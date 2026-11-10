// Zentrale Firmen- und Kontaktdaten. Platzhalter in [eckigen Klammern]
// MÜSSEN vor dem Livegang durch echte Angaben ersetzt werden.
export const SITE = {
  name: 'TrueReel',
  claim: 'Faceless Videos, die laufen – ehrlich, einfach, automatisch.',
  contactEmail: 'hallo@truereel.app', // TODO: echte Adresse
  supportEmail: 'support@truereel.app', // TODO: echte Adresse
  company: {
    legalName: '[Firmenname / Vor- und Nachname]',
    legalForm: '[Rechtsform, z. B. Einzelunternehmen / GmbH]',
    street: '[Strasse Nr.]',
    zipCity: '[PLZ Ort]',
    country: '[Land]',
    register: '[Handelsregister / UID-Nr., falls vorhanden]',
    vatId: '[MWST-/USt-IdNr., falls vorhanden]',
    representative: '[Vertretungsberechtigte Person]',
    phone: '[Telefon, optional]',
  },
  // Social Proof erst einschalten, wenn echte Zahlen / Stimmen vorliegen.
  showSocialProof: false,
  socialProof: {
    usersCount: null, // z. B. 1200 – nur echte Zahlen eintragen
    videosCreated: null,
    testimonials: [
      // { quote: '…', name: '…', role: '…' }  ← nur mit Einverständnis echter Nutzer
    ],
  },
};
