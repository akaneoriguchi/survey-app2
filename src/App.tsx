import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import DemographicsForm from './components/DemographicsForm';
import QuestionCard from './components/QuestionCard';
import ThankYouPage from './components/ThankYouPage';
import { reserveCondition, saveResponse } from './lib/gas';
import { shuffle } from './utils/shuffle';

type Question = {
  id: number;
  title: string;
  logoBefore: string;
  logoAfter: string;
  description?: string; // conditionに応じて上書き
};

type ProfileData = {
  name: string;
  age: string; // 文字列保持
  gender: string;
};

type QuestionResponse = {
  questionId: number;
  beforeRating: number | null;
  afterRating: number | null;
};

const baseQuestions: Question[] = [
  { id: 1, title: 'Q1', logoBefore: '/logo-04.jpg', logoAfter: '/logo-13.jpg' },
  { id: 2, title: 'Q2', logoBefore: '/logo-09.jpg', logoAfter: '/logo-23.jpg' },
  { id: 3, title: 'Q3', logoBefore: '/logo-14.jpg', logoAfter: '/logo-21.jpg' },
  { id: 4, title: 'Q4', logoBefore: '/logo-27.jpg', logoAfter: '/logo-28.jpg' },
  { id: 5, title: 'Q5', logoBefore: '/logo-03.jpg', logoAfter: '/logo-17.jpg' },
  { id: 6, title: 'Q6', logoBefore: '/logo-10.jpg', logoAfter: '/logo-30.jpg' },
  { id: 7, title: 'Q7', logoBefore: '/logo-20.jpg', logoAfter: '/logo-22.jpg' },
];

const contextMap: Record<number, Record<number, string | undefined>> = {
  1: {
    1: '説明文なし。ロゴの印象のみで評価してください。',
    2: '「TORIA」は海外事業での販売不振や在庫処分が相次ぎ、売上が大きく減少した。これらの戦略失敗を受け、ブランド全体を立て直す必要に迫られたため、ブランド基盤を再構築するリブランディングを行った。',
    3: '「TORIA」は次世代の顧客層とのつながりを強めるため、若手クリエイターとのコラボラインを展開。これを契機にブランドのトーンやメッセージを見直し、より開かれた姿勢を示すリブランディングを行った。',
    4: '説明文なし。ロゴの印象のみで評価してください。',
    5: '「TORIA」はSNSでの不適切な投稿をきっかけに批判が相次ぎ、ブランドイメージが大きく損なわれた。炎上後、公式サイトには謝罪文を掲載。信頼を回復するために、体制と発信方針を抜本的に見直すリブランディングを実施した。',
    6: '「TORIA」は新たな経営体制のもと、次の成長段階へ進むリブランディングを実施した。若手中心の組織づくりと多様性の推進を掲げ、より柔軟で共感性のあるブランド運営を目指している。',
    7: '説明文なし。ロゴの印象のみで評価してください。なおこの設問では、確認のため必ず前後どちらのゴロも「5」を選んでください。',
  },
  2: {
    1: '「TORIA」は、環境配慮型ブランドへの転換を進める。生産過程での廃棄削減や再生素材の導入を発表し、持続可能な取り組みを明確に打ち出した。これに合わせてブランド体制を刷新し、新しい方向性を示す新たなロゴを制定した。',
    2: '説明文なし。ロゴの印象のみで評価してください。',
    3: '「TORIA」はブランドの高価格化が進み、“かつての勢いがない”との声が増えていた。若年層離れが深刻化し、販売も低迷。危機感を受けてブランドを再設計し、失われた関心を取り戻すためのリブランディングを実施した。',
    4: '「TORIA」は関連ブランドとの経営統合を実施し、企画から販売までを一体化した。事業拡大とブランドの一貫性を高める目的で、体制とコミュニケーションを整理し直すリブランディングを行った。',
    5: '説明文なし。ロゴの印象のみで評価してください。',
    6: '「TORIA」は経営方針の迷走により販売不振が続き、トップの辞任を発表した。ブランドとしての一体感を失い、内部の混乱も表面化。体制立て直しを目的としたリブランディングに踏み切った。',
    7: '「TORIA」は創立10周年を迎え、これまでの価値観を整理し直すリブランディングを実施。“流行よりも長く愛される日常服”という原点を再確認し、ブランドの軸を明確にした。なおこの設問では、確認のため必ず前後どちらのゴロも「5」を選んでください。',
  },
  3: {
    1: '「TORIA」は環境対応を掲げていたが、一部商品の素材表記に誤りがあり、消費者から批判を受けた。信頼を損なったことを受け、失われた信用を取り戻すためのリブランディングを余儀なくされた。',
    2: '「TORIA」は10周年を機に事業を拡大。海外展開を見据え、ブランドの世界観を整理し直した。新たなターゲット層に向けて発信力を高めるため、ブランド構造とコミュニケーション戦略を刷新した。',
    3: '説明文なし。ロゴの印象のみで評価してください。',
    4: '「TORIA」は業績悪化と店舗閉鎖が続き、経営の維持が困難になっていた。グループ再編を余儀なくされ、ブランドの再生をかけてリブランディングを実施。かつての存在感を失いつつある状況からの再起を模索している。',
    5: '「TORIA」はSNSを通じて顧客との対話を重視する方針を打ち出し、ユーザーと一緒に企画を作る新体制を導入した。ブランドと顧客の関係を再定義し、開かれた姿勢を強調するリブランディングを進めた。',
    6: '説明文なし。ロゴの印象のみで評価してください。',
    7: '「TORIA」は経営多角化のなかでブランドらしさを見失い、社内外から“何を大切にしているのか分からない”との声が増えていた。迷走状態から抜け出すため、方向性を再定義するリブランディングを実施。かつての信頼を取り戻すことが課題となっている。なおこの設問では、確認のため必ず前後どちらのゴロも「5」を選んでください。',
  },
};

function App() {
  const [step, setStep] = useState<'profile' | 'survey' | 'thanks'>('profile');

  // プロフィール
  const [profile, setProfile] = useState<ProfileData>({ name: '', age: '', gender: '' });

  // condition（1〜3）
  const [condition, setCondition] = useState<number | null>(null);

  // 設問（condition 決定後に description を上書き）
  const [questions, setQuestions] = useState<Question[]>(baseQuestions);

  // 回答
  const [responses, setResponses] = useState<QuestionResponse[]>(
    baseQuestions.map((q) => ({ questionId: q.id, beforeRating: null, afterRating: null }))
  );

  // 表示順
  const [order, setOrder] = useState<number[]>(() => shuffle(baseQuestions.map((q) => q.id)));

  // 所要時間計測
  const startedAtRef = useRef<number | null>(null);

  // 評価更新
  const updateRating = (questionId: number, type: 'before' | 'after', value: number) => {
    setResponses((prev) =>
      prev.map((r) =>
        r.questionId === questionId
          ? { ...r, [type === 'before' ? 'beforeRating' : 'afterRating']: value }
          : r
      )
    );
  };

  const isAllAnswered = responses.every((r) => r.beforeRating !== null && r.afterRating !== null);

  // プロフィール完了 → 画面遷移 → conditionを取得 
  const handleProfileDone = async (data: { name: string; gender: string; age: number }) => {
    setProfile({ name: data.name, gender: data.gender, age: String(data.age) });
    setStep('survey'); 

    try {
      const c = await reserveCondition(); // 1〜3を即返（GAS側で分配）
      setCondition(c);
    } catch {
      const fallback = Math.floor(Math.random() * 3) + 1;
      setCondition(fallback);
    }
  };

  // condition決定 → 説明文を上書きし、回答配列と順序をリセット
  useEffect(() => {
    if (!condition) return;

    const enriched = baseQuestions.map((q) => ({
      ...q,
      description: contextMap[condition]?.[q.id],
    }));

    setQuestions(enriched);
    setResponses(enriched.map((q) => ({ questionId: q.id, beforeRating: null, afterRating: null })));
    setOrder(shuffle(enriched.map((q) => q.id)));

    // 計測開始
    startedAtRef.current = Date.now();
  }, [condition]);

  /** 送信 */
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSurveySubmit = async () => {
  if (!isAllAnswered || isSubmitting) return; // 二重送信防止
  setIsSubmitting(true); // ← 送信開始

  const finalCond = condition ?? (Math.floor(Math.random() * 3) + 1);
  const durationSec = startedAtRef.current
    ? Math.round((Date.now() - startedAtRef.current) / 1000)
    : 0;

  const ok = await saveResponse({
    condition: finalCond,
    profile,
    responses,
    durationSec,
  });

  if (!ok) {
    alert('送信に失敗しました。通信環境をご確認のうえ再度お試しください。');
    setIsSubmitting(false); // ← 失敗時は戻す
    return;
  }

  setStep('thanks');
};

  // 画面分岐
  if (step === 'profile') return <DemographicsForm onComplete={handleProfileDone} />;
  if (step === 'thanks') return <ThankYouPage />;

  // survey
  if (!condition) {
    // condition 読み込み中のローディング表示
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-700 text-lg font-medium">アンケートを読み込んでいます…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          リブランディング前後でのロゴの印象に関するアンケート
        </h1>

        <div className="bg-emerald-50 p-5 mb-8 rounded-xl shadow-sm">
          <p className="text-gray-700 leading-relaxed text-base">
            以下は架空のアパレルブランド「TORIA」のロゴデザインに関するアンケートです。<br />
            ブランドの方針変更や体制の見直しなどをきっかけに、ロゴを変更（＝リブランディング）したケースを想定しています。
            それぞれ各説明文を読んだうえで、変更前後のロゴについてデザインの印象を7段階でお答えください。<br />
            説明の無いものは、初見の印象のみで評価してください。<br />
            <b>所要時間　約4分</b>
          </p>
        </div>

        <div className="space-y-12">
          {order.map((qid, index) => {
            const q = questions.find((x) => x.id === qid)!;
            const response = responses.find((r) => r.questionId === qid);
            return (
              <QuestionCard
                key={q.id}
                index={index}
                question={q}
                response={response}
                onChange={updateRating}
              />
            );
          })}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSurveySubmit}
            disabled={!isAllAnswered || isSubmitting}
            className={`w-full max-w-xs px-6 py-3 rounded-lg font-semibold shadow transition-all duration-300 ${
              isAllAnswered && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md'
                : 'bg-gradient-to-r from-blue-300 to-indigo-300 text-white opacity-60 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '送信中...' : 'アンケートを送信'}
          </button>
        </div>

        <p className="text-center text-sm text-red-500 mt-3">
          すべてに回答すると送信できます。送信後、完了画面が表示されるまで少々お待ち下さい。
        </p>
      </div>
    </div>
  );
}

export default App;