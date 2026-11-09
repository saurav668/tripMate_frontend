import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearAuthError, loginRequest, registerRequest } from "../features/auth/authSlice";
// import { lovable } from "@/integrations/lovable";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError,setEmailError]=useState<string>("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const {
  loading,
  error,
  registrationSuccess,
  authCompleted
} = useAppSelector((state:any) => state.auth);  

//   const { signIn, signUp } = useAuth();

const dispatch = useAppDispatch();
const navigate = useNavigate();


useEffect(() => {
  if (authCompleted) {
    navigate("/dashboard", { replace: true });
  }
}, [authCompleted, navigate]);

useEffect(() => {
  if (registrationSuccess) {
    toast.success("Account created successfully!");

    setIsLogin(true);
    setPassword("");
    dispatch(clearAuthError());
  }
}, [registrationSuccess, dispatch]);

// const handleValidate = (value: string) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!regex.test(value)) {
//     setEmailError("Please enter a valid email");
//   } else {
//     setEmailError("");
//   }
// };

// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const value = e.target.value;

//   setEmail(value);
//   handleValidate(value);
// };

// const handleBack = () => {
//   navigate("/");
// };

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  dispatch(clearAuthError());

  if (!email.trim() || !password) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (emailError) {
    return;
  }

  if (isLogin) {
    dispatch(
      loginRequest({
        email: email.trim(),
        password,
      }),
    );
  } else {
    if (!fullName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    dispatch(
      registerRequest({
        name: fullName.trim(),
        email: email.trim(),
        password,
      }),
    );
  }
};
  const handleValidate=(event:string)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(event)){
      setEmailError("Please Enter Valid Email");
    }else{
      setEmailError("");
    }
  }
  const handleBack=()=>{
    // setIsLogin(!isLogin);
    navigate("/");
  }
  const handleChange=(e:any)=>{
    setEmail(e.target.value);
    handleValidate(e.target.value);
  }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     if (isLogin) {
//       const { error } = await signIn(email, password);
//       if (error) {
//         toast.error(error.message);
//       } else {
//         toast.success("Welcome back!");
//         navigate("/");
//       }
//     } else {
//       const { error } = await signUp(email, password, fullName);
//       if (error) {
//         toast.error(error.message);
//       } else {
//         toast.success("Account created! Check your email to verify.");
//       }
//     }
//     setLoading(false);
//   };

//   const handleSocialLogin = async (provider: "google" | "apple") => {
//     setSocialLoading(provider);
//     try {
//       const result = await lovable.auth.signInWithOAuth(provider, {
//         redirect_uri: window.location.origin,
//       });
//       if (result.error) {
//         toast.error(result.error.message || `Failed to sign in with ${provider}`);
//       }
//     } catch {
//       toast.error(`Failed to sign in with ${provider}`);
//     }
//     setSocialLoading(null);
//   };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/placeholder.svg')` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <a href="/" className="flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            <span className="font-display text-2xl font-bold">TripMate</span>
          </a>
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl font-bold leading-tight"
            >
              Find Your Perfect<br />Travel Companion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90 max-w-md"
            >
              Join thousands of travelers who've found their ideal trip partners. Your next adventure starts here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 text-sm opacity-80"
            >
              <span>✦ 10K+ Travelers</span>
              <span>✦ 50+ Destinations</span>
              <span>✦ Safe & Verified</span>
            </motion.div>
          </div>
          <p className="text-sm opacity-60">© 2026 TripMate. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <a href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">TripMate</span>
            </a>
          </div>

          <div>
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </button>
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="font-display text-3xl font-bold text-foreground">
                  {isLogin ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {isLogin
                    ? "Sign in to continue your travel journey"
                    : "Start finding your perfect trip partner"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 gap-2 text-sm font-medium"
          //     onClick={() => handleSocialLogin("google")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "google" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Google
            </Button>
            <Button
              variant="outline"
              className="h-12 gap-2 text-sm font-medium"
          //     onClick={() => handleSocialLogin("apple")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "apple" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit}  className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 h-12"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e)=>handleChange(e)}
                  className="pl-10 h-12"
                  required
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading || !!emailError}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearAuthError());
                setPassword("");
              }}
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
