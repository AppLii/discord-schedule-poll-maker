// 時間入力のパース処理
export const parseTimeInput = (input: string): string => {
  // 空文字の場合はそのまま返す
  if (!input) return "";

  // スペースを削除
  const cleaned = input.replace(/\s/g, "");

  // 既にHH:MM形式の場合はそのまま返す
  if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
    const [hours, minutes] = cleaned.split(":");
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${h.toString().padStart(2, "0")}:${minutes}`;
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
      return `${hours.padStart(2, "0")}:${minutes}`;
    }
  }

  return input;
};

// 時間入力のバリデーション
export const validateTimeInput = (input: string): boolean => {
  // 空文字は有効（まだ入力していない状態）
  if (!input) return true;

  const cleaned = input.replace(/\s/g, "");

  // HH:MM形式のチェック
  if (/^\d{1,2}:\d{2}$/.test(cleaned)) {
    const [hours, minutes] = cleaned.split(":");
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
