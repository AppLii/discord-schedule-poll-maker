import { CalendarDate } from '../types';
import { WEEKDAY_LABELS } from '../constants';

interface CalendarProps {
  calendarDates: CalendarDate[];
  selectedDates: string[];
  onToggleDate: (dateString: string) => void;
}

export default function Calendar({ calendarDates, selectedDates, onToggleDate }: CalendarProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        日付を選択
      </label>
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAY_LABELS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-semibold py-1 ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'
              }`}
          >
            {day}
          </div>
        ))}
      </div>
      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDates.map((calDate) => {
          const day = calDate.date.getDate();
          const month = calDate.date.getMonth() + 1;
          const isSelected = selectedDates.includes(calDate.dateString);
          const dayOfWeek = calDate.date.getDay();
          // 1日の場合は月/日の形式で表示
          const displayText = day === 1 ? `${month}/${day}` : `${day}`;

          return (
            <button
              key={calDate.dateString}
              type="button"
              onClick={() => onToggleDate(calDate.dateString)}
              disabled={calDate.isPast}
              className={`
                relative p-2 text-sm rounded-md transition-all
                ${calDate.isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                ${!calDate.isPast && !isSelected ? 'bg-gray-50 hover:bg-indigo-50 text-gray-700' : ''}
                ${isSelected ? 'bg-indigo-600 text-white font-semibold shadow-md' : ''}
                ${calDate.isToday && !isSelected ? 'ring-2 ring-indigo-400' : ''}
                ${dayOfWeek === 0 && !isSelected && !calDate.isPast ? 'text-red-600' : ''}
                ${dayOfWeek === 6 && !isSelected && !calDate.isPast ? 'text-blue-600' : ''}
              `}
            >
              {displayText}
              {calDate.isToday && !isSelected && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      {selectedDates.length > 0 && (
        <div className="mt-3 p-3 bg-indigo-50 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">
            選択中の日付（{selectedDates.length}件）
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map((dateStr) => {
              // ローカルタイムゾーンで日付を解釈（UTC解釈を避ける）
              const [year, month, day] = dateStr.split('-').map(Number);
              const localDate = new Date(year, month - 1, day);
              return (
                <div
                  key={dateStr}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs text-gray-700 border border-indigo-200"
                >
                  {localDate.toLocaleDateString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleDate(dateStr);
                    }}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
