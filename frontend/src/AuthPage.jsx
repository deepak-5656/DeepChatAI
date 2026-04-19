import "./AuthPage.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext.jsx";

function AuthPage() {
    const [mode, setMode] = useState("signin");  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // useNavigate() = React Router hook to programmatically change pages
    const navigate = useNavigate();

    // Get login function from context (defined in App.jsx)
    const { login } = useContext(MyContext);

    // Switch between Sign In and Sign Up tabs
    const switchMode = (newMode) => {
        setMode(newMode);
        setError("");        // Clear error when switching
        setName("");         // Reset form fields
        setEmail("");
        setPassword("");
    };

    // ---- Handle Form Submit ----
    const handleSubmit = async (e) => {
        e.preventDefault();   // Prevent page reload (default form behavior)
        setError("");
        setLoading(true);

        // Determine the API endpoint based on mode
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        const url = mode === "signin"
            ? `${API_BASE_URL}/api/auth/signin`
            : `${API_BASE_URL}/api/auth/signup`;

        const body = mode === "signin"
            ? { email, password }
            : { name, email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {

                setError(data.error || "Something went wrong");
                setLoading(false);
                return;
            }

            login(data.token, data.user, mode === "signup");

            navigate("/chat");

        } catch (err) {
            setError("Network error. Is the server running?");
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                {}
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <i className="fa-solid fa-bolt"></i>
                    </div>
                    <h1>DeepChat</h1>
                    <p>Your AI-powered conversation partner</p>
                </div>

                {}
                <div className="auth-toggle">
                    <button
                        className={mode === "signin" ? "active" : ""}
                        onClick={() => switchMode("signin")}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        className={mode === "signup" ? "active" : ""}
                        onClick={() => switchMode("signup")}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {}
                {error && (
                    <div className="auth-error">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {error}
                    </div>
                )}

                {}
                <form className="auth-form" onSubmit={handleSubmit} key={mode}>

                    {}
                    {mode === "signup" && (
                        <div className="auth-input-group">
                            <label>Name</label>
                            <div className="auth-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <i className="fa-solid fa-user"></i>
                            </div>
                        </div>
                    )}

                    {}
                    <div className="auth-input-group">
                        <label>Email</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                    </div>

                    {}
                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <input
                                type="password"
                                placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={mode === "signup" ? 6 : undefined}
                            />
                            <i className="fa-solid fa-lock"></i>
                        </div>
                    </div>

                    {}
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth-spinner"></span>
                        ) : (
                            mode === "signin" ? "Sign In" : "Create Account"
                        )}
                    </button>
                </form>

                {}
                <div className="auth-footer">
                    <p>Powered by Gemini AI • Built by Deepak ♥</p>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
