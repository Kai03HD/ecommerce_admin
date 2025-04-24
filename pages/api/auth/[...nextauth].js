import clientPromise from "@/lib/mongodb"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import NextAuth,{getServerSession} from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const adminEmail = ['xuanthaiksd@gmail.com']

export const authOp = {

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({ session, token, user }) => {
      // Thêm thuộc tính "isAdmin" vào session để xác định quyền
      session.isAdmin = adminEmail.includes(session?.user?.email);
      
      // Kiểm tra logic: Nếu không phải admin thì trả session bình thường
      if (session.isAdmin) {
        return session;
      }
     
      
 
    }

    }
  

}
export default NextAuth(authOp)

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOp)
  if(!adminEmail.includes(session?.user?.email))
  {
    res.status(401).json({ error: "You do not have admin privileges." });;
    return false;
  }
  return true
}