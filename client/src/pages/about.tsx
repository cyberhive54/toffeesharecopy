export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">About ShareWave</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Learn how ShareWave revolutionizes file sharing with secure, peer-to-peer technology
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How ShareWave Works</h2>
            
            <p className="text-slate-600 mb-6">
              ShareWave uses cutting-edge WebRTC (Web Real-Time Communication) technology to enable direct, 
              peer-to-peer file transfers between browsers. This means your files never pass through our servers 
              or any third-party storage - they go directly from your device to the recipient's device.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">The Process</h3>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 mb-6">
              <li>Select the files you want to share</li>
              <li>ShareWave generates a unique, temporary sharing link</li>
              <li>Share the link or QR code with your recipient</li>
              <li>When they open the link, a direct connection is established</li>
              <li>Files transfer securely with end-to-end encryption</li>
              <li>Connection closes automatically when either party leaves</li>
            </ol>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-shield-alt text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">End-to-End Encryption</h4>
                    <p className="text-sm text-slate-600">All transfers are encrypted using WebRTC's built-in security</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-server text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">No Server Storage</h4>
                    <p className="text-sm text-slate-600">Files never touch our servers - direct device-to-device transfer</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-infinity text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">No Size Limits</h4>
                    <p className="text-sm text-slate-600">Share files of any size without restrictions</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-bolt text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Real-Time Transfer</h4>
                    <p className="text-sm text-slate-600">Fast, direct transfers with live progress tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-qrcode text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">QR Code Sharing</h4>
                    <p className="text-sm text-slate-600">Easy mobile sharing with generated QR codes</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-times-circle text-emerald-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Auto-Disconnect</h4>
                    <p className="text-sm text-slate-600">Connections close automatically for security</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Security & Privacy</h3>
            <p className="text-slate-600 mb-4">
              ShareWave is designed with privacy and security as core principles:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
              <li>WebRTC provides automatic end-to-end encryption for all transfers</li>
              <li>No file data is ever stored on our servers</li>
              <li>Sharing links are temporary and expire after use</li>
              <li>Only minimal signaling data is used to establish connections</li>
              <li>All signaling data is automatically deleted after transfers complete</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Technical Details</h3>
            <p className="text-slate-600 mb-4">
              ShareWave leverages modern web technologies to provide a seamless experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li><strong>WebRTC DataChannels:</strong> For direct browser-to-browser communication</li>
              <li><strong>Firebase Realtime Database:</strong> For WebRTC signaling coordination only</li>
              <li><strong>Chunked Transfer:</strong> Efficient handling of large files</li>
              <li><strong>Progressive Web App:</strong> Works great on mobile devices</li>
              <li><strong>Responsive Design:</strong> Optimized for all screen sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
