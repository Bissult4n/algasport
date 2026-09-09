import { owners } from "@/lib/shop-content";
import { asset } from "@/lib/shop-config";

export function OwnersSection() {
  return (
    <section
      className="owners-section container-frame"
      aria-labelledby="owners-title"
    >
      <div className="owners-intro">
        <div>
          <p className="label">ЛЮДИ ЗА МАГАЗИНОМ</p>
          <h2 id="owners-title">
            СДЕЛАНО
            <br />
            <span>ДЗЮДОИСТАМИ.</span>
          </h2>
        </div>
        <div>
          <p className="owners-statement">
            Мы продаём то, что сами готовы надеть на татами.
          </p>
          <p className="muted">
            У магазина два владельца: братья, оба с чёрными поясами по дзюдо.
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
                  alt={owner.name || "Владелец ALGA Sport Shop"}
                  width="400"
                  height="500"
                  loading="lazy"
                />
              ) : (
                <div className="owner-photo-placeholder">
                  <span aria-hidden="true">ALGA</span>
                  <p>Фотография владельца</p>
                </div>
              )}
              <span className="owner-number">0{i + 1}</span>
            </div>
            <div className="owner-copy">
              <p className="label">СОВЛАДЕЛЕЦ ALGA</p>
              <h3>{owner.name || "Имя владельца"}</h3>
              <p className="owner-belt">
                <span aria-hidden="true" />
                Чёрный пояс{owner.dan ? " · " + owner.dan : ""}
              </p>
              <p className="owner-description">
                {owner.description ||
                  "Один из братьев, создавших ALGA Sport Shop."}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
