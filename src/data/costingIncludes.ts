export interface CostingLineItem {
  readonly label: string;
  readonly detail: string;
}

export const COSTING_INCLUDES_TITLE = 'Costing includes';

export const COSTING_INCLUDES_ITEMS: readonly CostingLineItem[] = [
  { label: 'Welcome Board', detail: '1 (as per theme)' },
  { label: 'Entrance Arch', detail: '1' },
  { label: 'Backdrop', detail: '20–24 ft' },
  { label: 'Ambience elements', detail: '6' },
  { label: 'Table Decor', detail: 'As per layout' },
] as const;
