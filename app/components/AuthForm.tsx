import { FC, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClientComponentClient();


const colors = [
  "34A853", // Green
  "4285F4", // Blue
  "FBBC05", // Yellow
  "DB4437", // Red
  "FF9800", // Orange
  "8E24AA", // Purple
  "00ACC1", // Cyan
  "9E9D24", // Lime
];

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
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}%20${lastName}&background=${randomColor}&color=fff`;

        const { data: insertData, error: insertError } = await supabase
          .from("patients")
          .insert([
            {
              name: [firstName, lastName],
              id: data.user.id,
              pfp: avatarUrl,  
              personal: {},
              reserv: [],
              doctors: []
            },
          ]);

        if (insertError) {
          setError("Failed to create doctor entry. Please try again.");
          console.log(insertError);
        } else {
          setSuccess("Sign up successful! Please check your email for confirmation.");
        }
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
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">First Name</span>
            <input
              type="text"
              placeholder="e.g. Hari"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-6/12 h-full">
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">Last Name</span>
            <input
              type="text"
              placeholder="e.g. Acharya"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-[4.2em] mt-3">
          <div className="flex flex-col h-full w-full">
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">Email</span>
            <input
              type="email"
              placeholder="e.g. haribahadur@gmail.com"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-24 mt-3">
          <div className="flex flex-col h-full w-full">
            <span className="font-nue text-[1rem] underline ml-1 text-foreground/80">Password</span>
            <input
              type="password"
              placeholder="e.g. sec!!rE@321"
              className="bg-background border-2 h-14 font-jksans text-[1rem] rounded-lg pl-3 m-0 w-full focus:outline-none focus:border-mod opacity-55 text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="font-jksans text-[0.7rem] text-white/35 ml-1 mt-2">
              Must be at least 8 characters long, with a number and a special character.
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
          className="border-2 border-foreground hover:cursor-pointer hover:bg-foreground hover:text-background transition duration-300 ease-in-out flex flex-col items-center justify-center w-full h-12 rounded-xl mt-2 bg-foreground/90 font-jksans text-lg text-foreground font-bold"
        >
          REGISTER
        </button>
      </form>

      <p className="text-foreground/60 font-jksans text-xs mt-4">
        Already have an account?{" "}
        <Link href="/auth/login">
          <span className="font-bold text-[0.9rem] underline text-foreground">
            Login
          </span>
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
