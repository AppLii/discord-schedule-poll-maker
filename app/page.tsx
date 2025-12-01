'use client';

import { useState, useMemo, useEffect } from 'react';
import { DateOption, Toast as ToastType } from './types';
import { generateCalendarDates, formatDateForDisplay, sortDateOptionsWithEmoji } from './utils/dateUtils';
import { parseTimeInput, validateTimeInput } from './utils/timeUtils';
import { EMOJI_LIST } from './constants';
import Toast from './components/Toast';
import Calendar from './components/Calendar';
import TimeInput from './components/TimeInput';
import DateOptionsList from './components/DateOptionsList';

export default function Home() {
  const [eventDescription, setEventDescription] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [includeNoOption, setIncludeNoOption] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(true);

  // トースト通知を表示する関数
  const showToast = (message: string, type: ToastType['type']) => {
    setToast({ message, type });
  };

  // トースト通知を3秒後に自動的に消す
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // カレンダー日付を生成
  const calendarDates = useMemo(() => generateCalendarDates(), []);

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    setIsTimeValid(true);
  };

  const handleTimeInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = validateTimeInput(value);
    setIsTimeValid(isValid);

    if (isValid) {
      const parsed = parseTimeInput(value);
      setSelectedTime(parsed);
    }
  };

  const handlePeriodClick = (time: string) => {
    setSelectedTime(time);
    setIsTimeValid(true);
  };

  const toggleDateSelection = (dateString: string) => {
    setSelectedDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      } else {
        return [...prev, dateString].sort();
      }
    });
  };

  const addDateOption = () => {
    if (selectedDates.length === 0 || !selectedTime) {
      showToast('日付と時間を選択してください', 'error');
      return;
    }

    if (!isTimeValid) {
      showToast('有効な時刻形式で入力してください', 'error');
      return;
    }

    // 重複チェック
    const existingKeys = new Set(
      dateOptions.map(option => `${option.date}|${option.time}`)
    );

    const uniqueDates = selectedDates.filter(
      dateStr => !existingKeys.has(`${dateStr}|${selectedTime}`)
    );

    if (uniqueDates.length === 0) {
      showToast('選択した日付と時間の組み合わせは既に追加されています', 'warning');
      setSelectedDates([]);
      setSelectedTime('');
      return;
    }

    if (dateOptions.length + uniqueDates.length > 10) {
      showToast(`候補日は最大10個までです（現在${dateOptions.length}個、追加可能${10 - dateOptions.length}個）`, 'warning');
      return;
    }

    const newOptions = uniqueDates.map((dateStr, index) => ({
      id: Date.now() + index,
      date: dateStr,
      time: selectedTime,
      emoji: '',
    }));

    const sortedWithEmoji = sortDateOptionsWithEmoji([...dateOptions, ...newOptions]);
    setDateOptions(sortedWithEmoji);
    setSelectedDates([]);
    setSelectedTime('');
  };

  const removeDateOption = (id: number) => {
    const updatedOptions = dateOptions
      .filter(option => option.id !== id)
      .map((option, index) => ({
        ...option,
        emoji: EMOJI_LIST[index],
      }));
    setDateOptions(updatedOptions);
  };

  const generatePreview = () => {
    if (!eventDescription && dateOptions.length === 0 && !includeNoOption) {
      return '';
    }

    let preview = '';
    if (eventDescription) {
      preview += eventDescription + '\n\n';
    }

    dateOptions.forEach(option => {
      preview += `- ${option.emoji} ${formatDateForDisplay(option.date, option.time)}\n`;
    });

    if (includeNoOption) {
      preview += `- ❌ どの日程も不可\n`;
    }

    return preview;
  };

  const copyToClipboard = async () => {
    const preview = generatePreview();
    if (!preview) {
      showToast('コピーする内容がありません', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(preview);
      showToast('クリップボードにコピーしました!', 'success');
    } catch (err) {
      showToast('コピーに失敗しました', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力エリア */}
          <div className="space-y-6">
            {/* イベント概要入力 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">1. イベント概要</h2>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="イベントの内容や概要を入力してください..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>

            {/* オプション設定 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">2. オプション設定</h2>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeNoOption"
                  checked={includeNoOption}
                  onChange={(e) => setIncludeNoOption(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="includeNoOption" className="text-sm font-medium text-gray-700 cursor-pointer">
                  「❌ どの日程も不可」の選択肢を追加する
                </label>
              </div>
            </div>

            {/* 日程候補追加 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">3. 日程候補を追加</h2>
              <div className="space-y-4">
                <Calendar
                  calendarDates={calendarDates}
                  selectedDates={selectedDates}
                  onToggleDate={toggleDateSelection}
                />

                <TimeInput
                  selectedTime={selectedTime}
                  isTimeValid={isTimeValid}
                  onChange={handleTimeInputChange}
                  onBlur={handleTimeInputBlur}
                  onPeriodClick={handlePeriodClick}
                />

                <button
                  onClick={addDateOption}
                  disabled={selectedTime !== '' && !isTimeValid}
                  className={`w-full py-3 px-4 rounded-md transition-colors font-medium ${selectedTime !== '' && !isTimeValid
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  候補日を追加
                </button>
              </div>

              <DateOptionsList
                dateOptions={dateOptions}
                onRemove={removeDateOption}
              />
            </div>
          </div>

          {/* プレビューエリア */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">4. プレビュー</h2>
              {generatePreview() ? (
                <>
                  <div className="bg-gray-800 text-white p-6 rounded-md min-h-[300px] font-mono text-sm whitespace-pre-wrap mb-4">
                    {generatePreview()}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    クリップボードにコピー
                  </button>
                </>
              ) : (
                <div className="bg-gray-100 p-6 rounded-md min-h-[300px] flex items-center justify-center">
                  <p className="text-gray-500 text-center">
                    イベント概要または候補日を追加すると<br />ここにプレビューが表示されます
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
