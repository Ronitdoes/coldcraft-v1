export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Box outline */}
        <rect x="14" y="30" width="72" height="40" rx="4" />
        
        {/* Main snowflake axes */}
        <line x1="50" y1="12" x2="50" y2="88" />
        <line x1="20" y1="20" x2="80" y2="80" />
        <line x1="20" y1="80" x2="80" y2="20" />
        
        {/* Northern branch */}
        <path d="M 40 24 L 50 12 L 60 24" />
        {/* Southern branch */}
        <path d="M 40 76 L 50 88 L 60 76" />
        
        {/* NW branch */}
        <path d="M 20 34 L 20 20 L 34 20" />
        {/* SE branch */}
        <path d="M 66 80 L 80 80 L 80 66" />
        
        {/* NE branch */}
        <path d="M 66 20 L 80 20 L 80 34" />
        {/* SW branch */}
        <path d="M 20 66 L 20 80 L 34 80" />
      </g>
      
      {/* Pointer Cursor (covers the bottom-right lines) */}
      <path 
        d="M 50 50 L 50 85 L 58 77 L 66 94 L 74 90 L 66 73 L 78 73 Z" 
        className="fill-background"
        stroke="currentColor" 
        strokeWidth="4.5" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
