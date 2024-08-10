import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Logout from "../Buttons/Logout";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { useRouter } from "next/router";
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";
import Contest from "../Contest/Contest";
import Coding from "../Coding/Coding";

type TopbarProps = {
  problemPage?: boolean;
};

const Topbar: React.FC<TopbarProps> = ({ problemPage }) => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  return (
    <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
      <div
        className={`flex w-full items-center justify-between ${
          !problemPage ? "max-w-[1200px] mx-auto" : ""
        }`}
      >
        <Link href='/' className='h-[22px] flex-1'>
          <h3>SmoothCoder</h3>
        </Link>

        <div className='flex items-center space-x-4 flex-1 justify-end'>
          {!user && (
            <Link
              href='/auth'
              onClick={() =>
                setAuthModalState((prev) => ({
                  ...prev,
                  isOpen: true,
                  type: "login",
                }))
              }
            >
              <button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>
                Sign In
              </button>
            </Link>
          )}
          {user && <Coding/>}
          {user && <Contest/>}
          {user && <Logout />}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
