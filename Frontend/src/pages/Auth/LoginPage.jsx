import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Ui/Input";
import Button from "../../components/Ui/Button";
import Card from "../../components/Ui/Card";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">RPMS Login</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border p-3 outline-none focus:border-red-700"
          />
        </div>

        <div className="mb-6">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border p-3 outline-none focus:border-red-700"
          />
        </div>

        <Button
          varient="primary"
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-red-800 py-3 font-semibold text-white hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Card>
  );
};

export default LoginPage;
