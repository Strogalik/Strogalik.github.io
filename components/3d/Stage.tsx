export function Stage({
  kind = "curve",
  label,
  className = "",
}: {
  kind?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`pipe-stage ${className}`} data-route={kind}>
      {label && <span className="stage-label">{label}</span>}
      <div className="pipe-fallback" aria-hidden="true">
        <img
          src={`/assets/fallback-${kind}.png`}
          alt=""
          width="620"
          height="560"
          loading="lazy"
        />
      </div>
      {kind === "hero" && (
        <div className="scene-loading">
          <span className="loading-ring" />
          Подготавливаем газовую трассу
        </div>
      )}
    </div>
  );
}
