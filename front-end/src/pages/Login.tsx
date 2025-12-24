// import React, { useState } from 'react';
// import { Calendar, ArrowRight, Shield, Loader2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { UserRole } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

// import { useAuth } from '../contexts/AuthContext';

// const Login: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const { loginWithAzureAd } = useAuth();

//   const roles: { value: UserRole; label: string; description: string; icon: string }[] = [
//     {
//       value: 'Admin',
//       label: 'Admin',
//       description: 'Full system access and management',
//       icon: '👑',
//     },
//     {
//       value: 'Organizer',
//       label: 'Organizer',
//       description: 'Create and manage events',
//       icon: '📋',
//     },
//     {
//       value: 'Speaker',
//       label: 'Speaker',
//       description: 'Manage sessions and presentations',
//       icon: '🎤',
//     },
//     {
//       value: 'Participant',
//       label: 'Participant',
//       description: 'Register and attend events',
//       icon: '👤',
//     },
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       await login(email, password, selectedRole);
//       if (selectedRole === 'Participant') {
//         navigate('/home');
//       } else {
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       setError('Invalid credentials. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAzureLogin = () => {
//     console.log('Azure AD login clicked');
//   };

//   const handleForgotPassword = () => {
//     console.log('Forgot password clicked');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-6xl"
//       >
//         <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
//           <div className="grid md:grid-cols-5">
//             {/* Left Side - Worldline Branding - Reduced to 2 columns */}
//             <div className="md:col-span-2 bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white flex flex-col justify-center">
//               {/* Worldline Logo Style - Smaller */}
//               <div className="flex justify-center mb-6">
//                 <div className="relative">
//                   <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
//                     <Calendar className="w-9 h-9 text-white" />
//                   </div>
//                   {/* Teal wave accent */}
//                   <div className="absolute -right-1 -bottom-1 w-6 h-6">
//                     <svg viewBox="0 0 24 24" className="w-full h-full">
//                       <path d="M0,12 Q6,6 12,12 T24,12" stroke="white" strokeWidth="2.5" fill="none" opacity="0.5"/>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
              
//               <h1 className="text-3xl font-bold mb-1 text-center">
//                 EVENT<span className="font-normal">TRACK</span>
//               </h1>
//               <p className="text-center text-white/90 mb-1 text-xs">Powered by Worldline</p>
//               <p className="text-center text-white/80 mb-6 text-sm px-4">
//                 Streamline your event management with powerful tools and insights
//               </p>

//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
//                     <span className="text-lg">📊</span>
//                   </div>
//                   <p className="text-white/90 text-sm">Real-time analytics and reporting</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
//                     <span className="text-lg">🤖</span>
//                   </div>
//                   <p className="text-white/90 text-sm">AI-powered recommendations</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
//                     <span className="text-lg">🔔</span>
//                   </div>
//                   <p className="text-white/90 text-sm">Automated communications</p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Side - Login Form - Expanded to 3 columns */}
//             <div className="md:col-span-3 p-8">
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
//                   Welcome Back
//                 </h2>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Sign in to access your account
//                 </p>
//               </div>

//               {/* Azure AD SSO - Smaller */}
//               <button
//                 // onClick={handleAzureLogin}
//                 onClick={loginWithAzureAd}
//                 className="w-full mb-4 flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm font-medium"
//               >
//                 <Shield className="w-4 h-4" />
//                 <span>Sign in with Azure AD</span>
//               </button>

//               <div className="relative mb-4">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
//                 </div>
//                 <div className="relative flex justify-center text-xs">
//                   <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
//                 </div>
//               </div>

//               {/* Role Selection - Smaller */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Select Your Role
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {roles.map((role) => (
//                     <button
//                       key={role.value}
//                       type="button"
//                       onClick={() => setSelectedRole(role.value)}
//                       className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
//                         selectedRole === role.value
//                           ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-sm'
//                           : 'border-gray-300 dark:border-gray-700 hover:border-primary-300'
//                       }`}
//                     >
//                       <div className="text-xl mb-1">{role.icon}</div>
//                       <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
//                         {role.label}
//                       </div>
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
//                         {role.description}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Login Form - Compact */}
//               <form onSubmit={handleSubmit} className="space-y-3">
//                 {error && (
//                   <div className="p-2.5 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
//                     <p className="text-xs text-error-600 dark:text-error-400">{error}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
//                     placeholder="you@example.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all duration-200 text-gray-900 dark:text-gray-100"
//                     placeholder="••••••••"
//                     required
//                   />
//                 </div>

//                 <div className="flex items-center justify-between text-xs">
//                   <label className="flex items-center">
//                     <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500 w-3.5 h-3.5" />
//                     <span className="ml-1.5 text-gray-600 dark:text-gray-400">Remember me</span>
//                   </label>
//                   <button
//                     type="button"
//                     onClick={handleForgotPassword}
//                     className="text-primary-600 hover:text-primary-700 font-medium"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 dark:bg-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mt-4"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span>Signing In...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Sign In as {selectedRole}</span>
//                       <ArrowRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithAzureAd } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Organizer' | 'Speaker' | 'Participant'>('Participant');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAzureAdLogin = async () => {
    setError('');
    try {
      await loginWithAzureAd();
    } catch (err: any) {
      setError(err.message || 'Azure AD login failed');
      console.error('Azure AD login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="flex gap-8 max-w-6xl w-full">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-12 flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">EVENTTRACK</h1>
            <p className="text-cyan-100 text-lg">Powered by Worldline</p>
          </div>
          <div className="space-y-6">
            <p className="text-white text-lg font-semibold">Streamline your event management with powerful tools and insights</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <span className="text-white">Real-time analytics and reporting</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <span className="text-white">AI-powered recommendations</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📢</span>
                <span className="text-white">Automated communications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 mb-8">Sign in to access your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Azure AD Login */}
          <button
            onClick={handleAzureAdLogin}
            className="w-full mb-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            🔐 Sign in with Azure AD
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="text-white text-sm font-semibold mb-3 block">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'Admin' as const, label: 'Admin', icon: '👑', desc: 'Full system access' },
                { value: 'Organizer' as const, label: 'Organizer', icon: '📋', desc: 'Create and manage events' },
                { value: 'Speaker' as const, label: 'Speaker', icon: '🎤', desc: 'Manage sessions' },
                { value: 'Participant' as const, label: 'Participant', icon: '👤', desc: 'Attend events' },
              ].map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedRole === role.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-xl mb-1">{role.icon}</div>
                  <div className="font-semibold text-white text-sm">{role.label}</div>
                  <div className="text-gray-400 text-xs">{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div>
              <label className="text-white text-sm font-semibold block mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm font-semibold block mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-gray-400 text-sm">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-cyan-500 hover:text-cyan-400 text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition"
            >
              {isLoading ? 'Signing in...' : `Sign In as ${selectedRole}`}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <a href="/register" className="text-cyan-500 hover:text-cyan-400 font-semibold">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;