import { useI18n } from '../i18n/index.jsx';
import { PricingSection, FAQ } from '../components/Pricing.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function PricingPage() {
  const { t } = useI18n();
  const { profile } = useAuth();
  return (
    <div className="section">
      <div className="container-x">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t('pricing.title')}</h1>
          <p className="mt-3 muted">{t('pricing.sub')}</p>
        </div>
        <PricingSection currentPlan={profile?.plan} />
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="h2 mb-8 text-center">{t('faq.title')}</h2>
          <FAQ />
        </div>
      </div>
    </div>
  );
}
