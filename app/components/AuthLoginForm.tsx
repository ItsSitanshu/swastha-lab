import { FC, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClientComponentClient();

const AuthLoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message.charAt(0).toUpperCase() + error.message.slice(1));
      } else if (data.user) {
        setSuccess("Sign in successful!");
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-10/12 h-full items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="flex flex-col items-center w-full h-20">
          <div className="flex flex-col h-full w-full">
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">
              Email
            </span>
            <input
              type="email"
              placeholder="e.g. haribahadur@gmail.com"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-28 mt-3">
          <div className="flex flex-col h-full w-full">
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">
              Password
            </span>
            <input
              type="password"
              placeholder="e.g. sec!!rE@321"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="font-jksans text-[0.5rem] text-foreground/50 ml-1 mt-2">
              Must be at least 8 characters long, with a number and a special
              character.
            </span>
          </div>
        </div>

        {error ? (
          <p className="text-light text-[0.7em] font-jksans mt-2">{error}</p>
        ) : success ? (
          <p className="text-green-500 text-[0.7em] font-jksans mt-2">{success}</p>
        ) : (
          <p>&#8239;</p>
        )}

        <button
          type="submit"
          className="border-2 border-foreground hover:cursor-pointer hover:bg-foreground-100 hover:text-background-100 transition duration-300 ease-in-out flex flex-col items-center justify-center w-full h-12 rounded-xl mt-2 bg-foreground/90 font-jksans text-lg text-foreground font-bold"
        >
          LOGIN
        </button>
      </form>

      <p className="text-foreground/60 font-jksans text-xs mt-4">
        Don't have an account?{" "}
        <Link href="/auth/register">
          <span className="font-bold text-[0.9rem] underline text-foreground">
            Register
          </span>
        </Link>
      </p>
    </div>
  );
};

export default AuthLoginForm;
