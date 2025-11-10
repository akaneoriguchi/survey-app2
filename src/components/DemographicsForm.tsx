import { useState } from 'react';

type Demo = { name: string; gender: string; age: number };

export default function DemographicsForm({
  onComplete,
}: {
  onComplete: (demo: Demo) => void;
}) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');

  const canNext = name.trim() !== '' && gender !== '' && age !== '';

  const handleNext = () => {
    if (!canNext) return;
    onComplete({ name: name.trim(), gender, age: Number(age) });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1>アンケートへのご協力誠にありがとうございます。はじめに、以下の基本情報を入力してからアンケートにお進みください。</h1>
        <h1 className="text-2xl font-bold text-gray-800">基本情報</h1>

        <label className="block">
          <span className="text-sm text-gray-700">お名前（クラウドワークスでのワーカー名と必ず一致させてください）</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="YamadaTaro"
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">性別</span>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="回答しない">回答しない</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm text-gray-700">年齢</span>
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="例: 34"
          />
        </label>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canNext}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md transition disabled:opacity-50"
        >
          アンケートを開始する
        </button>
      </div>
    </div>
  );
}