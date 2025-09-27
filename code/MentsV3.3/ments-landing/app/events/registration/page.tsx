'use client';

export default function RegistrationPage() {
  return (
    <div className="w-full h-screen bg-white">
      {/* Airtable Form - Full Page */}
      <iframe 
        className="airtable-embed w-full h-full" 
        src="https://airtable.com/embed/appzd95k47AOWSMIp/pagsGVUKkXTMBWRaP/form" 
        frameBorder="0" 
        onWheel={() => {}}
        style={{ 
          background: 'white',
          border: 'none'
        }}
      ></iframe>
    </div>
  );
}