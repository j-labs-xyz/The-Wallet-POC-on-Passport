"use client";
import { useState } from "react";
import { createPassportClient } from "@0xpass/passport-viem";
import { http } from "viem";
import { mainnet } from "viem/chains";
import { usePassport } from "./hooks/usePassport";
import { TESTNET_RSA_PUBLIC_KEY } from "@0xpass/passport";

import theWalletAuthenticaionService from "./AuthenticationService";

export const Page = () => {
  const [username, setUsername] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [authenticateSetup, setAuthenticateSetup] = useState(false);
  const [signMessageLoading, setSignMessageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSignature, setMessageSignature] = useState("");
  const [authenticatedHeader, setAuthenticatedHeader] = useState({});
  const [address, setAddress] = useState("");

  const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
  const fallbackProvider = http(alchemyUrl);

  const userInput = {
    username: username,
    userDisplayName: username,
  };

  const { passport } = usePassport({
    ENCLAVE_PUBLIC_KEY: TESTNET_RSA_PUBLIC_KEY,
    // scope_id: "07907e39-63c6-4b0b-bca8-377d26445172", // original
    // scope_id: "43ca2cb8-886e-417f-9e31-0c0c5b3acd1e", // localhost:4943
    scope_id: "4b8e66a2-bf1f-4d9d-8df8-7f7aa7502370", // localhost:3000
  });

  async function register() {
    setRegistering(true);
    try {
      await passport.setupEncryption();
      // const res = await passport.register(userInput);
      const res = await theWalletAuthenticaionService.register(userInput);
      console.log(res);

      if (res.result.account_id) {
        setRegistering(false);
        setAuthenticating(true);
        await authenticate();
        setAuthenticating(false);
      }
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setRegistering(false);
      setAuthenticating(false);
    }
  }

  async function authenticate() {
    setAuthenticating(true);
    try {
      await passport.setupEncryption();
      const [authenticatedHeader, address] = await theWalletAuthenticaionService.authenticate(
        userInput
      );
      setAuthenticatedHeader(authenticatedHeader);
      console.log(address);
      setAddress(address);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setAuthenticating(false);
    }
  }

  function createWalletClient() {
    return createPassportClient(authenticatedHeader, fallbackProvider, mainnet);
  }

  async function signMessage(message) {
    try {
      setSignMessageLoading(true);
      const client = createWalletClient();
      const [address] = await client.getAddresses();
      const response = await client.signMessage({
        account: address,
        message,
      });

      setMessageSignature(response);
      setSignMessageLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white text-black">
      <div
        className={`text-2xl font-bold mb-8 ${
          authenticated ? "text-green-500" : "text-red-500"
        }`}
      >
        {authenticated ? "Authenticated" : "Not authenticated"}
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold underline">
          Passport Protocol Quickstart
        </h1>
        <p className="mt-2 text-lg">
          This is a quickstart guide for the Passport Protocol SDK.
        </p>

        <div className="flex flex-col mt-4 space-y-4">
          {authenticated ? (
            <>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold">Address</div>
                  <div>{address}</div>
                </div>
              </div>

              {messageSignature && (
                <div className="flex flex-col space-y-4 max-w-[60ch] break-words">
                  <div className="font-bold">Message Signature</div>
                  <div>{messageSignature}</div>
                </div>
              )}

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-1 rounded p-2 border-black mb-4 ml-2 text-center"
                placeholder="Message to sign"
              />
              <button
                onClick={async () => await signMessage(message)}
                disabled={signMessageLoading}
                className="border border-1 rounded p-2 border-black mb-4 ml-2"
              >
                {signMessageLoading ? "Signing..." : "Sign Message"}
              </button>
            </>
          ) : (
            <div className="mb-12 flex flex-col space-y-2 mt-8">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-1 rounded p-2 border-black mb-4 ml-2 text-center"
                placeholder="Enter unique username"
              />
              <button
                className="border border-1 rounded p-2 border-black mb-4 ml-2"
                onClick={async () => {
                  if (authenticateSetup) {
                    await authenticate();
                  } else {
                    await register();
                  }
                }}
                disabled={registering || authenticating}
              >
                {authenticateSetup
                  ? authenticating
                    ? "Authenticating..."
                    : "Authenticate"
                  : registering
                  ? "Registering..."
                  : authenticating
                  ? "Authenticating..."
                  : "Register"}
              </button>

              <span
                onClick={() => setAuthenticateSetup(!authenticateSetup)}
                className="cursor-pointer"
              >
                {authenticateSetup
                  ? "Register a Passkey?"
                  : "Already have a passkey?"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
