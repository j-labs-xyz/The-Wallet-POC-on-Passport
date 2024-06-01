import { useRef } from "react";
import { WebauthnSigner } from "@0xpass/webauthn-signer";
import { Passport } from "@0xpass/passport";

export function usePassport({
  ENCLAVE_PUBLIC_KEY,
  scope_id,
  endpoint = "https://tiramisu.0xpass.io",
}) {
  const signerRef = {};
  const passportRef = {};

  if (!signerRef.current) {
    signerRef.current = new WebauthnSigner({
      rpId: process.env.NEXT_PUBLIC_RP_ID,
      rpName: "0xPass",
    });
  }

  if (!passportRef.current) {
    passportRef.current = new Passport({
      scope_id: scope_id,
      signer: signerRef.current,
      enclave_public_key: ENCLAVE_PUBLIC_KEY,
      endpoint: endpoint,
    });
  }

  return {
    passport: passportRef.current,
    signer: signerRef.current,
  };
}
