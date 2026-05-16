import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// ── 더미 아티클 ───────────────────────────────────────────────────────────────
const ARTICLES = [
  {
    id: 1, category: '금융·핀테크', date: '2026.04.05',
    title: '2026년 1분기 MTS 이용 행태 분석 — 세대별 투자 패턴의 변화',
    colors: ['#FFF9C4', '#FFE082', '#FFC107'],
    shape: 'chart',
  },
  {
    id: 2, category: '경제·정책', date: '2026.04.04',
    title: '기준금리 동결 이후 개인투자자 주식 매수 동향 리포트',
    colors: ['#DBEAFE', '#BFDBFE', '#60A5FA'],
    shape: 'people',
  },
  {
    id: 3, category: 'IT·기술', date: '2026.04.04',
    title: 'LLM 기반 금융 챗봇 도입 현황 — 국내 증권사 비교 분석',
    colors: ['#F3E8FF', '#E9D5FF', '#A855F7'],
    shape: 'tech',
  },
  {
    id: 4, category: '증권·투자', date: '2026.04.03',
    title: '국내 증권사 ETF 라인업 확대 현황, 투자자 반응 및 시장 영향',
    colors: ['#D1FAE5', '#A7F3D0', '#34D399'],
    shape: 'growth',
  },
  {
    id: 5, category: '금융·핀테크', date: '2026.04.03',
    title: '간편투자 시장 2026년 전망 — 주요 증권사 포지셔닝 분석',
    colors: ['#FEE2E2', '#FECACA', '#F87171'],
    shape: 'people',
  },
  {
    id: 6, category: '경제·정책', date: '2026.04.02',
    title: '인구 감소 지역 금융 취약계층 지원 정책 및 핀테크 역할 조망',
    colors: ['#FFF7ED', '#FED7AA', '#FB923C'],
    shape: 'chart',
  },
  {
    id: 7, category: 'IT·기술', date: '2026.04.01',
    title: '금융권 클라우드 전환 가속화 — 보안·규제 현황과 향후 과제',
    colors: ['#F0FDF4', '#BBF7D0', '#4ADE80'],
    shape: 'tech',
  },
  {
    id: 8, category: '증권·투자', date: '2026.04.01',
    title: '2030 세대 해외주식 투자 분석 — 미국주식 쏠림과 분산 전략',
    colors: ['#EEF2FF', '#C7D2FE', '#818CF8'],
    shape: 'growth',
  },
  {
    id: 9, category: '금융·핀테크', date: '2026.03.31',
    title: '핀테크 기반 금융 서비스 성과 리뷰 및 향후 확장 전략 분석',
    colors: ['#FFFBEB', '#FDE68A', '#FBBF24'],
    shape: 'people',
  },
]

const CATEGORIES = ['전체', '금융·핀테크', '증권·투자', '경제·정책', 'IT·기술']

// ── SVG 일러스트 플레이스홀더 ─────────────────────────────────────────────────
function IllustPlaceholder({ colors, shape }) {
  const [c1, c2, c3] = colors
  if (shape === 'chart') return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="280" height="160" fill={c1} />
      <rect x="30" y="90" width="30" height="50" rx="4" fill={c3} opacity="0.7"/>
      <rect x="75" y="65" width="30" height="75" rx="4" fill={c3} opacity="0.85"/>
      <rect x="120" y="45" width="30" height="95" rx="4" fill={c3}/>
      <rect x="165" y="55" width="30" height="85" rx="4" fill={c3} opacity="0.9"/>
      <rect x="210" y="30" width="30" height="110" rx="4" fill={c3}/>
      <polyline points="45,85 90,60 135,40 180,50 225,25" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="45" cy="85" r="4" fill="white"/>
      <circle cx="90" cy="60" r="4" fill="white"/>
      <circle cx="135" cy="40" r="4" fill="white"/>
      <circle cx="180" cy="50" r="4" fill="white"/>
      <circle cx="225" cy="25" r="4" fill="white"/>
    </svg>
  )
  if (shape === 'people') return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="280" height="160" fill={c1}/>
      <ellipse cx="100" cy="130" rx="60" ry="20" fill={c2} opacity="0.5"/>
      <circle cx="100" cy="75" r="25" fill={c3} opacity="0.9"/>
      <rect x="78" y="100" width="44" height="40" rx="10" fill={c3} opacity="0.7"/>
      <ellipse cx="185" cy="130" rx="50" ry="18" fill={c2} opacity="0.4"/>
      <circle cx="185" cy="80" r="20" fill={c3} opacity="0.7"/>
      <rect x="165" y="100" width="40" height="36" rx="9" fill={c3} opacity="0.55"/>
    </svg>
  )
  if (shape === 'tech') return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="280" height="160" fill={c1}/>
      <rect x="40" y="30" width="200" height="100" rx="12" fill={c2}/>
      <rect x="55" y="45" width="170" height="70" rx="8" fill="white" opacity="0.7"/>
      <rect x="65" y="58" width="60" height="8" rx="4" fill={c3} opacity="0.8"/>
      <rect x="65" y="72" width="100" height="6" rx="3" fill={c3} opacity="0.5"/>
      <rect x="65" y="84" width="80" height="6" rx="3" fill={c3} opacity="0.4"/>
      <circle cx="200" cy="80" r="22" fill={c3} opacity="0.5"/>
      <path d="M190 80 L197 87 L213 72" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  // growth
  return (
    <svg viewBox="0 0 280 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="280" height="160" fill={c1}/>
      <path d="M20 140 Q80 80 140 90 Q200 100 260 20" stroke={c3} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M20 140 Q80 80 140 90 Q200 100 260 20 L260 160 L20 160Z" fill={c3} opacity="0.15"/>
      <circle cx="140" cy="90" r="7" fill={c3}/>
      <circle cx="260" cy="20" r="9" fill={c3}/>
      <circle cx="20" cy="140" r="5" fill={c3} opacity="0.6"/>
      <rect x="170" y="50" width="60" height="28" rx="8" fill="white" opacity="0.85"/>
      <rect x="178" y="59" width="20" height="4" rx="2" fill={c3}/>
      <rect x="178" y="67" width="35" height="4" rx="2" fill={c3} opacity="0.5"/>
    </svg>
  )
}

// ── 아티클 카드 ────────────────────────────────────────────────────────────────
function ArticleCard({ article }) {
  return (
    <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
      <div className="h-[180px] overflow-hidden">
        <IllustPlaceholder colors={article.colors} shape={article.shape} />
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-[#191919] leading-snug mb-3 group-hover:text-[#374151] line-clamp-2">
          {article.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
            {article.category}
          </span>
          <span className="text-[11px] text-[#C4C4C4]">{article.date}</span>
        </div>
      </div>
    </div>
  )
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
export default function InsightsView() {
  const [activeCategory, setActiveCategory] = useState('전체')

  const filtered = activeCategory === '전체'
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === activeCategory)

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* 헤더 */}
      <div className="px-8 pt-7 pb-5 border-b border-[#F0F0F0]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#191919] mb-1">AI 인사이트</h1>
            <p className="text-sm text-[#9CA3AF]">AI가 매일 분석하는 증권·금융 관련 리포트</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#9CA3AF] bg-[#F9F9F9] border border-[#E8E8E8] rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-colors">
            업데이트순 <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex items-center gap-2 px-8 py-4 border-b border-[#F0F0F0] overflow-x-auto scrollbar-thin flex-shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full border transition-all flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-[#191919] text-white border-[#191919] font-medium'
                : 'text-[#374151] border-[#E8E8E8] hover:border-[#9CA3AF] bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#C4C4C4]">
              <p className="text-sm">해당 카테고리의 리포트가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
