import * as React from 'react';

interface VerificationEmailProps {
  fullName: string;
  verificationCode: string;
  verificationLink: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  fullName,
  verificationCode,
  verificationLink,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f97316', padding: '20px', textAlign: 'center' as const }}>
        <h1 style={{ color: 'white', margin: 0 }}>Collibri Pizza</h1>
      </div>

      <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Verify Your Email</h2>

        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Hello {fullName},
        </p>

        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Thank you for registering! Please verify your email address using the code below:
        </p>

        <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
          <div
            style={{
              backgroundColor: '#f5f5f5',
              padding: '20px 40px',
              borderRadius: '8px',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                letterSpacing: '8px',
                color: '#333',
              }}
            >
              {verificationCode}
            </span>
          </div>
        </div>

        <p style={{ color: '#666', lineHeight: '1.6', textAlign: 'center' as const }}>
          Or click the button below:
        </p>

        <div style={{ textAlign: 'center' as const, margin: '20px 0' }}>
          <a
            href={verificationLink}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '14px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Verify Email
          </a>
        </div>

        <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6' }}>
          This code will expire in 24 hours. If you didn&apos;t create an account,
          you can safely ignore this email.
        </p>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' as const }}>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          Collibri Pizza - Delicious pizza delivered to your door
        </p>
      </div>
    </div>
  );
};
