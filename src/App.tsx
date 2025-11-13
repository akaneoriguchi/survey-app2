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
    2: '「TORIA」は環境に配慮した優しいブランドイメージを掲げてきたが、一部商品の素材表記に誤りがあり、再生素材として販売していた商品に通常の化学繊維が含まれていたことが判明した。SNS上で批判が広がりブランドへの信頼が大きく揺らいだため、信頼回復と事態沈静化を図るべくリブランディングを実施した。',
    3: '「TORIA」は2021年以降、環境配慮型ブランドへの転換を進めている。生産過程での廃棄削減や再生素材の導入を本格化させ、新たなサプライチェーンの構築を実施。これに合わせて、社内体制とブランド方針を刷新するリブランディングを行い、新たなロゴを制定した。',
    4: '説明文なし。ロゴの印象のみで評価してください。',
    5: '「TORIA」はSNS公式アカウントの投稿内容が差別的と受け取られ、批判が相次いだ。投稿の削除後も波紋が広がり、ブランドイメージが大きく損なわれた。広報対応の遅れや内部チェック体制の甘さも指摘され、公式サイトに謝罪文を掲載。信頼を回復するため、発信体制とブランド方針を全面的に見直すリブランディングを実施した。',
    6: '10年前の創業以来、若年層向けアパレル業界で成長を続ける「TORIA」は、SNSを活用した共創型プロジェクトの開始を発表。ユーザーのアイデアを人気投票で製品化する取り組みを始めた。顧客と共に育てるブランドというコンセプトで、透明性や参加性をアピールするためのリブランディングも同時に行った。',
    7: '説明文なし。ロゴの印象のみで評価してください。なおこの設問では、必ず新旧どちらのゴロも「5」を選んでください。',
  },
  2: {
    1: '「TORIA」は2021年以降、環境配慮型ブランドへの転換を進めている。生産過程での廃棄削減や再生素材の導入を本格化させ、新たなサプライチェーンの構築を実施。これに合わせて、社内体制とブランド方針を刷新するリブランディングを行い、新たなロゴを制定した。',
    2: '説明文なし。ロゴの印象のみで評価してください。',
    3: '「TORIA」は環境に配慮した優しいブランドイメージを掲げてきたが、一部商品の素材表記に誤りがあり、再生素材として販売していた商品に通常の化学繊維が含まれていたことが判明した。SNS上で批判が広がりブランドへの信頼が大きく揺らいだため、信頼回復と事態沈静化を図るべくリブランディングを実施した。',
    4: '10年前の創業以来、若年層向けアパレル業界で成長を続ける「TORIA」は、SNSを活用した共創型プロジェクトの開始を発表。ユーザーのアイデアを人気投票で製品化する取り組みを始めた。顧客と共に育てるブランドというコンセプトで、透明性や参加性をアピールするためのリブランディングも同時に行った。',
    5: '説明文なし。ロゴの印象のみで評価してください。',
    6: '「TORIA」はSNS公式アカウントの投稿内容が差別的と受け取られ、批判が相次いだ。投稿の削除後も波紋が広がり、ブランドイメージが大きく損なわれた。広報対応の遅れや内部チェック体制の甘さも指摘され、公式サイトに謝罪文を掲載。信頼を回復するため、発信体制とブランド方針を全面的に見直すリブランディングを実施した。',
    7: '「TORIA」は創立10周年を迎え、これまでのコレクションや広告表現を整理し直した。“流行よりも長く愛される日常服”という原点に立ち返り、ブランドの軸を再確認。長く支持されるブランドを目指す姿勢を明確にするリブランディングを実施した。なおこの設問では、必ず新旧どちらのゴロも「5」を選んでください。',
  },
  3: {
    1: '「TORIA」は環境に配慮した優しいブランドイメージを掲げてきたが、一部商品の素材表記に誤りがあり、再生素材として販売していた商品に通常の化学繊維が含まれていたことが判明した。SNS上で批判が広がりブランドへの信頼が大きく揺らいだため、信頼回復と事態沈静化を図るべくリブランディングを実施した。',
    2: '「TORIA」は2021年以降、環境配慮型ブランドへの転換を進めている。生産過程での廃棄削減や再生素材の導入を本格化させ、新たなサプライチェーンの構築を実施。これに合わせて、社内体制とブランド方針を刷新するリブランディングを行い、新たなロゴを制定した。',
    3: '説明文なし。ロゴの印象のみで評価してください。',
    4: '「TORIA」はSNS公式アカウントの投稿内容が差別的と受け取られ、批判が相次いだ。投稿の削除後も波紋が広がり、ブランドイメージが大きく損なわれた。広報対応の遅れや内部チェック体制の甘さも指摘され、公式サイトに謝罪文を掲載。信頼を回復するため、発信体制とブランド方針を全面的に見直すリブランディングを実施した。',
    5: '10年前の創業以来、若年層向けアパレル業界で成長を続ける「TORIA」は、SNSを活用した共創型プロジェクトの開始を発表。ユーザーのアイデアを人気投票で製品化する取り組みを始めた。顧客と共に育てるブランドというコンセプトで、透明性や参加性をアピールするためのリブランディングも同時に行った。',
    6: '説明文なし。ロゴの印象のみで評価してください。',
    7: '「TORIA」は経営多角化のなかでブランドらしさを見失い、社内外から“何を大切にしているのか分からない”との声が増えていた。迷走状態から抜け出すため、方向性を再定義するリブランディングを実施。かつての信頼を取り戻すことが課題となっている。なおこの設問では、必ず新旧どちらのゴロも「5」を選んでください。',
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
    <div className="min-h-screen p-4 sm:p-6 bg-white sm:bg-gradient-to-br sm:from-blue-50 sm:to-indigo-100">
      <div className="w-full mx-auto sm:max-w-4xl sm:bg-white sm:rounded-2xl sm:shadow-lg p-4 sm:p-10 text-sm sm:text-base">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4">
          リブランディング前後でのロゴの印象に関するアンケート
        </h1>

        <div className="bg-emerald-50 p-4 sm:p-5 mb-8 rounded-xl shadow-sm">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            以下は架空のアパレルブランド「TORIA」のロゴデザインに関するアンケートです。<br />
            ブランドの方針変更や体制の見直しなどをきっかけに、ロゴを変更（＝リブランディング）したケースを想定しています。
            それぞれ<b>各説明文を読んだうえで、変更前後のロゴについてデザインの印象を7段階でお答えください。</b>
            星が多いほど「より好ましい（好き）」印象を表します。<br />
            説明の無いものは、初見の印象のみで評価してください。<br />
            <b>※所要時間目安　約4分</b>
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