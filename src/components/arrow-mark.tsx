import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  ArrowsHorizontal,
} from "@phosphor-icons/react/ssr";

type ArrowDirection = "up-right" | "down-right" | "down" | "horizontal";

export function ArrowMark({
  direction = "up-right",
  size = 16,
}: {
  direction?: ArrowDirection;
  size?: number;
}) {
  const Icon =
    direction === "down-right"
      ? ArrowDownRight
      : direction === "down"
        ? ArrowDown
        : direction === "horizontal"
          ? ArrowsHorizontal
          : ArrowUpRight;

  return <Icon className="arrow-mark" size={size} weight="bold" aria-hidden="true" />;
}
