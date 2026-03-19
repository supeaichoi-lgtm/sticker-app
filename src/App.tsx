import React, { useState, useRef } from 'react';

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleStyle = (value: string) => {
    setSelectedStyles((prev) =>
      prev.includes(value)
        ? prev.length === 1
          ? prev
          : prev.filter((v) => v !== value)
        : [...prev, value],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors([color]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
      setPrompt('업로드한 사진을 스티커로 변환해줘');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed && !uploadedImage) {
      setError('먼저 단어나 문장을 입력하거나 사진을 업로드해 주세요.');
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

      const fullPrompt = `EXACTLY ONE single die-cut sticker, ${trimmed}${styleText}${colorText}, pure white background, thick white outline around the subject, flat vector illustration, no shadow, transparent-style background, one item only, centered composition, sticker sheet style`;

      const body: Record<string, string> = { prompt: fullPrompt };
      if (uploadedImage) {
        body.image = uploadedImage;
      }

      const res = await fetch('https://ai-sticker-server.onrender.com/api/sticker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const resBody = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(resBody.error ?? `요청에 실패했어요. (status ${res.status})`);
      }

      const resBody = (await res.json()) as StickerResponse;
      setImage(resBody.dataUrl);
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

          {/* 사진 업로드 */}
          <p className="section-label" style={{ marginTop: 18 }}>
            📸 사진으로 스티커 만들기
          </p>
          <div
            className="upload-area"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedImage ? (
              <img src={uploadedImage} alt="업로드된 사진" className="uploaded-preview" />
            ) : (
              <p className="upload-hint">📁 클릭해서 사진 업로드</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          {uploadedImage && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => {
                setUploadedImage(null);
                setPrompt('');
              }}
            >
              ✕ 사진 제거
            </button>
          )}

          <p className="section-label" style={{ marginTop: 18 }}>
            스티커 스타일
          </p>
          <div className="style-grid">
            {[
              { value: 'line art', emoji: '🖊️', name: '손그림 라인', sub: 'line art' },
              { value: 'kawaii cute', emoji: '🐣', name: '카와이', sub: 'kawaii cute' },
              { value: 'vintage floral', emoji: '🌹', name: '빈티지 플로럴', sub: 'vintage floral' },
              { value: 'photorealistic', emoji: '📸', name: '실사 사진', sub: 'photorealistic' },
              { value: 'minimal clean', emoji: '◻️', name: '미니멀', sub: 'minimal clean' },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                className={`style-card ${selectedStyles.includes(s.value) ? 'active' : ''}`}
                onClick={() => toggleStyle(s.value)}
              >
                <span className="style-emoji">{s.emoji}</span>
                <span className="style-name">{s.name}</span>
                <span className="style-sub">{s.sub}</span>
              </button>
            ))}
          </div>

          <p className="section-label" style={{ marginTop: 6 }}>
            색감 톤
          </p>
          <div className="color-grid">
            {[
              { value: 'soft pastel pink and rose tones, blush pink, dusty rose', bg: 'linear-gradient(135deg,#f7c8d8,#e8799a)', label: '파스텔 핑크' },
              { value: 'soft pastel pink with creamy ivory and warm white accents', bg: 'linear-gradient(135deg,#fff5f8,#f7c8d8)', label: '크리미 핑크' },
              { value: 'deep rose and mauve with muted dusty pink tones', bg: 'linear-gradient(135deg,#e8799a,#c45070)', label: '딥 로즈' },
              { value: 'pastel pink with soft lavender and lilac accents', bg: 'linear-gradient(135deg,#f7c8d8,#c8a0d0)', label: '핑크 라벤더' },
            ].map((c) => (
              <button
                key={c.value}
                type="button"
                className={`color-chip ${selectedColors.includes(c.value) ? 'active' : ''}`}
                onClick={() => toggleColor(c.value)}
              >
                <span className="dot" style={{ background: c.bg }} />
                {c.label}
              </button>
            ))}
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
            
              href={image}
              download="sticker.png"
              className="download-btn"
            >
              💾 스티커 저장하기
            </a>
          </section>
        )}
      </div>
    </div>
  );
};
```

