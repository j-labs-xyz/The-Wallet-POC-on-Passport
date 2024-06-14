import { usePassport } from "./hooks/usePassport";
import { createPassportClient } from "@0xpass/passport-viem";

import { http } from "viem";
import { mainnet } from "viem/chains";

import { TESTNET_RSA_PUBLIC_KEY } from "@0xpass/passport";

class AuthenticaionService {
    constructor() {
        const res = usePassport({
            ENCLAVE_PUBLIC_KEY: TESTNET_RSA_PUBLIC_KEY,
            // scope_id: "07907e39-63c6-4b0b-bca8-377d26445172", // original
            // scope_id: "43ca2cb8-886e-417f-9e31-0c0c5b3acd1e", // localhost:4943
            scope_id: "4b8e66a2-bf1f-4d9d-8df8-7f7aa7502370", // localhost:3000
        });
        this.passport = res.passport;
    }

    async register(username) {
      try {
        await this.passport.setupEncryption();
        const res = await this.passport.register(username);
        console.log(res);
        return res;
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      }
    };

    async authenticate(username) {
      try {
        await this.passport.setupEncryption();
        const response = await this.passport.authenticate(
          username
        );
        console.log(response);
        return response;
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      }
    };

    async sign(authenticatedHeader, message) {
      const client = this.createWalletClient(authenticatedHeader);
      const [address] = await client.getAddresses();
      const response = await client.signMessage({
        account: address,
        message,
      });
      return response;
    }

    createWalletClient(authenticatedHeader) {
      const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL;
      const fallbackProvider = http(alchemyUrl);
      return createPassportClient(authenticatedHeader, fallbackProvider, mainnet);
    }
  }
  
  const theWalletAuthenticaionService = new AuthenticaionService();
  Object.freeze(theWalletAuthenticaionService);
  
  export default theWalletAuthenticaionService;
