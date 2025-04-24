
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '@/components/Nav'
import { useState } from "react";
import Logo from "./Logo";

//Component Layout nhận prop là children để bao bọc các nội dung bên trong
export default function Layout({children}) {
  
  // Khai báo state showNav để điều khiển hiển thị thanh điều hướng trên thiết bị di động
  const [showNav,setShowNav] = useState(false)
   // Lấy thông tin phiên đăng nhập từ NextAuth
  const { data: session } = useSession()
  // Nếu chưa đăng nhập, hiển thị giao diện đăng nhập
  if (!session) {
    
    return(
    <div className="bg-bgGray w-screen h-screen flex items-center">
    <div className="text-center w-full">
    <button onClick={() => signIn('google')} className="bg-blue-400 text-white p-2 px-5 rounded-lg">Login with Google</button>
    </div>
  </div>

    );
  }
   // Nếu đã đăng nhập, hiển thị layout chính
  return (
    <div className="bg-bgGray min-h-screen ">
    <div className="block md:hidden flex items-center p-4">
      <button onClick={() => setShowNav(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="flex justify-center mr-6 grow"><Logo/></div>
     
    </div>
    <div className="flex">
      <Nav show={showNav} />
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  </div>

  );
}
