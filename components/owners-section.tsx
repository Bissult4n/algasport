"use client";

import { owners } from "@/lib/shop-content";
import { asset } from "@/lib/shop-config";
import { useI18n } from "@/lib/i18n/context";

export function OwnersSection() {
  const { t } = useI18n();
  return (
    <section
      className="owners-section container-frame"
      aria-labelledby="owners-title"
    >
      <div className="owners-intro">
        <div>
          <p className="label">{t("owners.eyebrow")}</p>
          <h2 id="owners-title">
            {t("owners.title1")}
            <br />
            <span>{t("owners.title2")}</span>
          </h2>
        </div>
        <div>
          <p className="owners-statement">
            {t("owners.statement")}
          </p>
          <p className="muted">
            {t("owners.copy")}
          </p>
        </div>
      </div>
      <div className="owner-grid">
        {owners.map((owner, i) => (
          <article className="owner-card" key={owner.id}>
            <div className="owner-photo">
              {owner.photo ? (
                <img
                  src={asset(owner.photo)}
                  alt={owner.name || t("owners.alt")}
                  width="400"
                  height="500"
                  loading="lazy"
                />
              ) : (
                <div className="owner-photo-placeholder">
                  <span aria-hidden="true">ALGA</span>
                  <p>{t("owners.photo")}</p>
                </div>
              )}
              <span className="owner-number">0{i + 1}</span>
            </div>
            <div className="owner-copy">
              <p className="label">{t("owners.role")}</p>
              <h3>{owner.name || t("owners.name")}</h3>
              <p className="owner-belt">
                <span aria-hidden="true" />
                {t("owners.belt")}{owner.dan ? " · " + owner.dan : ""}
              </p>
              <p className="owner-description">
                {owner.description ||
                  t("owners.description")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
