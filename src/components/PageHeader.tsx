import type { ReactNode } from 'react';

export function PageHeader({ kicker, title, description, actions }: { kicker?:string; title:string; description?:string; actions?:ReactNode }) {
  return (
    <header className="page-header">
      <div>
        {kicker && <div className="page-kicker">{kicker}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
