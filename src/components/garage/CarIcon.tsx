interface CarIconProps {
  color: string;
  className?: string;
}

const WHEEL_RADIUS = 8;
const HUBCAP_RADIUS = 3;
const LEFT_WHEEL_X = 28;
const RIGHT_WHEEL_X = 92;
const WHEEL_Y = 36;

export default function CarIcon({ color, className }: CarIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 46"
      width="45"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x={8} y={22} width={104} height={14} rx={7} fill={color} />
      <rect x={36} y={8} width={48} height={18} rx={8} fill={color} />
      <rect x={44} y={12} width={32} height={10} rx={4} fill="rgba(0,0,0,0.3)" />
      <circle cx={LEFT_WHEEL_X} cy={WHEEL_Y} r={WHEEL_RADIUS} fill="#1a1a1a" />
      <circle cx={RIGHT_WHEEL_X} cy={WHEEL_Y} r={WHEEL_RADIUS} fill="#1a1a1a" />
      <circle cx={LEFT_WHEEL_X} cy={WHEEL_Y} r={HUBCAP_RADIUS} fill="#555" />
      <circle cx={RIGHT_WHEEL_X} cy={WHEEL_Y} r={HUBCAP_RADIUS} fill="#555" />
    </svg>
  );
}
