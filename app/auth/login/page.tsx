"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import AuthButton from "@/app/components/AuthButton";
import AuthLoginForm from "@/app/components/AuthLoginForm";

import A_heartRateIcon from "@/app/assets/images/icons/A_heart-rate.svg";
import medicineIcon from "@/app/assets/images/icons/medicine.svg";
import stehScopeIcon from "@/app/assets/images/icons/stethscope.svg";
import documentsIcon from "@/app/assets/images/icons/documents.svg";
import allergenIcon from "@/app/assets/images/icons/allergen.svg";
import calendarIcon from "@/app/assets/images/icons/calendar.svg";
import syringeIcon from "@/app/assets/images/icons/syringe.svg";

import demoQrIcon from "@/app/assets/images/demo.svg";

const SloganRotator = () => {
  const slogans = [
    "Healthcare without compromise",
    "Your health, our priority",  
    "Compassionate care for everyone",
  ];

  const [typedSlogan, setTypedSlogan] = useState<string>("");
  const [sloganIndex, setSloganIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const typingSpeed = 100; // Typing speed
  const deletingSpeed = 50; // Deleting speed
  const changingSpeed = 1500; // Pause before deleting or switching slogans

  useEffect(() => {
    let interval: any = 0;

    const currentSlogan = slogans[sloganIndex];

    if (isDeleting) {
      interval = setInterval(() => {
        setTypedSlogan((prev) => prev.slice(0, -1));
      }, deletingSpeed);

      if (typedSlogan === "") {
        clearInterval(interval);
        setIsDeleting(false);
        setSloganIndex((prevIndex) => (prevIndex + 1) % slogans.length);
      }
    } else {
      // Typing effect
      if (typedSlogan.length < currentSlogan.length) {
        interval = setInterval(() => {
          setTypedSlogan((prev) => currentSlogan.slice(0, prev.length + 1));
        }, typingSpeed);
      } else {
        clearInterval(interval);
        setTimeout(() => setIsDeleting(true), changingSpeed);
      }
    }

    return () => clearInterval(interval);
  }, [typedSlogan, isDeleting, sloganIndex, slogans]);

  return (
    <div className="10 w-full h-1/2 z-50 p-20 pt-20">
      <h1 className="text-6xl w-1/2 font-nue text-white font-bold typing-effect">
        {typedSlogan}
      </h1>
    </div>
  );
};

export default function Login() {
  const [rotation, setRotation] = useState<number>(0);

  return (
    <div
      className="flex h-screen w-screen justify-center items-center bg-background text-foreground"
      onClick={() => setRotation((prevRotation) => prevRotation + 90)}
    >
      <div className="flex flex-row justify-center items-center w-11/12 h-[95%] bg-transparent rounded-3xl">
        <div className="w-1/2 h-full relative flex flex-col font-nue items-center justify-center ">
          <div className="w-10/12 h-5/6 flex flex-col font-nue items-center justify-center bg-background text-foreground rounded-3xl">
            <div className="w-9/12 flex flex-col items-center justify-center pt-16">
              <h1 className="text-foreground font-bebas text-3xl">
                Login to your Account
              </h1>
              <p className="text-foreground/[.5] font-jksans text-lg">
                Welcome back! We missed you being here
              </p>
              <AuthButton />
              <AuthLoginForm />
            </div>
          </div>
        </div>
        <div
          className="w-1/2 h-full relative flex flex-row flex-wrap items-center justify-center rounded-3xl"
          style={{
            background: `radial-gradient(100% 80% at 1% 1%, var(--light) -100%, var(--mod) 1%, var(--dark) 70%, var(--brown) 200%)`,
          }}
        >
          <div
            style={{
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: `url('data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAgVBMVEUAAAAvLy8vLy+Hh4eHh4eurq6urq6bm5ubm5umpqampqaurq6tra2tra2tra2srKytra2tra2srKytra2tra2srKysrKysrKytra2srKytra2tra2tra2srKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKyavRYTAAAAK3RSTlMABQALABsAEAAVAB4hAC5gNEVbODFfOk4kSihIK1BXAD5UQWRna2+CcnN+rYM59AAAKfhJREFUeAF0U4ES3SAMkmHndNv//+6UpIc+37irrbECMbGUgh8TZH1+JtqviRk15oS1smpFAzVOsG7omkF06+c+xmCFCARWrnX8njJ4uftY29jHJ9Yflgwg9lwoSYbT87KBFibT6tT+H4mjNtxSM63cOHjaFgbrNj30WJ1tT1+Id1nDthqfrDtyhqDsPi4BHo12O97BgxsHgTcToQcv7Impts9b2RJtJVj9OrtsO5xifdxpNyYVkMywOadF6DHhlGjuVDGIwkGBURQr68+HtSxJzY1gXySm4OfBtaPk62i2bQ3o4wIzSyPSs3l879g/f7+xYSttH0VBBON8QR6b75c/9IU4vJdYRFmurWi+4NCzdmoTokgaslS42vHpzldCyBImxJPM52UXEIp52cXKZUg4fNFBKbLtTWOPffCq9F7iDMKVPxBEV78nfwBvOv0fo1ag9abNQ1H1M5cDeGS4hIDzhabv/44/lnSJiZutPmerU9uyLMu6V6KVPSX/99D3fdr68s/Yaws/vPWmK3rzbbG10zrvv9M+8eJNcFxjz2KM8GOw0eE6m5rhtvSql7+HfTC567xLYblUL3ukG5i/IG++zbbveB17FRjX0eTNh37LzVe25L5+PdilbW7r9tA2hemhG18mLJ5isNu5DLfHQ1aPQxKYJvwMY682fI77xjLz4p86z01h0FEa0jy5Hh/XpAnRt11y34ucbRuc7rtFn8b2eSE+k0pulzwcho7S20cnP1UPAae/5phwIoFTnLtewcnFIxB2okCCuLbDtXaEaNfhydSdRMgkp537Ri5n9q09H/Yz6UtoW6zlTl5Ys6+dBC2T33Ydq2N1C8IDLbptTU3AC2S/96RLc7M/dmgrmiKqOsoh8hTdX/5rQ+pM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')`,
              backgroundBlendMode: "overlay",
              opacity: 0.7,
              pointerEvents: "none",
              zIndex: 10,
              borderRadius: "inherit",
            }}
          />
          <SloganRotator />
          <div className="flex w-full h-1/2 pb-14 mx-12 justify-end gap-5 items-end">
            <div className="flex  w-1/12 aspect-square bg-white rounded-xl z-50">
              <Image
                aria-hidden
                src="/logo.svg"
                alt="File icon"
                width={32}
                height={32}
                className={`transition-transform duration-300 w-full h-full p-3`}
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>
            <div className="flex flex-col items-center justify-between w-1/12 aspect-[1/3.5] bg-white rounded-xl py-3 z-50">
              <Image
                aria-hidden
                src={A_heartRateIcon}
                alt="hr"
                width={32}
                height={32}
                className={`w-10/12 p-1 aspect-square`}
              />
              <Image
                aria-hidden
                src={medicineIcon}
                alt="medicine"
                width={32}
                height={32}
                className={`w-10/12 p-1 aspect-square`}
              />
              <Image
                aria-hidden
                src={stehScopeIcon}
                alt="doc"
                width={32}
                height={32}
                className={`w-10/12 p-1 aspect-square`}
              />
            </div>
            <div className="flex flex-col w-1/3 aspect-[1.2/1.7] bg-gradient-to-br from-white via-white/90 to-white/80 rounded-xl p-5 z-50">
              <div className="flex flex-col h-2/3 w-full">
                <h1 className="font-nue font-bold text-3xl">IDENTITY CARD</h1>
                <div className="flex flex-row w-full">
                  <div className="flex flex-col w-2/3">
                    <div className="flex flex-col w-full">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        NAME
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        Grace Thapa
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        DOB
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        24-02-1998
                      </p>
                    </div>
                    <div className="flex flex-col w-full">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        ID Number
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        20210125
                      </p>
                    </div>
                  </div>
                  <Image
                    aria-hidden
                    src={demoQrIcon}
                    alt="File icon"
                    width={32}
                    height={32}
                    className={`w-1/2 aspect-square`}
                  />
                </div>
                <div className="flex flex-col items-start w-full h-5/6">
                  <div className="flex flex-col w-full">
                    <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                      RESIDENCE
                    </h1>
                    <p className="font-jksans text-black text-[1em] font-semibold">
                      Koteshwor, Kathmandu
                    </p>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-col w-1/2">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        Age
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        55 Years
                      </p>
                    </div>
                    <div className="flex flex-col w-1/2">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        Sex
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        Male
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row w-full">
                    <div className="flex flex-col w-1/2">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        Blood Group
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        A/ve+
                      </p>
                    </div>
                    <div className="flex flex-col w-1/2">
                      <h1 className="font-nue text-xs text-black/60 text-bold font-thin">
                        Prefered Inst.
                      </h1>
                      <p className="font-jksans text-black text-[1em] font-semibold">
                        KIST Medical..
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row w-full pt-2 justify-between items-center">
                    <div className="flex justify-center items-center aspect-square w-1/5 rounded-full bg-black transition duration-300">
                      <Image
                        src={documentsIcon}
                        alt="Documents"
                        className="w-full p-2"
                      />
                    </div>
                    <div className="flex justify-center items-center aspect-square w-1/5 rounded-full bg-black transition duration-300">
                      <Image
                        src={allergenIcon}
                        alt="Allergen"
                        className="w-full p-2"
                      />
                    </div>
                    <div className="flex justify-center items-center aspect-square w-1/5 rounded-full bg-black transition duration-300">
                      <Image
                        src={calendarIcon}
                        alt="Calendar"
                        className="w-full p-2"
                      />
                    </div>
                    <div className="flex justify-center items-center aspect-square w-1/5 rounded-full bg-black transition duration-300">
                      <Image
                        src={syringeIcon}
                        alt="Syringe"
                        className="w-full p-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
