import { PERIOD_TIMES } from '../constants';

interface TimeInputProps {
  selectedTime: string;
  isTimeValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPeriodClick: (time: string) => void;
}

export default function TimeInput({
  selectedTime,
  isTimeValid,
  onChange,
  onBlur,
  onPeriodClick,
}: TimeInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        時間を入力
      </label>
      <input
        type="text"
        className={`w-full p-3 border rounded-md focus:ring-2 transition-colors ${!isTimeValid
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
          : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
          }`}
        placeholder="例: 1430 または 14:30"
        value={selectedTime}
        onChange={onChange}
        onBlur={onBlur}
      />
      {!isTimeValid && selectedTime && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">無効な時刻形式です</p>
            <p className="text-xs text-red-700 mt-1">
              有効な形式: 4桁の数字（例: 1430）、3桁の数字（例: 930）、または HH:MM 形式（例: 14:30）
            </p>
          </div>
        </div>
      )}
      {isTimeValid && (
        <p className="mt-1 text-xs text-gray-500">
          4桁の数字（例: 1430）または HH:MM 形式で入力してください
        </p>
      )}

      {/* 時間割クイック選択 */}
      <div className="mt-3">
        <p className="text-xs font-medium text-gray-600 mb-2">よく使う時間割：</p>
        <div className="grid grid-cols-4 gap-2">
          {PERIOD_TIMES.map((period) => (
            <button
              key={period.label}
              type="button"
              onClick={() => onPeriodClick(period.time)}
              className={`px-3 py-2 text-xs rounded-md border transition-colors ${selectedTime === period.time
                ? 'bg-indigo-100 border-indigo-500 text-indigo-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
              <div className="font-medium">{period.label}</div>
              <div className="text-xs text-gray-500">{period.time}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
