"use client";

import { useId } from "react";
import { asset } from "@/lib/shop-config";
import {
  embroideryColors,
  placementText,
  type Customization,
} from "@/lib/customization";
import { frontOutline, backOutline } from "./kimono-photo";

export function PatchPreview({ value }: { value: Customization }) {
  const uid = useId().replaceAll(":", "");
  const id = (s: string) => uid + s;
  const url = (s: string) => "url(#" + id(s) + ")";
  const back = value.type === "backpatch";
  const text = back ? value.surname || "ВАША ФАМИЛИЯ" : value.text || "柔道";
  const family =
    !back && value.font !== "Modern"
      ? 'Georgia,"Yu Mincho","Noto Serif CJK JP",serif'
      : 'Arial,"Yu Gothic","Microsoft YaHei",sans-serif';
  const chars = Array.from(text);
  const vertical = !back && value.orientation === "vertical";
  // The reference indicates zones, not lettering dimensions: keep both stitch areas compact.
  const stitchY = !back && value.placement === "Штаны" ? 291 : 247;

  return (
    <figure
      className={
        "patch-preview " + (back ? "backpatch-preview" : "embroidery-preview")
      }
    >
      <div className="preview-label">
        <span className="live-dot" /> LIVE PREVIEW{" "}
        <span>{back ? "IJF BACKPATCH" : "ИМЕННАЯ ВЫШИВКА"}</span>
      </div>
      <svg
        viewBox={back ? "0 0 260 285" : "0 145 281 245"}
        role="img"
        aria-label={"Макет " + (back ? "нашивки" : "вышивки") + ": " + text}
      >
        <defs>
          <clipPath id={id("photo")}>
            <path d={back ? backOutline : frontOutline} />
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
          <filter
            id={id("thread-shadow")}
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
          >
            <feDropShadow
              dx=".12"
              dy=".2"
              stdDeviation=".12"
              floodColor="#34302a"
              floodOpacity=".42"
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
          <pattern
            id={id("thread")}
            width=".65"
            height=".65"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <path
              d="M0 .2H.65"
              stroke="#fff"
              strokeWidth=".13"
              strokeOpacity=".45"
            />
            <path
              d="M0 .6H.65"
              stroke="#151d23"
              strokeWidth=".09"
              strokeOpacity=".4"
            />
          </pattern>
          <path id={id("name")} d="M105 92 Q153 86 201 93" />
          <path id={id("country")} d="M107 125 Q154 119 201 126" />
          <path
            id={id("patch")}
            d="M99 72 Q152 65 208 74 L206 137 Q151 143 100 135 Z"
          />
          {!back && (
            <g
              id={id("lettering")}
              fontFamily={family}
              fontStyle={value.font === "Brush" ? "italic" : "normal"}
              fontWeight={value.font === "Brush" ? 700 : 600}
            >
              {vertical ? (
                chars.map((char, i) => (
                  <text
                    key={i}
                    x="0"
                    y={i * Math.min(9, 31 / chars.length)}
                    fontSize={Math.min(8.5, 30 / chars.length)}
                    textAnchor="middle"
                  >
                    {char}
                  </text>
                ))
              ) : (
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fontSize="7.5"
                  textLength={chars.length > 7 ? 39 : undefined}
                  lengthAdjust="spacingAndGlyphs"
                >
                  {text}
                </text>
              )}
            </g>
          )}
        </defs>
        <image
          href={asset(
            back
              ? "/images/kimono/adidas-ii-back.webp"
              : "/images/kimono/adidas-ii-0.webp",
          )}
          width={back ? 260 : 281}
          height="500"
          clipPath={url("photo")}
        />
        {back ? (
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
        ) : (
          <g
            data-embroidery-zone={value.placement}
            transform={"translate(94 " + stitchY + ") rotate(-4)"}
          >
            <use
              href={"#" + id("lettering")}
              fill={embroideryColors[value.color]}
              filter={url("thread-shadow")}
            />
            <use href={"#" + id("lettering")} fill={url("thread")} />
          </g>
        )}
      </svg>
      <div className="preview-placement">
        {back ? "Спина / фиксированное размещение" : placementText(value)}
      </div>
      <figcaption>
        Пример на реальном фото Adidas Champion II. Макет показывает размещение,
        а не точный размер нанесения.
      </figcaption>
    </figure>
  );
}
