import express, { Request, Response } from "express";
import admin from "firebase-admin";
import { createConnection } from "typeorm";
import cors from "cors";
import { destroyCookie, parseCookies, setCookie } from "nookies";
// import noteRoutes from "./routes/noteRoutes";

import serviceAccount from "../next-firebase-auth-examp-e5e16-firebase-adminsdk-g2u4f-622d64e2e0.json";

const firebaseAdmin =
  admin.apps[0] ||
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200,
};

void createConnection().then((connection) => {
  const app = express();
  app.use(express.json());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cors(corsOptions));

  // app.use("/api/v1/note", noteRoutes);

  // app.get("/secret/userinfo", async (req: Request, res: Response) => {
  //   const idToken = req.header("Authorization");
  //   console.log(idToken);
  //   if (idToken) {
  //     const { uid } = await admin.auth().verifyIdToken(idToken);
  //     console.log(uid);

  //     res.json({ uid });
  //   }
  //   // Authorizationヘッダーが無ければ403
  //   res.status(403).send();
  // });

  app.post("/api/session", async (req: Request, res: Response) => {
    const auth = firebaseAdmin.auth();

    // Tokenの有効期限
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5日

    console.log(req.body);
    // セッションCookieを作成するためのIDを取得
    // eslint-disable-next-line
    const id = req.body.id || "";

    // Cookieに保存するセッションIDを作成する
    const sessionCookie = await auth.createSessionCookie(id, { expiresIn });

    // Cookieのオプション
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
    };

    // セッションIDをCookieに設定する
    setCookie({ res }, "session", sessionCookie, options);
    res.json({ status: "success" });
  });

  app.post("/api/sessionLogout", async (req: Request, res: Response) => {
    const auth = firebaseAdmin.auth();

    // Cookieに保存されているセッションIDを取得する
    const sessionId = parseCookies({ req }).session || "";

    // セッションIDから認証情報を取得する
    const decodedClaims = await auth
      .verifySessionCookie(sessionId)
      .catch(() => null);

    // 全てのセッションを無効にする
    if (decodedClaims) {
      await auth.revokeRefreshTokens(decodedClaims.sub);
    }

    // Cookieに保存されているセッションIDを削除
    destroyCookie({ res }, "session", { path: "/" });

    res.json({ status: "success" });
  });
  // app.get("/login", async (req: Request, res: Response) => {
  //   try {
  //     const User = userRepository.create({
  //       name: "namedayo",
  //       uid: "uiddayo",
  //     });
  //     const results = await userRepository.save(User);
  //     return res.json(results);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  const port = 1234;
  app.listen(port);
  console.log(`server started on: ${port}`);
});
