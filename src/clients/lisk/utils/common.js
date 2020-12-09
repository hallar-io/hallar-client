/* global BigInt */

import { utils, codec } from '@liskhq/lisk-client';
const { objects } = utils;

const _codec = new codec.Codec();

export const baseAssetSchema = {
  $id: 'lisk/base-transaction',
  type: 'object',
  required: ['moduleID', 'assetID', 'nonce', 'fee', 'senderPublicKey', 'asset'],
  properties: {
    moduleID: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    assetID: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    asset: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

export const getFullAssetSchema = (assetSchema) => objects.mergeDeep({}, baseAssetSchema, { properties: { asset: assetSchema },});

export const calcMinTxFee = (assetSchema, minFeePerByte, tx) => {
  const assetBytes = _codec.encode(assetSchema, tx.asset);
  const bytes = _codec.encode(baseAssetSchema, { ...tx, asset: assetBytes });
  return BigInt(bytes.length * minFeePerByte);
};
