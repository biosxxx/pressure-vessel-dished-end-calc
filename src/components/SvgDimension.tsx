interface SvgDimensionProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text: string;
  offset?: number;
  color?: string;
  fontSize?: number;
  orientation?: 'horizontal' | 'vertical';
}

export function SvgDimension({
  x1,
  y1,
  x2,
  y2,
  text,
  offset = 10,
  color = 'black',
  fontSize = 14,
  orientation = 'horizontal',
}: SvgDimensionProps) {
  const arrowSize = fontSize / 2.5;

  let lx1 = x1;
  let ly1 = y1;
  let lx2 = x2;
  let ly2 = y2;
  let tx = (x1 + x2) / 2;
  let ty = (y1 + y2) / 2;

  if (orientation === 'horizontal') {
    ly1 += offset;
    ly2 += offset;
    ty = ly1 - fontSize * 0.3;
  } else {
    lx1 += offset;
    lx2 += offset;
    tx = lx1 + fontSize * 0.3;
    if (offset < 0) tx = lx1 - fontSize * 0.8;
  }

  return (
    <g className="dimension-line">
      <line x1={x1} y1={y1} x2={lx1} y2={ly1} stroke={color} strokeWidth="0.5" opacity="0.5" />
      <line x1={x2} y1={y2} x2={lx2} y2={ly2} stroke={color} strokeWidth="0.5" opacity="0.5" />
      <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke={color} strokeWidth="1" />
      {orientation === 'horizontal' ? (
        <>
          <path d={`M ${lx1} ${ly1} L ${lx1 + arrowSize} ${ly1 - arrowSize / 2} L ${lx1 + arrowSize} ${ly1 + arrowSize / 2} Z`} fill={color} />
          <path d={`M ${lx2} ${ly2} L ${lx2 - arrowSize} ${ly2 - arrowSize / 2} L ${lx2 - arrowSize} ${ly2 + arrowSize / 2} Z`} fill={color} />
        </>
      ) : (
        <>
          <path d={`M ${lx1} ${ly1} L ${lx1 - arrowSize / 2} ${ly1 + arrowSize} L ${lx1 + arrowSize / 2} ${ly1 + arrowSize} Z`} fill={color} />
          <path d={`M ${lx2} ${ly2} L ${lx2 - arrowSize / 2} ${ly2 - arrowSize} L ${lx2 + arrowSize / 2} ${ly2 - arrowSize} Z`} fill={color} />
        </>
      )}
      <text
        x={tx}
        y={ty}
        fill={color}
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline={orientation === 'horizontal' ? 'auto' : 'middle'}
        fontWeight="bold"
        style={{
          paintOrder: 'stroke',
          stroke: color === 'black' ? 'white' : 'black',
          strokeWidth: '3px',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeOpacity: 0.3,
        }}
      >
        {text}
      </text>
    </g>
  );
}
