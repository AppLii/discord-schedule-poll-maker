export interface DateOption {
  id: number;
  date: string;
  time: string;
  emoji: string;
}

export interface CalendarDate {
  date: Date;
  dateString: string;
  isToday: boolean;
  isPast: boolean;
}

export interface Toast {
  message: string;
  type: "success" | "error" | "warning";
}
