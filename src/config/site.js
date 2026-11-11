// Zentrale Firmen- und Kontaktdaten. Platzhalter in [eckigen Klammern]
// MÜSSEN vor dem Livegang durch echte Angaben ersetzt werden.
export const SITE = {
  name: 'TrueReel',
  claim: 'Faceless Videos, die laufen – ehrlich, einfach, automatisch.',
  contactEmail: 'daniweidmann@icloud.com', // später durch eigene Domain-Adresse ersetzen
  supportEmail: 'daniweidmann@icloud.com',
  company: {
    legalName: 'Truereel',
    legalForm: 'Einzelunternehmen (nicht im Handelsregister eingetragen)',
    street: 'Chriesiweg 4',
    zipCity: '8310 Grafstal',
    country: 'Schweiz',
    register: 'Kein Handelsregistereintrag',
    vatId: 'Keine MWST-Nummer',
    representative: 'Daniel Weidmann',
    phone: null,
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
