
type Props = {
  title: string;               // 旧ロゴ / 新ロゴ
  src: string;                 // 画像パス
  value: number | null;        // 1..7 or null
  onChange: (v: number) => void;
  fallbackLabel?: string;      // フォールバックSVGのテキスト
};

export default function LogoRating({ title, src, value, onChange, fallbackLabel }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-6 mb-4 flex items-center justify-center min-h-[200px]">
        <img
          src={src}
          alt={title}
          className="max-w-full max-h-[180px] object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Crect width='200' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E${encodeURIComponent(fallbackLabel ?? title)}%3C/text%3E%3C/svg%3E`;
          }}
        />
      </div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        好意度：{value ?? '未回答'}
      </label>
      <input
        type="range"
        min={1}
        max={7}
        step={1}
        value={value ?? 4}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
      </div>
    </div>
  );
}