export default function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-slate-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Commitment to Privacy</h2>
            
            <p className="text-slate-600 mb-6">
              ShareWave is designed from the ground up to protect your privacy. We believe that your files 
              and data should remain yours, which is why our peer-to-peer architecture ensures that your 
              files never pass through our servers.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Information We Collect</h3>
            
            <h4 className="text-lg font-medium text-slate-800 mb-2">Files and Data</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
              <li><strong>We do NOT collect, store, or access your files.</strong> All file transfers happen directly between devices using WebRTC.</li>
              <li>Files are never uploaded to our servers or any third-party storage.</li>
              <li>We cannot see, access, or recover your files in any way.</li>
            </ul>

            <h4 className="text-lg font-medium text-slate-800 mb-2">Signaling Data</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
              <li>We temporarily store minimal WebRTC signaling data in Firebase Realtime Database to coordinate connections.</li>
              <li>This data includes session identifiers, connection offers/answers, and network information.</li>
              <li>No file content or metadata is included in signaling data.</li>
              <li>All signaling data is automatically deleted within 24 hours or when transfers complete.</li>
            </ul>

            <h4 className="text-lg font-medium text-slate-800 mb-2">Analytics and Usage</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>We may collect anonymous usage statistics to improve our service.</li>
              <li>This includes general usage patterns, error rates, and performance metrics.</li>
              <li>No personal information or file details are included in analytics data.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">How We Use Information</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Signaling data is used solely to establish peer-to-peer connections.</li>
              <li>Anonymous analytics help us improve service reliability and performance.</li>
              <li>We do not use any data for advertising, marketing, or commercial purposes beyond service improvement.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Data Security</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>All file transfers are encrypted end-to-end using WebRTC's built-in encryption.</li>
              <li>Signaling data is transmitted over encrypted connections (HTTPS/WSS).</li>
              <li>Firebase security rules restrict access to signaling data to authorized connections only.</li>
              <li>No sensitive data is stored in cookies or local storage.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Third-Party Services</h3>
            
            <h4 className="text-lg font-medium text-slate-800 mb-2">Firebase (Google)</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
              <li>We use Firebase Realtime Database for WebRTC signaling coordination.</li>
              <li>Google's privacy policy applies to this service.</li>
              <li>Only connection coordination data is stored, never file content.</li>
            </ul>

            <h4 className="text-lg font-medium text-slate-800 mb-2">Google AdSense</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>We display advertisements through Google AdSense to support our service.</li>
              <li>Google may collect data for ad personalization according to their privacy policy.</li>
              <li>You can opt out of personalized ads through Google's ad settings.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Your Rights</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Since we don't store your files or personal data, there's nothing to delete or modify.</li>
              <li>You can close transfers at any time, which immediately terminates all connections.</li>
              <li>You have full control over what files you share and with whom.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Data Retention</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Files: Never stored on our servers.</li>
              <li>Signaling data: Automatically deleted within 24 hours or when transfers complete.</li>
              <li>Analytics data: Aggregated and anonymized, retained for service improvement.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Contact Us</h3>
            <p className="text-slate-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Email: privacy@sharewave.app</li>
              <li>Contact form: Available on our contact page</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Changes to This Policy</h3>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify users of any significant 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
