import React from 'react';

interface PaymentLogoProps {
  className?: string;
}

export const GooglePayLogo: React.FC<PaymentLogoProps> = ({ className = "h-5 w-auto" }) => (
  <img 
    src="/logos/google-pay.png"
    alt="Google Pay"
    className={className}
  />
);

export const ApplePayLogo: React.FC<PaymentLogoProps> = ({ className = "h-5 w-auto" }) => (
  <img 
    src="/logos/Apple-Pay-Logo.png"
    alt="Apple Pay"
    className={className}
  />
);

export const PayPalLogo: React.FC<PaymentLogoProps> = ({ className = "h-5 w-auto" }) => (
  <img 
    src="/logos/Paypal logo.png"
    alt="PayPal"
    className={className}
  />
);

export const StripeLogo: React.FC<PaymentLogoProps> = ({ className = "h-5 w-auto" }) => (
  <img 
    src="/logos/Stripe-Logo.png"
    alt="Stripe"
    className={className}
  />
);

export const CashOnDeliveryLogo: React.FC<PaymentLogoProps> = ({ className = "h-5 w-5" }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" 
      fill="#f97316"
    />
    <circle cx="12" cy="15" r="2" fill="#fff"/>
    <path d="M12 13v4" stroke="#f97316" strokeWidth="1"/>
  </svg>
);

export const CreditCardLogos: React.FC<PaymentLogoProps> = ({ className = "h-5 w-auto" }) => (
  <div className="flex items-center gap-1">
    <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="3" fill="#1A1F71"/>
      <path d="M11.8 6.8h8.4v6.4h-8.4V6.8z" fill="#FF5F00"/>
      <path d="M12.2 10c0-1.3.6-2.4 1.5-3.2-.7-.5-1.5-.8-2.4-.8-2.2 0-4 1.8-4 4s1.8 4 4 4c.9 0 1.7-.3 2.4-.8-.9-.8-1.5-1.9-1.5-3.2z" fill="#EB001B"/>
      <path d="M24.2 10c0 2.2-1.8 4-4 4-.9 0-1.7-.3-2.4-.8.9-.8 1.5-1.9 1.5-3.2s-.6-2.4-1.5-3.2c.7-.5 1.5-.8 2.4-.8 2.2 0 4 1.8 4 4z" fill="#00579F"/>
    </svg>
    <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="3" fill="#1434CB"/>
      <path d="M8 6h16v8H8V6z" fill="white"/>
      <path d="M10 8h2v4h-2V8zm3 0h1v4h-1V8zm2 0h2v4h-2V8zm3 0h1v4h-1V8zm2 0h2v4h-2V8z" fill="#1434CB"/>
      <text x="16" y="11" textAnchor="middle" fontSize="3" fill="#1434CB" fontWeight="bold">VISA</text>
    </svg>
    <svg className="h-5 w-8" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="20" rx="3" fill="#006FCF"/>
      <path d="M8 6h16v8H8V6z" fill="white"/>
      <text x="16" y="11" textAnchor="middle" fontSize="2.5" fill="#006FCF" fontWeight="bold">AMEX</text>
    </svg>
  </div>
);
