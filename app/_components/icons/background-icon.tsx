export const BackgroundIcon = ({
  width = 75,
  height = 75,
  ...props
}: React.ComponentProps<"svg">) => (
  <svg
    width={width}
    height={height}
    fill="none"
    aria-hidden="true"
    data-side="bottom-right"
    {...props}
  >
    <path
      stroke="url(#a)"
      strokeDasharray="2 2"
      d="M74 37.5A36.5 36.5 0 1 0 37.5 74"
    />
    <defs>
      <radialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(90 0 37.5) scale(36.5)"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.5} stopOpacity={0.34} />
        <stop offset={1} />
      </radialGradient>
    </defs>
  </svg>
);

export const Divider = ({
  height = 110,
  ...props
}: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    fill="none"
    viewBox="0 0 800 110"
    {...props}
  >
    <path stroke="url(#a)" d="M0 30h800" opacity={0.12} />
    <path stroke="url(#b)" d="M0 78h800" opacity={0.12} />
    <path stroke="url(#c)" d="M76 106V4" opacity={0.12} />
    <path stroke="url(#d)" d="M88 30a12 12 0 1 0-12 12" opacity={0.12} />
    <path stroke="url(#e)" d="M400 106V4" opacity={0.12} />
    <path stroke="url(#f)" d="M724 110V0" opacity={0.12} />
    <path
      stroke="url(#g)"
      d="M712 78a12.004 12.004 0 0 0 7.408 11.087A12 12 0 1 0 724 66"
      opacity={0.12}
    />
    <defs>
      <linearGradient
        id="a"
        x1={0}
        x2={800}
        y1={30}
        y2={30}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.033} />
        <stop offset={0.693} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="b"
        x1={0}
        x2={800}
        y1={78}
        y2={78}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.115} />
        <stop offset={0.894} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="c"
        x1={76}
        x2={76}
        y1={106}
        y2={4}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.333} />
        <stop offset={0.667} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="e"
        x1={400}
        x2={400}
        y1={106}
        y2={4}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.333} />
        <stop offset={0.667} />
        <stop offset={1} />
      </linearGradient>
      <linearGradient
        id="f"
        x1={724}
        x2={724}
        y1={110}
        y2={0}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.333} />
        <stop offset={0.667} />
        <stop offset={1} />
      </linearGradient>
      <radialGradient
        id="d"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 12 -12 0 76 30)"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.5} />
        <stop offset={1} />
      </radialGradient>
      <radialGradient
        id="g"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="matrix(0 -12 12 0 724 78)"
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={0.5} />
        <stop offset={1} />
      </radialGradient>
    </defs>
  </svg>
);
