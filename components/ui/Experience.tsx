"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { LeadForm } from "./LeadForm";
import { services } from "@/content/local";
import { analytics } from "@/lib/analytics";
type Modal =
  | { kind: "lead"; serviceId?: string }
  | { kind: "service"; serviceId: string }
  | { kind: "image"; src: string; caption: string }
  | null;
const ExperienceContext = createContext<(modal: Modal) => void>(() => {});
export function Experience({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<Modal>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  function openModal(next: Modal) {
    if (next && !modal)
      returnFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    setModal(next);
  }
  const service =
    modal?.kind === "service"
      ? services.find((s) => s.id === modal.serviceId)
      : undefined;
  return (
    <ExperienceContext.Provider value={openModal}>
      {children}
      <Dialog.Root
        open={!!modal}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content
            className={`dialog ${modal?.kind === "image" ? "image-dialog" : ""}`}
            aria-describedby="dialog-description"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              returnFocus.current?.focus();
            }}
          >
            <Dialog.Close
              className="icon-button dialog-close"
              aria-label="Закрыть окно"
            >
              <X size={23} />
            </Dialog.Close>
            {modal?.kind === "lead" && (
              <>
                <span className="eyebrow">ОБСУДИМ ВАШ ДОМ</span>
                <Dialog.Title>Начнём с расчёта.</Dialog.Title>
                <Dialog.Description id="dialog-description">
                  Расскажите о задаче — это первый шаг к понятному плану работ.
                </Dialog.Description>
                <LeadForm serviceId={modal.serviceId} />
              </>
            )}
            {service && (
              <>
                <span className="eyebrow">НАПРАВЛЕНИЕ РАБОТ</span>
                <Dialog.Title>{service.title}</Dialog.Title>
                <Dialog.Description id="dialog-description">
                  {service.summary}
                </Dialog.Description>
                <ul className="scope-list">
                  {service.scope.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="small muted">
                  Точный состав, сроки и стоимость согласуются для вашего
                  объекта.
                </p>
                <button
                  className="button"
                  onClick={() =>
                    setModal({ kind: "lead", serviceId: service.id })
                  }
                >
                  Обсудить задачу <ArrowUpRight size={18} />
                </button>
                <a className="text-link" href={`/services/${service.id}/`}>
                  Открыть страницу услуги
                </a>
              </>
            )}
            {modal?.kind === "image" && (
              <>
                <Dialog.Title className="image-title">
                  {modal.caption}
                </Dialog.Title>
                <Dialog.Description
                  id="dialog-description"
                  className="small muted"
                >
                  Материал с действующего сайта РусГаз.
                </Dialog.Description>
                <img
                  src={modal.src}
                  alt={modal.caption}
                  width="1000"
                  height="700"
                />
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ExperienceContext.Provider>
  );
}
export function LeadButton({
  children = "Получить расчёт",
  serviceId,
  className = "button",
}: {
  children?: ReactNode;
  serviceId?: string;
  className?: string;
}) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className={className}
      onClick={() => {
        analytics.track("lead_open");
        open({ kind: "lead", serviceId });
      }}
    >
      {children}
      <ArrowUpRight size={19} />
    </button>
  );
}
export function ServiceButton({
  id,
  children,
  className = "service-link",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className={className}
      onClick={() => {
        analytics.track("service_open", { serviceId: id });
        open({ kind: "service", serviceId: id });
      }}
    >
      {children}
    </button>
  );
}
export function ImageButton({
  src,
  caption,
}: {
  src: string;
  caption: string;
}) {
  const open = useContext(ExperienceContext);
  return (
    <button
      className="photo-button"
      onClick={() => open({ kind: "image", src, caption })}
      aria-label={`Увеличить: ${caption}`}
    >
      <img src={src} alt={caption} width="800" height="540" loading="lazy" />
      <span>
        <ArrowUpRight size={22} />
      </span>
    </button>
  );
}
