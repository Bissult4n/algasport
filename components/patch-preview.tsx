"use client";

import { useId } from "react";
import { asset } from "@/lib/shop-config";
import { type Backpatch, type Customization } from "@/lib/customization";
import { backOutline } from "./kimono-photo";
import { EmbroideryPreview } from "./embroidery-preview";

export function PatchPreview({ value }: { value: Customization }) {
  return value.type === "embroidery" ? (
    <EmbroideryPreview value={value} />
  ) : (
    <BackpatchPreview value={value} />
  );
}

function BackpatchPreview({ value }: { value: Backpatch }) {
  const uid = useId().replaceAll(":", "");
  const id = (s: string) => uid + s;
  const url = (s: string) => "url(#" + id(s) + ")";
  const text = value.surname || "ВАША ФАМИЛИЯ";
  const chars = Array.from(text);

  return (
    <figure className="patch-preview backpatch-preview">
      <div className="preview-label">
        <span className="live-dot" /> LIVE PREVIEW <span>IJF BACKPATCH</span>
      </div>
      <svg
        viewBox="0 0 260 285"
        role="img"
        aria-label={"Макет нашивки: " + text}
      >
        <defs>
          <clipPath id={id("photo")}>
            <path d={backOutline} />
          </clipPath>
          <filter
            id={id("contact")}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx=".3"
              dy=".8"
              stdDeviation=".65"
              floodColor="#252b35"
              floodOpacity=".35"
            />
          </filter>
          <filter id={id("warp")} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".03 .09"
              numOctaves="2"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale=".55"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <linearGradient id={id("fold")}>
            <stop stopColor="#343a41" stopOpacity=".17" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".02" />
            <stop offset=".52" stopColor="#111" stopOpacity=".08" />
            <stop offset=".6" stopColor="#fff" stopOpacity=".12" />
            <stop offset="1" stopColor="#20252c" stopOpacity=".17" />
          </linearGradient>
          <pattern
            id={id("weave")}
            width="1.6"
            height="1.6"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 .4H1.6M.4 0V1.6"
              stroke="#665f55"
              strokeOpacity=".1"
              strokeWidth=".18"
            />
            <path
              d="M0 1.2H1.6M1.2 0V1.6"
              stroke="#fff"
              strokeOpacity=".25"
              strokeWidth=".22"
            />
          </pattern>
          <path id={id("name")} d="M105 92 Q153 86 201 93" />
          <path id={id("country")} d="M107 125 Q154 119 201 126" />
          <path
            id={id("patch")}
            d="M99 72 Q152 65 208 74 L206 137 Q151 143 100 135 Z"
          />
        </defs>
        <image
          href={asset("/images/kimono/adidas-ii-back.webp")}
          width="260"
          height="500"
          clipPath={url("photo")}
        />
        <g
          transform="rotate(-1.5 152 100) translate(15.2 10.4) scale(.9)"
          filter={url("contact")}
        >
          <g filter={url("warp")}>
            <use href={"#" + id("patch")} fill="#e3e2da" />
            <path
              d="M103 77 Q151 70 204 79 L203 102 Q151 96 103 101Z"
              fill="#193c78"
            />
            <text
              fill="#f0eee8"
              fontFamily="Arial,sans-serif"
              fontWeight="800"
              fontSize="12"
            >
              <textPath
                href={"#" + id("name")}
                startOffset="50%"
                textAnchor="middle"
                textLength={chars.length > 12 ? 88 : undefined}
                lengthAdjust="spacingAndGlyphs"
              >
                {text}
              </textPath>
            </text>
            <text
              fill="#193c78"
              fontFamily="Arial,sans-serif"
              fontWeight="900"
              fontSize="22"
            >
              <textPath
                href={"#" + id("country")}
                startOffset="50%"
                textAnchor="middle"
              >
                {value.country || "KAZ"}
              </textPath>
            </text>
            <use href={"#" + id("patch")} fill={url("fold")} />
            <use href={"#" + id("patch")} fill={url("weave")} />
            <path
              d="M101 74 Q152 67 206 76 L204 135 Q151 140 102 133Z"
              fill="none"
              stroke="#a9a59a"
              strokeOpacity=".6"
              strokeWidth=".4"
              strokeDasharray=".8 1.1"
            />
          </g>
        </g>
      </svg>
      <div className="preview-placement">Спина / фиксированное размещение</div>
      <figcaption>
        Пример на реальном фото Adidas Champion II. Макет показывает размещение,
        а не точный размер нанесения.
      </figcaption>
    </figure>
  );
}
