import { HallarApiConfig } from '../../typings';
import { codec, cryptography, transactions } from '@liskhq/lisk-client';
import { addGithubProjectSchema } from './schemas';
import { networkIdentifier } from './utils/network';
import { getFullAssetSchema } from './utils/common';


export class Projects {

  private config: HallarApiConfig;

  constructor(config: HallarApiConfig) {
    this.config = config;
  }

  async get (params: { address: string }): Promise<any> {
    try {
      const response = await fetch(`${this.config.url}/api/projects?address=${params.address}`)
      if (response.ok) {
        return response.json();
      } else {
        const error = await response.json();
        throw Object.assign(error);
      }
    } catch (e) {
      return []
    }
  }

  async getByAddress (params: { address: string }): Promise<any> {
    try {
      const response = await fetch(`${this.config.url}/api/accounts/${params.address}/projects`)
      if (response.ok) {
        return response.json();
      } else {
        const error = await response.json();
        throw Object.assign(error);
      }
    } catch (e) {
      return []
    }
  }

  async create (project: any, nonce: string, passphrase: string): Promise<any> {
    // @ts-ignore
    const { publicKey } = cryptography.getAddressAndPublicKeyFromPassphrase(passphrase);

    const { id, ...rest } = transactions.signTransaction(
      addGithubProjectSchema,
      {
        moduleID: 18999,
        assetID: 2,
        nonce: BigInt(nonce),
        fee: BigInt(transactions.convertLSKToBeddows("25")),
        senderPublicKey:  publicKey,
        asset: {
          id: project.id,
          fullName: project.fullName
        },
      },
      networkIdentifier,
      passphrase
    );
    // @ts-ignore
    const tx = codec.codec.toJSON(getFullAssetSchema(addGithubProjectSchema), rest);
    return fetch("http://localhost:4000/api/transactions", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(tx)
    });
  }

}
