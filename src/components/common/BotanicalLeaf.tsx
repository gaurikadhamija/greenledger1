import React from 'react';

interface LeafProps {
  className?: string;
  size?: number;
  color?: string;
  secondaryColor?: string;
}

/**
 * A delicate, single organic leaf with fine vein details.
 * Subtle, aesthetic editorial botanical motif.
 */
export const SubtleLeaf: React.FC<LeafProps> = ({
  className = '',
  size = 18,
  color = '#09453d',
  secondaryColor = '#2d6a4f',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 transition-transform duration-300 hover:rotate-6 ${className}`}
      aria-hidden="true"
    >
      {/* Outer leaf blade */}
      <path
        d="M20.5 3.5C20.5 3.5 15.2 3.8 10.4 7.9C5.6 12 4.2 17.5 4.2 17.5C4.2 17.5 9.8 18.2 14.8 14.3C19.8 10.4 20.5 3.5 20.5 3.5Z"
        fill={color}
        fillOpacity="0.2"
        stroke={color}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central vein with stem */}
      <path
        d="M20.5 3.5C17.5 7.5 11 13.5 3.5 20.5"
        stroke={secondaryColor}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Side veins */}
      <path
        d="M14.5 9.5C12.8 9.8 11.5 10.8 11.5 10.8"
        stroke={secondaryColor}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M11 13.2C9.5 13.6 8.5 14.4 8.5 14.4"
        stroke={secondaryColor}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * A paired botanical twin-leaf sprig, ideal for section badges,
 * labels, or framing titles.
 */
export const BotanicalSprig: React.FC<
  LeafProps & { variant?: 'left' | 'right' | 'center' }
> = ({
  className = '',
  size = 20,
  color = '#09453d',
  secondaryColor = '#246b51',
  variant = 'center',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${
        variant === 'right' ? 'scale-x-[-1]' : ''
      } ${className}`}
      aria-hidden="true"
    >
      {/* Primary leaf right */}
      <path
        d="M16 19C16 19 22 17 25 10C28 3 22 2 22 2C22 2 17 5 16 11"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Primary leaf left */}
      <path
        d="M16 19C16 19 10 17 7 10C4 3 10 2 10 2C10 2 15 5 16 11"
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center stem */}
      <path
        d="M16 22V10"
        stroke={secondaryColor}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Center bud */}
      <circle cx="16" cy="7" r="1.5" fill={color} />
    </svg>
  );
};

/**
 * Delicate corner botanical vignette for card corners or section headers.
 */
export const LeafCornerAccent: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = '', position = 'top-right' }) => {
  const getRotation = () => {
    switch (position) {
      case 'top-left':
        return 'rotate-[-90deg]';
      case 'bottom-right':
        return 'rotate-90deg';
      case 'bottom-left':
        return 'rotate-180deg';
      default:
        return '';
    }
  };

  return (
    <div
      className={`pointer-events-none opacity-40 select-none ${getRotation()} ${className}`}
      aria-hidden="true"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path
          d="M44 4C36 5 24 10 18 18C12 26 10 38 10 44"
          stroke="#09453d"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 3"
        />
        <path
          d="M34 10C35 6 39 4 43 4C43 8 41 12 37 13C33 14 34 10 34 10Z"
          fill="#09453d"
          fillOpacity="0.22"
          stroke="#09453d"
          strokeWidth="0.8"
        />
        <path
          d="M24 16C23 12 26 9 30 8C31 12 30 15 27 17C24 18 24 16 24 16Z"
          fill="#27544a"
          fillOpacity="0.22"
          stroke="#27544a"
          strokeWidth="0.8"
        />
        <path
          d="M16 26C14 22 16 19 20 18C21 22 20 25 18 27C16 28 16 26 16 26Z"
          fill="#09453d"
          fillOpacity="0.22"
          stroke="#09453d"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};

/**
 * Aesthetic mini leaf badge pill
 */
export const LeafBadge: React.FC<{
  label: string;
  variant?: 'sage' | 'burgundy' | 'outline';
  className?: string;
}> = ({ label, variant = 'sage', className = '' }) => {
  const styles = {
    sage: 'bg-[#e9f2ec] text-[#09453d] border-[#09453d]/25',
    burgundy: 'bg-[#faedf2] text-[#960d41] border-[#960d41]/25',
    outline: 'bg-transparent text-[#09453d] border-[#cfc7b4]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-medium border ${styles[variant]} ${className}`}
    >
      <SubtleLeaf size={13} color={variant === 'burgundy' ? '#960d41' : '#09453d'} />
      <span>{label}</span>
    </span>
  );
};

/**
 * Botanical Vine Divider: A thin editorial hairline rule with delicate
 * organic leaf shoots sprouting at the center and edges.
 */
export const BotanicalVineDivider: React.FC<{
  className?: string;
  label?: string;
}> = ({ className = '', label }) => {
  return (
    <div
      className={`relative flex items-center justify-center my-10 select-none ${className}`}
      aria-hidden="true"
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#cfc7b4] to-[#cfc7b4]" />

      <div className="mx-4 flex items-center gap-2 text-[#09453d] px-3 py-1 rounded-full bg-[#f4f0e5] border border-[#cfc7b4]/60 shadow-2xs">
        <SubtleLeaf size={15} color="#09453d" />
        {label ? (
          <span className="font-mono text-[10.5px] uppercase tracking-widest text-[#09453d] font-semibold">
            {label}
          </span>
        ) : (
          <BotanicalSprig size={18} color="#09453d" />
        )}
        <SubtleLeaf
          size={15}
          color="#2d6a4f"
          className="scale-x-[-1]"
        />
      </div>

      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#cfc7b4] to-[#cfc7b4]" />
    </div>
  );
};

/**
 * Ambient Leaf Breeze: Ethereal, slow-floating translucent botanical leaves
 * that gently drift across the background like a gentle breeze on a university quad.
 * 100% pointer-events-none and non-intrusive.
 */
export const AmbientLeafBreeze: React.FC<{
  className?: string;
  density?: 'sparse' | 'medium';
}> = ({ className = '', density = 'sparse' }) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* Drifting Leaf 1 - Top Left towards Center */}
      <div
        className="absolute top-[8%] left-[6%] opacity-25"
        style={{
          animation: 'leaf-drift-1 22s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }}
      >
        <SubtleLeaf size={28} color="#09453d" secondaryColor="#2d6a4f" />
      </div>

      {/* Drifting Leaf 2 - Top Right towards Left */}
      <div
        className="absolute top-[18%] right-[8%] opacity-20"
        style={{
          animation: 'leaf-drift-2 26s cubic-bezier(0.4, 0, 0.2, 1) 4s infinite',
        }}
      >
        <SubtleLeaf size={34} color="#27544a" secondaryColor="#57927f" />
      </div>

      {/* Drifting Leaf 3 - Mid Right towards Bottom */}
      <div
        className="absolute top-[48%] right-[14%] opacity-22"
        style={{
          animation: 'leaf-drift-3 24s cubic-bezier(0.4, 0, 0.2, 1) 8s infinite',
        }}
      >
        <SubtleLeaf size={26} color="#09453d" secondaryColor="#2d6a4f" />
      </div>

      {/* Drifting Leaf 4 - Mid Left downwards */}
      <div
        className="absolute top-[62%] left-[10%] opacity-25"
        style={{
          animation: 'leaf-drift-1 28s cubic-bezier(0.4, 0, 0.2, 1) 12s infinite',
        }}
      >
        <SubtleLeaf size={30} color="#246b51" secondaryColor="#57927f" />
      </div>

      {density === 'medium' && (
        <>
          {/* Drifting Leaf 5 - Lower Center */}
          <div
            className="absolute top-[78%] left-[45%] opacity-18"
            style={{
              animation: 'leaf-drift-2 30s cubic-bezier(0.4, 0, 0.2, 1) 16s infinite',
            }}
          >
            <SubtleLeaf size={24} color="#09453d" secondaryColor="#2d6a4f" />
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Botanical Laurel Wreath Crest:
 * Classic collegiate laurel wreath for institutional energy scores,
 * A+ ratings, and ISO/GHG verification certificates.
 */
export const BotanicalWreathCrest: React.FC<{
  children?: React.ReactNode;
  size?: number;
  className?: string;
}> = ({ children, size = 68, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Laurel Wreath SVG */}
      <svg
        viewBox="0 0 80 80"
        fill="none"
        className="absolute inset-0 w-full h-full text-[#09453d] opacity-80"
      >
        {/* Left branch */}
        <path
          d="M 40 72 C 22 72 10 56 12 38 C 14 24 24 14 36 10"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 22 66 C 18 64 14 68 18 72 C 20 70 24 68 22 66 Z"
          fill="currentColor"
        />
        <path
          d="M 14 54 C 10 52 8 57 12 60 C 14 58 17 55 14 54 Z"
          fill="currentColor"
        />
        <path
          d="M 12 40 C 8 38 6 43 10 46 C 12 44 15 41 12 40 Z"
          fill="currentColor"
        />
        <path
          d="M 16 26 C 12 24 11 29 15 32 C 17 30 19 27 16 26 Z"
          fill="currentColor"
        />
        <path
          d="M 24 16 C 20 14 20 19 24 21 C 26 19 27 16 24 16 Z"
          fill="currentColor"
        />

        {/* Right branch */}
        <path
          d="M 40 72 C 58 72 70 56 68 38 C 66 24 56 14 44 10"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 58 66 C 62 64 66 68 62 72 C 60 70 56 68 58 66 Z"
          fill="currentColor"
        />
        <path
          d="M 66 54 C 70 52 72 57 68 60 C 66 58 63 55 66 54 Z"
          fill="currentColor"
        />
        <path
          d="M 68 40 C 72 38 74 43 70 46 C 68 44 65 41 68 40 Z"
          fill="currentColor"
        />
        <path
          d="M 64 26 C 68 24 69 29 65 32 C 63 30 61 27 64 26 Z"
          fill="currentColor"
        />
        <path
          d="M 56 16 C 60 14 60 19 56 21 C 54 19 53 16 56 16 Z"
          fill="currentColor"
        />
      </svg>

      {/* Embedded Center Content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
