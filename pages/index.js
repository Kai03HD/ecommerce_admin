import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
export default function Home() {
  const {data: session} = useSession();
      return <Layout>
        <div className="text-blue-900 flex justify-between">
          <h2> Xin chào, <b>{session?.user?.name}</b></h2>
         <div className="bg-gray-300 flex text-black gap-1 rounded-lg overflow-hidden">
         <img src={session?.user?.image} alt="" className="w-6 h-6"/>
      <span className="px-2"></span>
          {session?.user?.name}
         </div>
        </div>
      </Layout>
}
