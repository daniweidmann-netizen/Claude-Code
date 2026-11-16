// Beispielvideo-Seite für die Firmen-Akquise: truereel.ch/beispiel/<slug>
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';

const BASE = 'https://rocgdmpjiwytnsjgjpcj.supabase.co/storage/v1/object/public/samples';
const SAMPLES = {
  'coiffeur-haarefaerben': '3 Fehler beim Haarefärben zu Hause',
  'coiffeur-keratin': 'Was bringt eine Keratin-Behandlung wirklich?',
  'coiffeur-haarverlaengerung': 'Haarverlängerung – 3 Dinge, die man wissen sollte',
  'coiffeur-brautfrisur': 'Die Braut-Frisur richtig planen',
  'fitness-ruecken': '3 Übungen für einen starken Rücken',
  'fitness-stoffwechseltraining': 'Was ist eigentlich Stoffwechseltraining?',
  'fitness-pilates-kraft': 'Pilates oder Krafttraining – was passt zu mir?',
  'restaurant-gericht-der-woche': 'Das Gericht der Woche in 30 Sekunden',
  'restaurant-roesti': 'Das Geheimnis einer guten Rösti',
  'restaurant-pho': 'Was macht eine echte Phở aus?',
  'restaurant-pizza': 'Das Geheimnis einer guten Pizza',
  'baeckerei-brot': 'Warum gutes Brot Zeit braucht',
  'baeckerei-sauerteig': '3 überraschende Fakten über Sauerteig',
  'garage-winterreifen': 'Winterreifen – 3 Dinge, die viele vergessen',
  'schreinerei-holz': 'Massivholz oder Furnier – der Unterschied',
};

export default function Sample() {
  const { slug } = useParams();
  const title = SAMPLES[slug];
  useEffect(() => {
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m);
    return () => m.remove();
  }, []);
  if (!title) return <div className="section"><div className="container-x text-center"><h1 className="text-2xl font-bold">Video nicht gefunden</h1><Link to="/firmen" className="btn-primary mt-6">Zum Video-Service für Firmen</Link></div></div>;
  return (
    <div className="section">
      <div className="container-x mx-auto max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-accent-700 dark:text-accent-400">Beispielvideo</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <video className="mx-auto mt-6 aspect-[9/16] w-full max-w-[360px] rounded-2xl bg-black shadow-xl" src={`${BASE}/${slug}.mp4`} controls playsInline preload="metadata" />
        <p className="mt-4 text-sm muted">So könnten die Kurzvideos für Ihren Betrieb aussehen – mit Ihren Themen, auf Wunsch mit eigenen Fotos und Logo. Bilder und Stimme sind KI-generiert und werden als solche gekennzeichnet.</p>
        <Link to="/firmen#anfrage" className="btn-primary mt-6 w-full py-3.5 text-base">Persönliches Beispielvideo anfragen – kostenlos</Link>
        <Link to="/firmen" className="btn-outline mt-3 w-full">Pakete ab CHF 290 / Monat ansehen</Link>
      </div>
    </div>
  );
}
