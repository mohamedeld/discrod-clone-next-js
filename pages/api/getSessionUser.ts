// app/api/protected/route.ts (or pages/api/protected.ts if using Pages Router)

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    res.status(200).json(session?.user);
  } else {
    res.status(401).json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }
};

export default handler;
