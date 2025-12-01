'use client';

import { useState, useMemo, useEffect } from 'react';

interface DateOption {
  id: number;
  date: string;
  time: string;
  emoji: string;
}

interface CalendarDate {
  date: Date;
  dateString: string;
  isToday: boolean;
  isPast: boolean;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
}

const EMOJI_LIST = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

// 時間割の定義
const PERIOD_TIMES = [
  { label: '1限', time: '09:10' },
  { label: '2限', time: '10:50' },
  { label: '昼休憩', time: '12:20' },
  { label: '3限', time: '13:10' },
  { label: '4限', time: '14:50' },
  { label: '5限', time: '16:30' },
  { label: '6限', time: '18:00' },
];

export default function Home() {
  const [eventDescription, setEventDescription] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [includeNoOption, setIncludeNoOption] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(true);

  // トースト通知を表示する関数
  const showToast = (message: string, type: Toast['type']) => {
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

  // 今週から4週間後までの日付を生成
  const calendarDates = useMemo(() => {
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
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
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
  }, []);

  // 時間入力のパース処理
  const parseTimeInput = (input: string): string => {
    // 空文字の場合はそのまま返す
    if (!input) return '';

    // スペースを削除
    const cleaned = input.replace(/\s/g, '');

    // 既にHH:MM形式の場合はそのまま返す
    if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
      const [hours, minutes] = cleaned.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        return `${h.toString().padStart(2, '0')}:${minutes}`;
      }
    }

    // 4桁の数字の場合、HH:MMに変換
    if (/^\d{4}$/.test(cleaned)) {
      const hours = cleaned.substring(0, 2);
      const minutes = cleaned.substring(2, 4);
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        return `${hours}:${minutes}`;
      }
    }

    // 3桁の数字の場合、H:MMに変換（例: 930 → 09:30）
    if (/^\d{3}$/.test(cleaned)) {
      const hours = cleaned.substring(0, 1);
      const minutes = cleaned.substring(1, 3);
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        return `${hours.padStart(2, '0')}:${minutes}`;
      }
    }

    return input;
  };

  // 時間入力のバリデーション
  const validateTimeInput = (input: string): boolean => {
    // 空文字は有効（まだ入力していない状態）
    if (!input) return true;

    const cleaned = input.replace(/\s/g, '');

    // HH:MM形式のチェック
    if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
      const [hours, minutes] = cleaned.split(':');
      const h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      return h >= 0 && h <= 23 && m >= 0 && m <= 59;
    }

    // 4桁の数字のチェック
    if (/^\d{4}$/.test(cleaned)) {
      const h = parseInt(cleaned.substring(0, 2), 10);
      const m = parseInt(cleaned.substring(2, 4), 10);
      return h >= 0 && h <= 23 && m >= 0 && m <= 59;
    }

    // 3桁の数字のチェック
    if (/^\d{3}$/.test(cleaned)) {
      const h = parseInt(cleaned.substring(0, 1), 10);
      const m = parseInt(cleaned.substring(1, 3), 10);
      return h >= 0 && h <= 23 && m >= 0 && m <= 59;
    }

    return false;
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    // 入力中は常に有効とする（リアルタイムバリデーションはしない）
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

  // 時間割をクリックして時刻を設定
  const handlePeriodClick = (time: string) => {
    setSelectedTime(time);
    setIsTimeValid(true);
  };

  // 日付選択のトグル
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

    // 時刻バリデーションチェック
    if (!isTimeValid) {
      showToast('有効な時刻形式で入力してください', 'error');
      return;
    }

    // 重複チェック: 既存の候補と重複しない日付のみフィルタリング
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

    // 新しい候補を追加後の合計数をチェック
    if (dateOptions.length + uniqueDates.length > 10) {
      showToast(`候補日は最大10個までです（現在${dateOptions.length}個、追加可能${10 - dateOptions.length}個）`, 'warning');
      return;
    }

    // 重複を除外した日付に対して候補を追加
    const newOptions = uniqueDates.map((dateStr, index) => ({
      id: Date.now() + index,
      date: dateStr,
      time: selectedTime,
      emoji: '', // 後でソート後に割り当て
    }));

    // 既存の候補と新しい候補をマージして日時順にソート
    const allOptions = [...dateOptions, ...newOptions].sort((a, b) => {
      // ローカルタイムゾーンで日付を解釈（UTC解釈を避ける）
      const [yearA, monthA, dayA] = a.date.split('-').map(Number);
      const [hoursA, minutesA] = a.time.split(':').map(Number);
      const dateTimeA = new Date(yearA, monthA - 1, dayA, hoursA, minutesA);

      const [yearB, monthB, dayB] = b.date.split('-').map(Number);
      const [hoursB, minutesB] = b.time.split(':').map(Number);
      const dateTimeB = new Date(yearB, monthB - 1, dayB, hoursB, minutesB);

      return dateTimeA.getTime() - dateTimeB.getTime();
    });

    // ソート後に絵文字を再割り当て
    const sortedWithEmoji = allOptions.map((option, index) => ({
      ...option,
      emoji: EMOJI_LIST[index],
    }));

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

  // 時刻から時間割のラベルを取得
  const getTimePeriodLabel = (timeStr: string): string | null => {
    const period = PERIOD_TIMES.find(p => p.time === timeStr);
    return period ? period.label : null;
  };

  const formatDateForDisplay = (dateStr: string, timeStr: string) => {
    // ローカルタイムゾーンで日付を解釈（UTC解釈を避ける）
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);

    const displayMonth = date.getMonth() + 1;
    const displayDay = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    const displayHours = date.getHours();
    const displayMinutes = date.getMinutes().toString().padStart(2, '0');

    const timeDisplay = `${displayHours}:${displayMinutes}`;
    const periodLabel = getTimePeriodLabel(timeStr);

    // 時間割に該当する場合は時間割名も表示
    if (periodLabel) {
      return `${displayMonth}/${displayDay}(${weekday}) ${periodLabel}（${timeDisplay}）`;
    }

    return `${displayMonth}/${displayDay}(${weekday}) ${timeDisplay}`;
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

    // 「どの日程も不可」オプションを追加
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
                {/* カレンダー */}
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
                          onClick={() => toggleDateSelection(calDate.dateString)}
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
                                  toggleDateSelection(dateStr);
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

                {/* 時間入力 */}
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
                    onChange={handleTimeInputChange}
                    onBlur={handleTimeInputBlur}
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
                          onClick={() => handlePeriodClick(period.time)}
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

              {/* 候補日リスト */}
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
                        onClick={() => removeDateOption(option.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        削除
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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

      {/* トースト通知 */}
      {toast && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
          <div
            className={`
              w-full px-6 py-4 shadow-lg flex items-center gap-3 justify-center
              ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
              ${toast.type === 'warning' ? 'bg-yellow-600 text-white' : ''}
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toast.type === 'error' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.type === 'warning' && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
