import React from 'react';

interface WorldlineLogoProps {
  className?: string;
}

const WorldlineLogo: React.FC<WorldlineLogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg viewBox="0 0 200 40" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* WORLDLINE Text */}
        <text x="0" y="28" className="fill-gray-900 dark:fill-white font-bold" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif' }}>
          WORLD<tspan className="font-normal">LINE</tspan>
        </text>
        
        {/* Teal Wave Pattern */}
        <g transform="translate(155, 5)">
          <path d="M0,10 Q5,0 10,10 T20,10" stroke="#5BC0BE" strokeWidth="2" fill="none"/>
          <path d="M5,15 Q10,5 15,15 T25,15" stroke="#5BC0BE" strokeWidth="2" fill="none"/>
          <path d="M10,20 Q15,10 20,20 T30,20" stroke="#5BC0BE" strokeWidth="2" fill="none"/>
        </g>
      </svg>
    </div>
  );
};

export default WorldlineLogo;