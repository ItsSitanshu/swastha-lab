import Image from "next/image";
import { FC } from "react";

import googleLogo from "@/app/assets/images/logos/google.svg";
import githubLogo from "@/app/assets/images/logos/github.svg";

const AuthButton: FC = () => {
    function RegisterGoogle() {
        // Google Registration Logic
    }

    function RegisterGithub() {
        // GitHub Registration Logic
    }

    return (
        <>
            <div className="flex flex-row justify-evenly w-10/12 h-16 mt-5 mb-4">
                <div
                    onClick={RegisterGoogle}
                    className="hover:cursor-pointer hover:bg-foreground hover:text-background hover:scale-[1.02] transition duration-300 ease-in-out  
                    flex flex-row justify-center items-center w-2/5 h-full border-[0.5px] border-foreground/20 bg-background rounded-lg"
                >
                    <Image
                        aria-hidden
                        src={googleLogo}
                        alt="Google Icon"
                        width={26}
                        height={26}
                        className="mr-1.5"
                    />
                    <h1 className="font-jksans text-[1rem]">Google</h1>
                </div>

                <div
                    onClick={RegisterGithub}
                    className="hover:cursor-pointer hover:bg-foreground hover:text-background hover:scale-[1.02] transition duration-300 ease-in-out  
                    flex flex-row justify-center items-center w-2/5 h-full border-[0.5px] border-foreground/20 bg-background rounded-lg"
                >
                    <Image
                        aria-hidden
                        src={githubLogo}
                        alt="GitHub Icon"
                        width={28}
                        height={28}
                        className="mr-1.5"
                    />
                    <h1 className="font-jksans text-[1rem]">GitHub</h1>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[2px] opacity-65 bg-foreground mb-4"></div>

            {/* Uncomment if needed */}
            {/* <div className="flex flex-row w-10/12 h-4 mt-4 mb-4 items-center justify-center">
                <span className="text-xs font-nue text-foreground/60">OR</span>
            </div> */}
        </>
    );
};

export default AuthButton;
