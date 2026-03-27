import type { CalculationResult, CalculatorConfig, ParsedNozzle } from '../types';

export interface DrawingMetrics {
  center: number;
  screenViewBoxSize: number;
  printPaddingX: number;
  printPaddingY: number;
  printWidth: number;
  printHeight: number;
  printMinX: number;
  printMinY: number;
  printViewBox: string;
  printFontSize: number;
}

export const getDrawingMetrics = (config: CalculatorConfig, calculated: CalculationResult): DrawingMetrics => {
  const screenViewBoxSize = config.diameterOuter * 1.5;
  const center = screenViewBoxSize / 2;
  const printPaddingX = config.diameterOuter * 0.25;
  const printPaddingY = config.diameterOuter * 0.2;
  const printWidth = config.diameterOuter + printPaddingX * 2;
  const printHeight = calculated.totalHeight + printPaddingY * 2;
  const printMinX = center - printWidth / 2;
  const printMinY = center - calculated.totalHeight / 2 - printPaddingY;
  const printViewBox = `${printMinX} ${printMinY} ${printWidth} ${printHeight}`;
  const printFontSize = Math.max(24, config.diameterOuter * 0.035);

  return {
    center,
    screenViewBoxSize,
    printPaddingX,
    printPaddingY,
    printWidth,
    printHeight,
    printMinX,
    printMinY,
    printViewBox,
    printFontSize,
  };
};

export const getHeadPath = (
  config: CalculatorConfig,
  calculated: CalculationResult,
  center: number,
) => {
  const width = config.diameterOuter;
  const height = calculated.totalHeight;
  const straightFlange = config.straightFlange;
  const thickness = config.thickness;

  const bevelWidth =
    config.edgePrep === 'V-Bevel'
      ? Math.tan((config.bevelAngle * Math.PI) / 180) * (thickness - config.rootFace)
      : 0;
  const root = config.edgePrep !== 'None' ? config.rootFace : thickness;

  return `
    M ${center - width / 2} ${center + height / 2}
    L ${center - width / 2} ${center + height / 2 - straightFlange}
    C ${center - width / 2} ${center - height / 2} ${center + width / 2} ${center - height / 2} ${center + width / 2} ${center + height / 2 - straightFlange}
    L ${center + width / 2} ${center + height / 2}
    ${
      config.edgePrep === 'V-Bevel'
        ? `
          L ${center + width / 2 - root} ${center + height / 2}
          L ${center + width / 2 - thickness} ${center + height / 2 - bevelWidth}
        `
        : `
          L ${center + width / 2 - thickness} ${center + height / 2}
        `
    }
    L ${center + width / 2 - thickness} ${center + height / 2 - straightFlange}
    C ${center + width / 2 - thickness} ${center - height / 2 + thickness} ${center - width / 2 + thickness} ${center - height / 2 + thickness} ${center - width / 2 + thickness} ${center + height / 2 - straightFlange}
    ${
      config.edgePrep === 'V-Bevel'
        ? `
          L ${center - width / 2 + thickness} ${center + height / 2 - bevelWidth}
          L ${center - width / 2 + root} ${center + height / 2}
        `
        : `
          L ${center - width / 2 + thickness} ${center + height / 2}
        `
    }
    Z
  `;
};

export const getNozzleDrawing = (nozzle: ParsedNozzle, index: number, config: CalculatorConfig, calculated: CalculationResult, center: number) => {
  const nozzleWidth = parseInt(nozzle.size.replace('DN', ''), 10) || 50;
  const visualWidth = Math.max(20, nozzleWidth);
  const visualHeight = 60;
  const x = center + nozzle.offset;
  const y = center - calculated.totalHeight / 2 + config.thickness + 10;

  return {
    id: nozzle.id,
    label: `N${index + 1}`,
    x,
    y,
    width: visualWidth,
    height: visualHeight,
  };
};
