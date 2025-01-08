import { FC, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from "next/link";

const supabase = createClientComponentClient();

const AuthForm: FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    try {
      const username = `${firstName} ${lastName}`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setError(error.message);
        console.log(error);
      } else if (data.user) {
        setSuccess("Sign up successful! Please check your email for confirmation.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col w-10/12 h-full items-center">
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="flex flex-row justify-between w-full h-16">
          <div className="flex flex-col w-5/12 h-full">
            <span className="font-cutive text-[0.7rem] ml-1">First Name</span>
            <input
              type="text"
              placeholder="e.g. Hari"
              className="bg-black h-full font-work text-sm rounded-lg pl-2 m-0 w-full focus:outline-none focus:border focus:border-white/40"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-6/12 h-full">
            <span className="font-cutive text-[0.7rem] ml-1">Last Name</span>
            <input
              type="text"
              placeholder="e.g. B. Aacharya"
              className="bg-black h-full font-work text-sm rounded-lg pl-2 m-0 w-full focus:outline-none focus:border focus:border-white/40"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-[4.2em] mt-3">
          <div className="flex flex-col h-full w-full">
            <span className="font-cutive text-[0.7rem] ml-1">Email</span>
            <input
              type="email"
              placeholder="e.g. haribahadur@gmail.com"
              className="bg-black h-full font-work text-sm rounded-lg pl-2 m-0 w-full focus:outline-none focus:border focus:border-white/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-24 mt-3">
          <div className="flex flex-col h-full w-full">
            <span className="font-cutive text-[0.7rem] ml-1">Password</span>
            <input
              type="password"
              placeholder="e.g. sec!!rE@321"
              className="bg-black h-full font-work text-sm rounded-lg pl-2 m-0 w-full focus:outline-none focus:border focus:border-white/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="font-work text-[0.7rem] text-white/35 ml-1 mt-2">
              Must be at least 8 characters long, with a number and a special character.
            </span>
          </div>
        </div>

        {error ? (
          <p className="text-red-500/80 text-[0.7em] font-work mt-2">{error}</p>
        ) : success ? (
          <p className="text-green-500/80 text-[0.7em] font-work mt-2">{success}</p>
        ) : (
          <p>&#8239;</p>
        )}

        <button
          type="submit"
          className="hover:cursor-pointer hover:bg-white transition duration-300 ease-in-out flex flex-col items-center justify-center w-full h-12 rounded-xl mt-3 bg-white/90 last:font-work text-lg text-black font-bold"
        >
          SIGN UP
        </button>
      </form>

      <p className="text-white/[.5] font-work text-xs text-thin mt-4">
        Already have an account?{" "}
        <Link href='/auth/login'><span className="font-bold underline text-[0.9rem] text-white" >Login</span></Link>
      </p>
    </div>
  );
};

export default AuthForm;
