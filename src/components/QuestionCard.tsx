import { useState } from 'react';
import { Star, ArrowRight } from 'lucide-react'; // ← 矢印アイコン追加

export type Question = {
  id: number;
  title: string;
  logoBefore: string;
  logoAfter: string;
  description?: string;
};

export type QA = {
  questionId: number;
  beforeRating: number | null;
  afterRating: number | null;
};

type Props = {
  index: number;
  question: Question;
  response?: QA;
  onChange: (questionId: number, kind: 'before' | 'after', value: number) => void;
};

export default function QuestionCard({ index, question, response, onChange }: Props) {
  const [hoverBefore, setHoverBefore] = useState<number | null>(null);
  const [hoverAfter, setHoverAfter] = useState<number | null>(null);

  const renderStars = (
    currentValue: number | null,
    hoverValue: number | null,
    onClick: (val: number) => void,
    onHover: (val: number | null) => void
  ) => (
    <div className="flex flex-col items-center mt-3">
      <div className="flex gap-1 justify-center">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onClick(value)}
            onMouseEnter={() => onHover(value)}
            onMouseLeave={() => onHover(null)}
            className="focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                (hoverValue ?? currentValue ?? 0) >= value
                  ? 'fill-yellow-400 stroke-yellow-500'
                  : 'stroke-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <span className="text-sm text-gray-600 mt-1">
        {currentValue ? `（${currentValue}/7）` : '未評価'}
      </span>
    </div>
  );

  return (
    <div className="border-b border-gray-200 pb-12 last:border-b-0">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        問{index + 1}：
      </h2>

      {question.description && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-xl">
          <p className="text-base text-gray-700 leading-relaxed">
            {question.description}
          </p>
        </div>
      )}

      {/* ロゴ部分＋矢印 */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
        {/* 旧ロゴ */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">旧ロゴ</h3>
          <div className="flex items-center justify-center min-h-[160px]">
            <img
              src={question.logoBefore}
              alt="旧ロゴ"
              className="max-w-full max-h-[140px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect width="200" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3E旧ロゴ%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          {renderStars(
            response?.beforeRating ?? null,
            hoverBefore,
            (v) => onChange(question.id, 'before', v),
            setHoverBefore
          )}
        </div>

        {/* 矢印 */}
        <ArrowRight className="w-10 h-10 text-gray-400 hidden sm:block" />

        {/* 新ロゴ */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">新ロゴ</h3>
          <div className="flex items-center justify-center min-h-[160px]">
            <img
              src={question.logoAfter}
              alt="新ロゴ"
              className="max-w-full max-h-[140px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3Crect width="200" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%239ca3af"%3E新ロゴ%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          {renderStars(
            response?.afterRating ?? null,
            hoverAfter,
            (v) => onChange(question.id, 'after', v),
            setHoverAfter
          )}
        </div>
      </div>
    </div>
  );
}