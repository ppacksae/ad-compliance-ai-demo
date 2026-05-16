// 3종 배너 SVG 일러스트
function BannerOrange() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="og" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF3C7"/>
          <stop offset="1" stopColor="#FDE68A"/>
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#og)"/>
      {/* accent bar */}
      <rect x="0" y="0" width="6" height="220" fill="#F59E0B"/>
      {/* logo area */}
      <rect x="20" y="16" width="100" height="22" rx="5" fill="#FEE500" opacity="0.7"/>
      <text x="28" y="31" fontSize="11" fontWeight="800" fill="#92400E" fontFamily="sans-serif">KakaoPay Sec.</text>
      {/* main headline */}
      <rect x="20" y="56" width="260" height="38" rx="6" fill="#EF4444" opacity="0.9"/>
      <text x="36" y="82" fontSize="22" fontWeight="900" fill="white" fontFamily="sans-serif">수익률 200% 보장!</text>
      {/* sub headline */}
      <text x="20" y="120" fontSize="15" fontWeight="700" fill="#B45309" fontFamily="sans-serif">지금 당장 가입하세요</text>
      {/* CTA button */}
      <rect x="20" y="138" width="110" height="32" rx="8" fill="#F59E0B"/>
      <text x="36" y="158" fontSize="12" fontWeight="700" fill="white" fontFamily="sans-serif">지금 가입하기 →</text>
      {/* disclaimer */}
      <rect x="0" y="196" width="400" height="24" fill="#92400E" opacity="0.15"/>
      <text x="20" y="212" fontSize="9" fill="#92400E" fontFamily="sans-serif">※ 투자원금은 보장되지 않습니다. 투자 전 설명서 및 약관을 확인하세요.</text>
      {/* decoration circles */}
      <circle cx="340" cy="80" r="60" fill="#FCD34D" opacity="0.25"/>
      <circle cx="370" cy="40" r="35" fill="#FBBF24" opacity="0.2"/>
    </svg>
  )
}

function BannerBlue() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF"/>
          <stop offset="1" stopColor="#BFDBFE"/>
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#bg2)"/>
      <rect x="0" y="0" width="6" height="220" fill="#3B82F6"/>
      <rect x="20" y="16" width="100" height="22" rx="5" fill="#DBEAFE"/>
      <text x="28" y="31" fontSize="11" fontWeight="800" fill="#1D4ED8" fontFamily="sans-serif">KakaoPay Sec.</text>
      {/* stat badge */}
      <rect x="20" y="52" width="140" height="44" rx="8" fill="#2563EB" opacity="0.9"/>
      <text x="32" y="74" fontSize="11" fontWeight="600" fill="#BFDBFE" fontFamily="sans-serif">연간 수익률</text>
      <text x="32" y="92" fontSize="20" fontWeight="900" fill="white" fontFamily="sans-serif">연 8% 수익 기대</text>
      {/* sub */}
      <text x="20" y="118" fontSize="14" fontWeight="600" fill="#1E40AF" fontFamily="sans-serif">국내 ETF로 스마트하게</text>
      <rect x="20" y="132" width="120" height="30" rx="8" fill="#3B82F6"/>
      <text x="36" y="151" fontSize="12" fontWeight="700" fill="white" fontFamily="sans-serif">ETF 시작하기 →</text>
      {/* disclaimer */}
      <rect x="0" y="196" width="400" height="24" fill="#1E40AF" opacity="0.1"/>
      <text x="20" y="212" fontSize="9" fill="#1E40AF" fontFamily="sans-serif">※ 투자원금은 보장되지 않습니다. 투자 전 설명서 및 약관을 확인하세요.</text>
      {/* decoration */}
      <circle cx="340" cy="90" r="70" fill="#93C5FD" opacity="0.2"/>
      <circle cx="380" cy="50" r="40" fill="#60A5FA" opacity="0.15"/>
    </svg>
  )
}

function BannerGreen() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5"/>
          <stop offset="1" stopColor="#A7F3D0"/>
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#gg)"/>
      <rect x="0" y="0" width="6" height="220" fill="#10B981"/>
      <rect x="20" y="16" width="100" height="22" rx="5" fill="#D1FAE5"/>
      <text x="28" y="31" fontSize="11" fontWeight="800" fill="#065F46" fontFamily="sans-serif">KakaoPay Sec.</text>
      <text x="20" y="68" fontSize="22" fontWeight="900" fill="#065F46" fontFamily="sans-serif">ETF 분산투자</text>
      <text x="20" y="90" fontSize="22" fontWeight="900" fill="#059669" fontFamily="sans-serif">시작하세요</text>
      <text x="20" y="116" fontSize="13" fontWeight="500" fill="#047857" fontFamily="sans-serif">다양한 자산에 한 번에 투자</text>
      <rect x="20" y="130" width="130" height="32" rx="8" fill="#10B981"/>
      <text x="34" y="150" fontSize="12" fontWeight="700" fill="white" fontFamily="sans-serif">지금 시작하기 →</text>
      {/* disclaimer */}
      <rect x="0" y="196" width="400" height="24" fill="#065F46" opacity="0.1"/>
      <text x="20" y="212" fontSize="9" fill="#065F46" fontFamily="sans-serif">※ 투자원금은 보장되지 않습니다. 투자 전 설명서 및 약관을 확인하세요.</text>
      {/* decoration */}
      <circle cx="330" cy="100" r="65" fill="#6EE7B7" opacity="0.2"/>
      <circle cx="370" cy="50" r="38" fill="#34D399" opacity="0.15"/>
    </svg>
  )
}

// Banner D (purple) for dashboard pre-populated item
function BannerPurple() {
  return (
    <svg viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="400" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5F3FF"/>
          <stop offset="1" stopColor="#DDD6FE"/>
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#pg)"/>
      <rect x="0" y="0" width="6" height="220" fill="#7C3AED"/>
      <rect x="20" y="16" width="100" height="22" rx="5" fill="#EDE9FE"/>
      <text x="28" y="31" fontSize="11" fontWeight="800" fill="#5B21B6" fontFamily="sans-serif">KakaoPay Sec.</text>
      <text x="20" y="68" fontSize="20" fontWeight="900" fill="#4C1D95" fontFamily="sans-serif">수수료 0원!</text>
      <text x="20" y="92" fontSize="20" fontWeight="900" fill="#7C3AED" fontFamily="sans-serif">지금 개설하세요</text>
      <text x="20" y="116" fontSize="13" fontWeight="500" fill="#6D28D9" fontFamily="sans-serif">주식·ETF 수수료 무료</text>
      <rect x="20" y="130" width="130" height="32" rx="8" fill="#7C3AED"/>
      <text x="34" y="150" fontSize="12" fontWeight="700" fill="white" fontFamily="sans-serif">계좌 개설하기 →</text>
      <rect x="0" y="196" width="400" height="24" fill="#4C1D95" opacity="0.1"/>
      <text x="20" y="212" fontSize="9" fill="#4C1D95" fontFamily="sans-serif">※ 투자원금은 보장되지 않습니다. 투자 전 설명서 및 약관을 확인하세요.</text>
      <circle cx="340" cy="90" r="65" fill="#C4B5FD" opacity="0.2"/>
    </svg>
  )
}

const PREVIEWS = { orange: BannerOrange, blue: BannerBlue, green: BannerGreen, purple: BannerPurple }

export default function BannerPreview({ colorScheme }) {
  const Component = PREVIEWS[colorScheme] || BannerOrange
  return <Component />
}
