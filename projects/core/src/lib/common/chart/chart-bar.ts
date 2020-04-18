export class Bar {
    bars: Array<BarPart>;
    xlabel: string;
    total?: number;
  }
  
  export class BarPart {
    label: string;
    backgroundColor: string;
    borderColor: string;
    textColor?: string;
    value: number;
    prev?: number = 0;
  }