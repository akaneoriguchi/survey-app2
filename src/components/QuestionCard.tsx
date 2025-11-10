import { useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col items-center mt-1">
      <div className="flex gap-0.5 sm:gap-1 justify-center">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onClick(value)}
            onMouseEnter={() => onHover(value)}
            onMouseLeave={() => onHover(null)}
            className="focus:outline-none"
            aria-label={`${value} に評価`}
          >
            <Star
              className={`transition-colors w-4 h-4 sm:w-5 sm:h-5 ${
                (hoverValue ?? currentValue ?? 0) >= value
                  ? 'fill-yellow-400 stroke-yellow-500'
                  : 'stroke-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      <span className="text-xs sm:text-sm text-gray-600 mt-1">
        {currentValue ? `（${currentValue}/7）` : '未評価'}
      </span>
    </div>
  );

  return (
    <div className="border-b border-gray-200 pb-8 last:border-b-0">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3">問{index + 1}：</h2>

      {question.description && (
        <div className="bg-blue-50 p-3 sm:p-4 mb-5 rounded-lg">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {question.description}
          </p>
        </div>
      )}

      {/* モバイルでも横並び。矢印は中央に重ねる */}
      <div className="relative grid grid-cols-2 gap-3 sm:gap-8 items-start">
        {/* 旧ロゴ */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs sm:text-base font-semibold text-gray-700 mb-2 text-center">旧ロゴ</h3>
          <div className="flex items-center justify-center min-h-[110px] sm:min-h-[160px]">
            <img
              src={question.logoBefore}
              alt="旧ロゴ"
              className="max-w-full max-h-[90px] sm:max-h-[140px] object-contain"
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-400" />
        </div>

        {/* 新ロゴ */}
        <div className="flex flex-col items-center">
          <h3 className="text-xs sm:text-base font-semibold text-gray-700 mb-2 text-center">新ロゴ</h3>
          <div className="flex items-center justify-center min-h-[110px] sm:min-h-[160px]">
            <img
              src={question.logoAfter}
              alt="新ロゴ"
              className="max-w-full max-h-[90px] sm:max-h-[140px] object-contain"
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