import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "ornek@email.com" },
        sifre: { label: "Şifre", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
          });
          
          const data = await res.json();

          if (res.ok && data.basarili && data.veri) {
            // NextAuth'un beklediği formata dönüştür
            return {
              id: data.veri.id,
              name: data.veri.kullanici_adi,
              email: data.veri.email,
              image: data.veri.avatar_url,
              rol: data.veri.rol,
              uzmanlik_alani: data.veri.uzmanlik_alani,
              karma_puani: data.veri.karma_puani || 0,
              token: data.veri.token
            };
          }
          // Hata durumunda null döndür
          return null;
        } catch (error) {
          console.error("Auth hatası:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.rol = user.rol;
        token.uzmanlik_alani = user.uzmanlik_alani;
        token.karma_puani = user.karma_puani;
        token.accessToken = user.token; // Backend'den gelen JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.rol = token.rol;
        session.user.uzmanlik_alani = token.uzmanlik_alani;
        session.user.karma_puani = token.karma_puani;
        session.accessToken = token.accessToken; // API istekleri için
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: '/giris', // Özel giriş sayfası
  },
  secret: process.env.NEXTAUTH_SECRET || "cokgizli_pmos_secret_key_2026",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
