import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = "font-sans font-bold py-2.5 px-5 rounded-lg active:scale-[0.98] transition-all duration-200 cursor-pointer text-center select-none text-sm";
  
  const variants = {
    primary: "bg-idg-gold text-idg-navy hover:bg-idg-gold-hover shadow-md shadow-idg-gold/15",
    secondary: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20",
    glass: "bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-white/10 transition"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
