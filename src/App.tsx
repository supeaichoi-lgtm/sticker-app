import React, { useState } from 'react';

type StickerResponse = {
  dataUrl: string;
};

export const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('먼저 단어나 문장을 입력해 주세요.');
      return;
    }

    setError(null);
    setLoading(true);
    setImage(null);

    try {
      const res = await fetch('https://ai-sticker-server.onrender.com/api/sticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `요청에 실패했어요. (status ${res.status})`);
      }

      const body = (await res.json()) as StickerResponse;
      setImage(body.dataUrl);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : '알 수 없는 오류가 발생했어요.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="title">AI 스티커 만들기</h1>
      <p className="description">
        예: 고양이 스티커, 웃는 토끼, 파란 로고 스티커 처럼
        <br />
        만들고 싶은 스티커를 간단히 적어 보세요.
      </p>
      <textarea
        className="input"
        placeholder="원하는 스티커를 한국어로 설명해 주세요."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
      />
      {error && <p className="error">{error}</p>}
      <button className="button" onClick={handleGenerate} disabled={loading}>
        {loading ? '만드는 중...' : '스티커 만들기'}
      </button>
      {image && (
        <div className="preview">
          <p className="preview-label">결과 스티커</p>
          <div className="preview-box">
            <img src={image} alt="생성된 스티커" />
          </div>
        </div>
      )}
    </div>
  );
};

