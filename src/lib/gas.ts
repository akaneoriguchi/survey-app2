const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwQQLDey6GjnjacrGBYO1NGZSwDpQL9TTi2ayCgX7zKM9C6VgnNyZgvPIVa_mueqV613g/exec'; 

export async function reserveCondition(): Promise<number> {
  const url = `${WEB_APP_URL}?mode=reserve`;
  const res = await fetch(url, { method: 'GET' });
  // CORSでボディが読めない場合、失敗時はランダムにフォールバック、App.tsx側で実施
  if (!res.ok) throw new Error('reserve failed');
  const json = await res.json();
  return Number(json.condition || 0);
}

type SavePayload = {
  condition: number;
  profile: { name: string; gender: string; age: string };
  responses: { questionId: number; beforeRating: number | null; afterRating: number | null }[];
  durationSec: number;
};

export async function saveResponse(payload: SavePayload): Promise<boolean> {
  // Content-Type を付けない：=> preflight を回避
  const res = await fetch(WEB_APP_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'saveResponse', ...payload }),
  });

  // preflight 回避時は res.json() が失敗しやすいので text 経由で安全に
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return !!json.ok;
  } catch {
    return false;
  }
}