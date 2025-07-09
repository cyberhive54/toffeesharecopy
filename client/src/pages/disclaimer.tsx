export default function Disclaimer() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Disclaimer</h1>
          <p className="text-lg text-slate-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Important Information</h2>
            
            <p className="text-slate-600 mb-6">
              The information on this website is provided on an "as is" basis. To the fullest extent 
              permitted by law, ShareWave excludes all representations, warranties, obligations, and 
              liabilities arising out of or in connection with this website and its contents.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Service Availability</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>ShareWave is provided as a free service with no guarantee of availability or uptime.</li>
              <li>We may modify, suspend, or discontinue the service at any time without notice.</li>
              <li>We do not guarantee that the service will be error-free or uninterrupted.</li>
              <li>Connection quality depends on network conditions and device capabilities.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">User Responsibility</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>You are solely responsible for the files you choose to share.</li>
              <li>Ensure you have the right to share any files you upload to the service.</li>
              <li>Do not share copyrighted material without proper authorization.</li>
              <li>Do not share illegal, harmful, or malicious content.</li>
              <li>Verify the identity of recipients before sharing sensitive files.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Security Considerations</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>While we use WebRTC encryption, no method of transmission is 100% secure.</li>
              <li>Ensure your device and browser are up to date with security patches.</li>
              <li>Be cautious when sharing sensitive or confidential information.</li>
              <li>Verify sharing links are sent to intended recipients only.</li>
              <li>Close sharing sessions immediately after transfers complete.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Technical Limitations</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>WebRTC connections may fail due to network configurations or firewalls.</li>
              <li>Large file transfers may be interrupted by network issues or browser limitations.</li>
              <li>Service functionality depends on browser compatibility and feature support.</li>
              <li>Mobile networks may have restrictions affecting peer-to-peer connections.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Content and Accuracy</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>We do not monitor, verify, or validate the content of shared files.</li>
              <li>File transfer integrity is handled by WebRTC protocols.</li>
              <li>We cannot guarantee the accuracy or completeness of transferred files.</li>
              <li>Users should verify file integrity after transfer completion.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Third-Party Services</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>We use Firebase (Google) for signaling coordination.</li>
              <li>We display advertisements through Google AdSense.</li>
              <li>Social media sharing uses third-party platforms.</li>
              <li>QR code functionality may depend on device camera access.</li>
              <li>We are not responsible for third-party service availability or policies.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Limitation of Liability</h3>
            <p className="text-slate-600 mb-4">
              To the maximum extent permitted by applicable law, ShareWave shall not be liable for any:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>Direct, indirect, incidental, special, or consequential damages</li>
              <li>Loss of data, files, or information</li>
              <li>Business interruption or loss of profits</li>
              <li>Damages arising from service unavailability or errors</li>
              <li>Security breaches or unauthorized access to files</li>
              <li>Issues with third-party services or platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Indemnification</h3>
            <p className="text-slate-600 mb-6">
              You agree to indemnify and hold harmless ShareWave from any claims, damages, or expenses 
              arising from your use of the service, including but not limited to your violation of these 
              terms or the rights of third parties.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Governing Law</h3>
            <p className="text-slate-600 mb-6">
              This disclaimer shall be governed by and construed in accordance with applicable laws. 
              Any disputes arising from the use of this service shall be subject to the exclusive 
              jurisdiction of the appropriate courts.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Changes to This Disclaimer</h3>
            <p className="text-slate-600 mb-6">
              We reserve the right to modify this disclaimer at any time. Changes will be effective 
              immediately upon posting on this page. Your continued use of the service after any 
              changes constitutes acceptance of the new terms.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-amber-500 mr-3 mt-1" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Important Notice</h4>
                  <p className="text-amber-700 text-sm">
                    By using ShareWave, you acknowledge that you have read, understood, and agree to 
                    be bound by this disclaimer. If you do not agree with any part of this disclaimer, 
                    you should not use our service.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-8">Contact Information</h3>
            <p className="text-slate-600">
              If you have any questions about this disclaimer, please contact us at:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mt-4">
              <li>Email: legal@sharewave.app</li>
              <li>Contact form: Available on our contact page</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
