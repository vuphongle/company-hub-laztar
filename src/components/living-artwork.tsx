import type { CSSProperties } from "react";
import type { AppIconName } from "@/data/apps";

/** Original, code-built miniatures. These evoke each project, not its actual UI. */
export function LivingArtwork({ name }: { name: AppIconName }) {
  return (
    <div className={`living-art living-art-${name}`} aria-hidden="true">
      {name === "wolf" ? (
        <>
          <div className="night-disc" />
          <div className="moon-orb" />
          <div className="mountain mountain-one" />
          <div className="mountain mountain-two" />
          <div className="wolf-shadow" />
          <div className="wolf-mask">
            <div className="wolf-cheek left" />
            <div className="wolf-cheek right" />
            <i className="wolf-eye left" />
            <i className="wolf-eye right" />
            <i className="wolf-nose" />
          </div>
          <span className="night-star star-one">✦</span>
          <span className="night-star star-two">✧</span>
        </>
      ) : name === "music" ? (
        <>
          <div className="sound-ring sound-ring-one" />
          <div className="sound-ring sound-ring-two" />
          <div className="record-sleeve">
            <span />
          </div>
          <div className="turntable">
            <div className="turntable-plinth" />
            <div className="vinyl-disc">
              <div className="vinyl-label">♪</div>
            </div>
            <div className="tonearm" />
            <span className="turntable-led" />
          </div>
          <div className="equalizer">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} style={{ "--bar": i } as CSSProperties} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="data-step step-one" />
          <div className="data-step step-two" />
          <div className="data-step step-three" />
          <div className="floating-receipt">
            <div className="receipt-heading">✳</div>
            <div className="receipt-rule" />
            <div className="receipt-rule short" />
            <svg viewBox="0 0 180 100">
              <path
                d="M5 82L40 51L75 65L110 24L145 40L175 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <circle cx="175" cy="8" r="7" fill="#ff6b4a" />
            </svg>
            <div className="receipt-rule" />
            <div className="receipt-rule short" />
          </div>
          <div className="coin coin-one">✳</div>
          <div className="coin coin-two">+</div>
        </>
      )}
      <div className="miniature-base">
        <span />
      </div>
    </div>
  );
}
