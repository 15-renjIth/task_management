import { ArrowUpRight, Chrome, Github, Mail, LockKeyhole } from 'lucide-react';

export default function LoginPage({ onSignIn }) {
  return (
    <div className="login-page"><form className="login-card" onSubmit={(event) => { event.preventDefault(); onSignIn(); }}>
      <div className="brand-mark">O</div><h1>Welcome back</h1><p className="muted">Streamline your flow, effortlessly.</p>
      <button type="button" className="social" onClick={onSignIn}><Chrome size={18} /> Continue with Google</button>
      <button type="button" className="social" onClick={onSignIn}><Github size={18} /> Continue with GitHub</button>
      <div className="or">or continue with email</div>
      <label htmlFor="login-email">Email address</label><div className="input-icon"><Mail size={17} /><input id="login-email" type="email" required placeholder="you@company.com" /></div>
      <label htmlFor="login-password">Password</label><div className="input-icon"><LockKeyhole size={17} /><input id="login-password" type="password" required placeholder="Enter your password" /></div>
      <div className="remember"><label><input type="checkbox" /> Remember this device</label><a onClick={() => window.alert('Password reset is not connected yet.')}>Forgot password?</a></div>
      <button type="submit" className="primary full">Sign In to Dashboard <ArrowUpRight size={17} /></button>
      <p className="muted center">Don't have an account? <a onClick={() => window.alert('Sign-up is not connected yet.')}>Sign up free</a></p>
      <div className="security">✓ 256-bit AES &nbsp; · &nbsp; SOC-2 Certified &nbsp; · &nbsp; 99.99% Operational</div>
    </form></div>
  );
}
