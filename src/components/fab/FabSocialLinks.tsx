import { useStoreSettings } from '@/hooks/useSupabase';
import { Phone } from 'lucide-react';
import { getVisibleSocials, text, type SocialSurface } from '@/lib/siteSettings';

const FbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z"/></svg>
);
const IgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.4.53A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.53 9.4.53 9.4.53s7.5 0 9.4-.53a3 3 0 0 0 2.1-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6Z"/></svg>
);
const TtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82a4.28 4.28 0 0 1-1-2.82h-3.4v13.6a2.55 2.55 0 0 1-2.55 2.55 2.55 2.55 0 1 1 .76-4.98v-3.5a6 6 0 1 0 5.18 5.94V9.4a7.7 7.7 0 0 0 4.5 1.44V7.43a4.3 4.3 0 0 1-3.49-1.6Z"/></svg>
);
const InIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V9.97H5.56v8.37h2.78ZM6.95 8.73a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22Zm11.39 9.61v-4.59c0-2.45-1.31-3.59-3.06-3.59a2.64 2.64 0 0 0-2.39 1.31v-1.12h-2.78c.04.78 0 8.37 0 8.37h2.78v-4.67c0-.25.02-.5.09-.68.2-.5.66-1.02 1.43-1.02 1 0 1.41.77 1.41 1.9v4.47h2.79Z"/></svg>
);
const WaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);
const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2.01.03-2.88.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.49c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.49 1.81 1.79 0 3.16-1.89 3.16-4.61 0-2.41-1.73-4.1-4.21-4.1-2.87 0-4.55 2.15-4.55 4.37 0 .87.33 1.8.75 2.31.08.1.09.19.07.29-.08.32-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.97-.53-2.29-1.15l-.62 2.37c-.23.86-.83 1.95-1.24 2.61.94.29 1.92.45 2.95.45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
);
const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
);
const TgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
);
const MsgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.14.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.54-.04 1.01.28 2.09.43 3.29.43 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm6 7.46l-2.94 4.66c-.47.74-1.47.93-2.18.41l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.18-.41l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63z"/></svg>
);
const ThIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.18 2c2.7 0 4.77.86 6.15 2.56 1.01 1.25 1.62 2.96 1.81 5.1l-1.93.24c-.16-1.71-.62-3-1.36-3.91-.97-1.19-2.46-1.8-4.66-1.8-2.06 0-3.6.62-4.62 1.85-1 1.21-1.51 2.97-1.51 5.27 0 2.31.52 4.07 1.55 5.27 1.03 1.21 2.55 1.82 4.55 1.82 1.84 0 3.07-.42 3.93-1.18.62-.55.99-1.25 1.12-2.1-.55-.34-1.2-.6-1.95-.78-.16 1.04-.78 1.74-1.93 1.93-1.31.21-2.6-.32-2.79-1.62-.13-.86.29-1.86 1.94-2.16.66-.12 1.32-.13 1.96-.06-.02-.5-.16-.9-.41-1.18-.32-.36-.83-.55-1.5-.56-.85 0-1.46.36-1.84.93l-1.6-1.08c.72-1.06 1.83-1.66 3.42-1.67h.05c2.45.02 3.92 1.51 4.06 4.09l.01.05c.49.27.94.6 1.32 1 .77-1.06 1.16-2.5 1.16-4.32 0-2.66-.62-4.7-1.8-6.16C16.92 2.79 14.84 2 12.18 2z"/></svg>
);

const ICONS: Record<string, React.FC> = {
  facebook: FbIcon, instagram: IgIcon, youtube: YtIcon, tiktok: TtIcon,
  linkedin: InIcon, pinterest: PinIcon, twitter: XIcon, whatsapp: WaIcon,
  telegram: TgIcon, messenger: MsgIcon, threads: ThIcon,
};

interface FabSocialLinksProps {
  /** 'bar' = compact icons for the dark top bar; 'circle' = white rounded circles for the footer */
  variant?: 'bar' | 'circle';
  className?: string;
  /** Which visibility surface to filter by. Defaults from variant (bar→header, circle→footer). */
  surface?: SocialSurface;
}

const FabSocialLinks = ({ variant = 'bar', className = '', surface }: FabSocialLinksProps) => {
  const { data: s } = useStoreSettings();
  const phone = text(s, 'business_phone', text(s, 'contact_phone1', text(s, 'footer_phone', '')));
  const resolvedSurface: SocialSurface = surface ?? (variant === 'circle' ? 'footer' : 'header');
  const links = getVisibleSocials(s, resolvedSurface).map((l) => ({
    key: l.key,
    label: l.label,
    href: l.url,
    Icon: ICONS[l.key] || FbIcon,
  }));

  if (variant === 'circle') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {links.map(({ key, label, href, Icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-fab-accent"
          >
            <Icon />
          </a>
        ))}
        {phone && (
          <a
            href={`tel:${phone}`}
            aria-label="Call us"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-fab-accent"
          >
            <Phone size={15} />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {links.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-7 w-7 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon />
        </a>
      ))}
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call us"
          className="grid h-7 w-7 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Phone size={14} />
        </a>
      )}
    </div>
  );
};

export default FabSocialLinks;