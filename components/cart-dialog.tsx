"use client";
import { getProduct } from "@/lib/catalog";
import {
  buildOrderMessage,
  cartTotal,
  itemTotal,
  priceText,
  whatsappUrl,
  type CartItem,
} from "@/lib/orders";
import { INSTAGRAM_URL } from "@/lib/shop-config";
import { useState } from "react";
import { placementText } from "@/lib/customization";
import { Arrow, Dialog, Photo, Quantity } from "./shop-ui";

export function CartDialog({
  items,
  onClose,
  onQuantity,
  onRemove,
  onEdit,
  onOrder,
}: {
  items: CartItem[];
  onClose: () => void;
  onQuantity: (key: string, q: number) => void;
  onRemove: (key: string) => void;
  onEdit: (item: CartItem) => void;
  onOrder: () => void;
}) {
  return (
    <Dialog title="Ваша корзина" onClose={onClose}>
      <div className="cart-body">
        {!items.length ? (
          <div className="empty-cart">
            <span className="label">Начало вашего пути</span>
            <h3>Здесь будет ваша экипировка</h3>
            <p className="muted">
              Выберите кимоно, FitLine или снаряжение в каталоге.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Перейти в каталог <Arrow />
            </button>
          </div>
        ) : (
          items.map((item) => {
            const p = getProduct(item.productId)!;
            return (
              <article className="cart-line" key={item.key}>
                <div className="cart-photo">
                  <Photo src={p.images[0]} alt={p.name} />
                </div>
                <div className="cart-line-detail">
                  <h3>{p.name}</h3>
                  <p className="muted">
                    {item.size ||
                      (p.category === "kimono" ? "Размер: подбор" : "")}{" "}
                    {item.variant}
                  </p>
                  {item.customization.enabled && (
                    <p className="personalization-summary">
                      {item.customization.type === "backpatch" ? (
                        <>
                          IJF backpatch: {item.customization.surname} /{" "}
                          {item.customization.country}
                          <br />
                          Спина · фиксировано
                        </>
                      ) : (
                        <>
                          Вышивка: {item.customization.text}
                          <br />
                          {item.customization.legacyNote ||
                            placementText(item.customization)}{" "}
                          · {item.customization.color} ·{" "}
                          {item.customization.font}
                          <br />
                          {item.customization.orientation === "vertical"
                            ? "Вертикально"
                            : "Горизонтально"}
                        </>
                      )}
                    </p>
                  )}
                  <strong>{priceText(itemTotal(item))}</strong>
                  <div className="cart-line-tools">
                    <Quantity
                      value={item.quantity}
                      onChange={(q) => onQuantity(item.key, q)}
                    />
                    <button type="button" onClick={() => onEdit(item)}>
                      Изменить
                    </button>
                    <button
                      type="button"
                      aria-label={"Удалить " + p.name}
                      onClick={() => onRemove(item.key)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
      {!!items.length && (
        <div className="cart-footer">
          <div>
            <span>Итого</span>
            <strong>{priceText(cartTotal(items))}</strong>
          </div>
          <p className="muted small-copy">
            Цены, наличие и доставку подтвердим в переписке.
          </p>
          <button className="btn-primary" onClick={onOrder}>
            Оформить заказ <Arrow />
          </button>
        </div>
      )}
    </Dialog>
  );
}
export function OrderDialog({
  items,
  onClose,
}: {
  items: CartItem[];
  onClose: () => void;
}) {
  const message = items.length
    ? buildOrderMessage(items)
    : "Здравствуйте! Хочу узнать о товарах ALGA Sport Shop.";
  const url = whatsappUrl(message);
  const [copyStatus, setCopyStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("Текст скопирован");
    } catch {
      setCopyStatus("Выделите текст заказа и скопируйте его вручную.");
    }
  }
  return (
    <Dialog title="Ваш заказ готов к обсуждению" onClose={onClose}>
      <div className="order-body">
        <p className="muted">
          {url
            ? "Проверьте детали и перейдите в WhatsApp. Сообщение отправите вы сами."
            : "WhatsApp магазина пока не подключен. Можно скопировать заказ и отправить его в Instagram Direct."}
        </p>
        <label className="input-label">
          Текст заказа
          <textarea aria-label="Текст заказа" readOnly value={message} />
        </label>
        <p className="small-copy muted">
          Заказ еще не отправлен. Товары останутся в корзине до вашего
          подтверждения и удаления.
        </p>
        <div className="order-buttons">
          {url ? (
            <a
              className="btn-primary"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть WhatsApp <Arrow />
            </a>
          ) : (
            <button className="btn-primary" disabled>
              WhatsApp пока не подключен
            </button>
          )}
          <button className="btn-secondary" onClick={copy}>
            Скопировать заказ
          </button>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Написать в Instagram <Arrow />
          </a>
        </div>
        <p role="status" className="small-copy">
          {copyStatus}
        </p>
      </div>
    </Dialog>
  );
}
