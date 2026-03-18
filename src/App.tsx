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
    <div className="wrapper">
      <div className="card">
        <header className="header">
          <div className="deco-row">🎀 🌸 ✨ 🗝️ 🌷</div>
          <h1 className="title">
            Sticker <span>Maker</span>
          </h1>
          <p className="subtitle">핑크 빈티지 다이컷 스티커 생성기</p>
        </header>

        <section>
          <p className="section-label">어떤 스티커를 만들고 싶나요?</p>
          <p className="description">
            예: 리본과 꽃다발, 빈티지 열쇠, 귀여운 딸기 캐릭터처럼
            <br />
            만들고 싶은 스티커를 간단히 적어 보세요.
          </p>
          <textarea
            className="textarea"
            placeholder="원하는 스티커를 한국어로 설명해 주세요."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          {error && <p className="error">{error}</p>}
          <button
            className={`generate-btn ${loading ? 'generating' : ''}`}
            onClick={handleGenerate}
            disabled={loading}
          >
            <div className="btn-inner">
              <div className="spinner" />
              <span className="btn-text">
                {loading ? '만드는 중...' : '🌸 스티커 만들기'}
              </span>
            </div>
          </button>
        </section>

        {image && (
          <section className="preview-section">
            <div className="preview-header">
              <span className="preview-label">생성된 스티커</span>
            </div>
            <div className="preview-box">
              <img src={image} alt="생성된 스티커" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

