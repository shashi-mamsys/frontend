import './App.css'
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <>
      {/* Simple Landing Page */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to My Chat App</h1>
        <p className="text-gray-700 max-w-md">
          This is a simple landing page. Click the chatbot button at the bottom
          right to start chatting!
        </p>
      </div>

      {/* Floating Chat Widget */}
      <ChatWidget />
    </>
  );
}

export default App;
