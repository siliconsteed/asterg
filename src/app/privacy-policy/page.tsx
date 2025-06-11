export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="max-w-2xl text-lg text-gray-700 text-center">
        This Privacy Policy explains how we collect, use, and protect your information when you use our website. Please review this page regularly for updates.
      </p>
      <ul className="list-disc text-left mt-6 max-w-2xl text-gray-700">
        <li>We respect your privacy and are committed to safeguarding your birth details and chat history.</li>
        <li>We do not sell or share your personal data with third parties.</li>
        <li>For any questions, contact us at <a href="mailto:silliconsteed@gmail.com" className="text-indigo-600 underline">silliconsteed@gmail.com</a>.</li>
      </ul>
    </main>
  );
}
