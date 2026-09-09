"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { asset } from "@/lib/shop-config";

export function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M3 10h13M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M5.5 8.5h13l1 11h-15l1-11ZM9 9V6.5a3 3 0 0 1 6 0V9"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
export function BrandMark() {
  return (
    <img
      src={asset("/images/alga-mark.webp")}
      alt=""
      width="44"
      height="44"
      className="brand-mark"
    />
  );
}
export function Photo({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return src ? (
    <img
      src={asset(src)}
      alt={alt}
      className={className}
      width="800"
      height="800"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  ) : (
    <div className={"photo-placeholder " + className}>
      <span aria-hidden="true">ALGA</span>
      <small>Фотография уточняется</small>
    </div>
  );
}
export function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"shop-dialog theme-root " + (wide ? "wide" : "")}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-head">
        <div>
          <p className="label">ALGA SPORT SHOP</p>
          <h2>{title}</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Закрыть"
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="Уменьшить количество"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output aria-label="Количество">{value}</output>
      <button
        type="button"
        aria-label="Увеличить количество"
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
