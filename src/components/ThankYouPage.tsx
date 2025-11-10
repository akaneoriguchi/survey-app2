import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-700 leading-tight">
          ご協力ありがとうございました！
        </h1>
        <p className="mt-6 text-gray-600 leading-relaxed">
          アンケートの回答が完了しました。<br />
          クラウドワークス上にて、<br className="sm:hidden" />
          完了報告をお願いいたします。
        </p>
      </div>
    </div>
  );
}