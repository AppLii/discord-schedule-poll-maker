import { DateOption } from '../types';
import { formatDateForDisplay } from '../utils/dateUtils';

interface DateOptionsListProps {
  dateOptions: DateOption[];
  onRemove: (id: number) => void;
}

export default function DateOptionsList({ dateOptions, onRemove }: DateOptionsListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700 pt-6">候補として追加されている日程</h2>
      {dateOptions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">候補日が追加されていません</p>
      ) : (
        <ul className="space-y-2">
          {dateOptions.map((option) => (
            <li
              key={option.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-gray-700">
                  {formatDateForDisplay(option.date, option.time)}
                </span>
              </span>
              <button
                onClick={() => onRemove(option.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
