import * as React from 'react';

interface PasswordResetEmailProps {
  fullName: string;
  resetLink: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  fullName,
  resetLink,
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f97316', padding: '20px', textAlign: 'center' as const }}>
        <h1 style={{ color: 'white', margin: 0 }}>Collibri Pizza</h1>
      </div>

      <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>Password Reset Request</h2>

        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Hello {fullName},
        </p>

        <p style={{ color: '#666', lineHeight: '1.6' }}>
          We received a request to reset your password. Click the button below to create a new password:
        </p>

        <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
          <a
            href={resetLink}
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
            Reset Password
          </a>
        </div>

        <p style={{ color: '#999', fontSize: '14px', lineHeight: '1.6' }}>
          This link will expire in 1 hour. If you didn&apos;t request a password reset,
          you can safely ignore this email.
        </p>

        <p style={{ color: '#999', fontSize: '12px', marginTop: '30px' }}>
          If the button doesn&apos;t work, copy and paste this link into your browser:
          <br />
          <a href={resetLink} style={{ color: '#f97316', wordBreak: 'break-all' as const }}>
            {resetLink}
          </a>
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
