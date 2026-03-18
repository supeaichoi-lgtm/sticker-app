import React, { useState } from 'react';

type StickerResponse = {
  dataUrl: string;
};

export const App: React.FC = () => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['line art']);
  const [selectedColors, setSelectedColors] = useState<string[]>([
    'soft pastel pink and rose tones, blush pink, dusty rose',
  ]);
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleStyle = (value: string) => {
    setSelectedStyles((prev) =>
      prev.includes(value)
        ? prev.length === 1
          ? prev
          : prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

  const toggleColor = (value: string) => {
    setSelectedColors((prev) =>
      prev.includes(value)
        ? prev.length === 1
          ? prev
          : prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

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
      const styleText =
        selectedStyles.length > 0
          ? `\n\nStyles: ${selectedStyles.join(', ')}`
          : '';
      const colorText =
        selectedColors.length > 0
          ? `\n\nColor tones: ${selectedColors.join(', ')}`
          : '';

      const fullPrompt = `${trimmed}${styleText}${colorText}`;

      const res = await fetch('https://ai-sticker-server.onrender.com/api/sticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
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
          {loading && (
            <div className="loading-area">
              <p className="loading-message">🌸 스티커를 준비 중이에요...</p>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" />
              </div>
            </div>
          )}
        </header>

        <section>
          <p className="section-label">어떤 스티커를 만들고 싶나요?</p>
          <p className="description">
            예: 리본과 꽃다발, 빈티지 열쇠, 귀여운 딸기 캐릭터처럼
            <br />
            만들고 싶은 스티커를 간단히 적어 보세요.
          </p>
          <p className="section-label" style={{ marginTop: 18 }}>
            스티커 스타일
          </p>
          <div className="style-grid">
            <button
              type="button"
              className={`style-card ${
                selectedStyles.includes('line art') ? 'active' : ''
              }`}
              onClick={() => toggleStyle('line art')}
            >
              <span className="style-emoji">🖊️</span>
              <span className="style-name">손그림 라인</span>
              <span className="style-sub">line art</span>
            </button>
            <button
              type="button"
              className={`style-card ${
                selectedStyles.includes('kawaii cute') ? 'active' : ''
              }`}
              onClick={() => toggleStyle('kawaii cute')}
            >
              <span className="style-emoji">🐣</span>
              <span className="style-name">카와이</span>
              <span className="style-sub">kawaii cute</span>
            </button>
            <button
              type="button"
              className={`style-card ${
                selectedStyles.includes('vintage floral') ? 'active' : ''
              }`}
              onClick={() => toggleStyle('vintage floral')}
            >
              <span className="style-emoji">🌹</span>
              <span className="style-name">빈티지 플로럴</span>
              <span className="style-sub">vintage floral</span>
            </button>
            <button
              type="button"
              className={`style-card ${
                selectedStyles.includes('photorealistic') ? 'active' : ''
              }`}
              onClick={() => toggleStyle('photorealistic')}
            >
              <span className="style-emoji">📸</span>
              <span className="style-name">실사 사진</span>
              <span className="style-sub">photorealistic</span>
            </button>
            <button
              type="button"
              className={`style-card ${
                selectedStyles.includes('minimal clean') ? 'active' : ''
              }`}
              onClick={() => toggleStyle('minimal clean')}
            >
              <span className="style-emoji">◻️</span>
              <span className="style-name">미니멀</span>
              <span className="style-sub">minimal clean</span>
            </button>
          </div>

          <p className="section-label" style={{ marginTop: 6 }}>
            색감 톤
          </p>
          <div className="color-grid">
            <button
              type="button"
              className={`color-chip ${
                selectedColors.includes(
                  'soft pastel pink and rose tones, blush pink, dusty rose',
                )
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                toggleColor(
                  'soft pastel pink and rose tones, blush pink, dusty rose',
                )
              }
            >
              <span
                className="dot"
                style={{
                  background:
                    'linear-gradient(135deg,#f7c8d8,#e8799a)',
                }}
              />
              파스텔 핑크
            </button>
            <button
              type="button"
              className={`color-chip ${
                selectedColors.includes(
                  'soft pastel pink with creamy ivory and warm white accents',
                )
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                toggleColor(
                  'soft pastel pink with creamy ivory and warm white accents',
                )
              }
            >
              <span
                className="dot"
                style={{
                  background:
                    'linear-gradient(135deg,#fff5f8,#f7c8d8)',
                }}
              />
              크리미 핑크
            </button>
            <button
              type="button"
              className={`color-chip ${
                selectedColors.includes(
                  'deep rose and mauve with muted dusty pink tones',
                )
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                toggleColor(
                  'deep rose and mauve with muted dusty pink tones',
                )
              }
            >
              <span
                className="dot"
                style={{
                  background:
                    'linear-gradient(135deg,#e8799a,#c45070)',
                }}
              />
              딥 로즈
            </button>
            <button
              type="button"
              className={`color-chip ${
                selectedColors.includes(
                  'pastel pink with soft lavender and lilac accents',
                )
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                toggleColor(
                  'pastel pink with soft lavender and lilac accents',
                )
              }
            >
              <span
                className="dot"
                style={{
                  background:
                    'linear-gradient(135deg,#f7c8d8,#c8a0d0)',
                }}
              />
              핑크 라벤더
            </button>
          </div>

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

