import { CalendarDate, DateOption } from "../types";
import { PERIOD_TIMES, EMOJI_LIST } from "../constants";

// 今週から4週間後までの日付を生成
export const generateCalendarDates = (): CalendarDate[] => {
  const dates: CalendarDate[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 今週の日曜日を取得
  const startDate = new Date(today);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  // 4週間分（28日）の日付を生成
  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    // ローカルタイムゾーンで日付文字列を生成（UTC解釈を避ける）
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;

    dates.push({
      date,
      dateString,
      isToday,
      isPast,
    });
  }

  return dates;
};

// 時刻から時間割のラベルを取得
export const getTimePeriodLabel = (timeStr: string): string | null => {
  const period = PERIOD_TIMES.find((p) => p.time === timeStr);
  return period ? period.label : null;
};

// 表示用の日付フォーマット
export const formatDateForDisplay = (dateStr: string, timeStr: string): string => {
  // ローカルタイムゾーンで日付を解釈（UTC解釈を避ける）
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);

  const displayMonth = date.getMonth() + 1;
  const displayDay = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  const displayHours = date.getHours();
  const displayMinutes = date.getMinutes().toString().padStart(2, "0");

  const timeDisplay = `${displayHours}:${displayMinutes}`;
  const periodLabel = getTimePeriodLabel(timeStr);

  // 時間割に該当する場合は時間割名も表示
  if (periodLabel) {
    return `${displayMonth}/${displayDay}(${weekday}) ${periodLabel}（${timeDisplay}）`;
  }

  return `${displayMonth}/${displayDay}(${weekday}) ${timeDisplay}`;
};

// 日時順にソートして絵文字を再割り当て
export const sortDateOptionsWithEmoji = (options: DateOption[]): DateOption[] => {
  const sorted = [...options].sort((a, b) => {
    // ローカルタイムゾーンで日付を解釈（UTC解釈を避ける）
    const [yearA, monthA, dayA] = a.date.split("-").map(Number);
    const [hoursA, minutesA] = a.time.split(":").map(Number);
    const dateTimeA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);

    const [yearB, monthB, dayB] = b.date.split("-").map(Number);
    const [hoursB, minutesB] = b.time.split(":").map(Number);
    const dateTimeB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  // ソート後に絵文字を再割り当て
  return sorted.map((option, index) => ({
    ...option,
    emoji: EMOJI_LIST[index],
  }));
};
