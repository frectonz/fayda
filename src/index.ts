import { betterFetch } from "@better-fetch/fetch";
import type { User } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { decodeJwt, importJWK, SignJWT } from "jose";

const DISCOVERY_URL =
  "https://esignet.ida.fayda.et/.well-known/openid-configuration";
const USER_INFO_URL = "https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo";
const TOKEN_ENDPOINT = "https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token";

// Default scopes for Fayda authentication
const DEFAULT_SCOPES = ["openid", "profile", "email"];

export interface FaydaOptions {
  clientId: string;
  privateKey: string;
  redirectUrl?: string;
  scopes?: string[];
}

type Fayda = Promise<ReturnType<typeof genericOAuth>>;

export const fayda = async ({
  clientId,
  privateKey,
  redirectUrl,
  scopes,
}: FaydaOptions): Fayda => {
  return genericOAuth({
    config: [
      {
        providerId: "fayda",
        clientId,
        clientSecret: "",

        discoveryUrl: DISCOVERY_URL,
        redirectURI: redirectUrl,

        tokenUrlParams: {
          client_assertion: await generateSignedJwt(clientId, privateKey),
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        },

        scopes: scopes?.length ? scopes : DEFAULT_SCOPES,

        async getUserInfo(tokens) {
          const userInfo = await betterFetch<Blob>(USER_INFO_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
            retry: 5,
          });

          const jwt = await userInfo.data?.text();
          if (!jwt) {
            return null;
          }

          const user = decodeJwt(jwt);

          return {
            id: user?.sub,
            emailVerified: user?.email_verified,
            email: user?.email,
            image: user?.picture,
            name: user?.name,
            ...userInfo.data,
          } as User;
        },
      },
    ],
  });
};

async function generateSignedJwt(clientId: string, privateKey: string) {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: clientId,
    sub: clientId,
    aud: TOKEN_ENDPOINT,
  };

  const decodedKey = Buffer.from(privateKey, "base64").toString();
  const jwkObject = JSON.parse(decodedKey);
  const privateKeyJwk = await importJWK(jwkObject, "RS256");

  const jwt = await new SignJWT(payload)
    .setProtectedHeader(header)
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(privateKeyJwk);

  return jwt;
}
