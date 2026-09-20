import { useState } from 'react';
import AdminLandingPages from './AdminLandingPages';
import AdminCustomPages from './AdminCustomPages';

type Tab = 'static' | 'landing' | 'campaign';

const TABS: { key: Tab; label: string }[] = [
  { key: 'static', label: 'Static Pages' },
  { key: 'landing', label: 'Landing Pages' },
  { key: 'campaign', label: 'Campaign Pages' },
];

const AdminContent = () => {
  const [tab, setTab] = useState<Tab>('static');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`text-xs px-4 py-2.5 -mb-px border-b-2 transition-colors ${tab === t.key ? 'border-foreground text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'static' && <AdminCustomPages />}

      {tab === 'landing' && <AdminLandingPages pageType="landing" />}

      {tab === 'campaign' && <AdminLandingPages pageType="campaign" />}
    </div>
  );
};

export default AdminContent;
