import { ClipboardCheck, CalendarCheck, BellPlus, BarChart3 } from 'lucide-react';

export default function App() {
  return (
    <div className="app">
      <div className="header-section">
        <p className="date">0000년 0월00일</p>
        <h1 className="title">오늘도 금연을 이어가고 있어요!</h1>
        <p className="subtitle">
          나의 흡연유형:<br />
          금연 00일차
        </p>
      </div>

      <div className="icon-circle">
        <div className="clipboard-icon">
          <ClipboardCheck size={80} strokeWidth={1.5} />
        </div>
        <div className="no-smoking-icon">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="#8B1538" strokeWidth="3" fill="white" />
            <line x1="12" y1="28" x2="44" y2="28" stroke="#8B1538" strokeWidth="3" />
            <rect x="16" y="22" width="12" height="4" rx="1" fill="#8B1538" />
            <rect x="16" y="30" width="8" height="3" rx="1" fill="#8B1538" />
            <path d="M32 22 Q38 22 38 28 Q38 34 32 34" stroke="#8B1538" strokeWidth="3" fill="none" />
            <line x1="12" y1="12" x2="44" y2="44" stroke="#8B1538" strokeWidth="3" />
          </svg>
        </div>
      </div>

      <div className="main-text">
        <h2>지금 당배 피우고 싶어요</h2>
        <p>30초만 멈추고 체크하기</p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card-content">
            <h3>금연 캘린더</h3>
            <p>체크리스트와 금연일기 확인하기</p>
          </div>
          <div className="card-icon gray-circle">
            <CalendarCheck size={48} strokeWidth={1.5} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>금단현상 알리미</h3>
            <p>금연 00일자에 맞는<br />금단현상 정보를 확인합니다.</p>
          </div>
          <div className="card-icon gray-circle bell-icon">
            <BellPlus size={48} strokeWidth={1.5} />
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <h3>나의 금연분석</h3>
            <p>흡연충동 패턴 분석하기</p>
          </div>
          <div className="card-icon gray-circle chart-icon">
            <BarChart3 size={48} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
        }

        .header-section {
          text-align: left;
          width: 100%;
          max-width: 400px;
          margin-bottom: 24px;
        }

        .date {
          font-size: 16px;
          color: #000000;
          margin-bottom: 4px;
        }

        .title {
          font-size: 26px;
          font-weight: 800;
          color: #000000;
          line-height: 1.3;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 18px;
          font-weight: 700;
          color: #E85A5A;
          line-height: 1.4;
        }

        .icon-circle {
          width: 180px;
          height: 180px;
          background: #E85A5A;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          margin-bottom: 24px;
        }

        .clipboard-icon {
          color: #333333;
        }

        .no-smoking-icon {
          position: absolute;
          bottom: 20px;
          right: 20px;
        }

        .main-text {
          text-align: center;
          margin-bottom: 32px;
        }

        .main-text h2 {
          font-size: 24px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 6px;
        }

        .main-text p {
          font-size: 18px;
          font-weight: 600;
          color: #888888;
        }

        .cards {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border: 3px dashed #888888;
          border-radius: 20px;
          background: #ffffff;
        }

        .card-content {
          flex: 1;
        }

        .card-content h3 {
          font-size: 18px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 6px;
        }

        .card-content p {
          font-size: 13px;
          color: #888888;
          line-height: 1.4;
        }

        .card-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .gray-circle {
          background: #C8C8C8;
          color: #333333;
        }

        .bell-icon {
          position: relative;
        }

        .bell-icon::after {
          content: '+';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 18px;
          height: 18px;
          background: #C0395A;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-icon {
          position: relative;
        }

        .chart-icon::after {
          content: '!';
          position: absolute;
          top: 8px;
          right: 16px;
          color: #C0395A;
          font-size: 20px;
          font-weight: 800;
        }
      `}</style>
    </div>
  );
}
