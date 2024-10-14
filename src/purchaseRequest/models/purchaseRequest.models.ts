import { PurchaseRequestStatus } from '@prisma/client';

export interface PurchaseRequestUpdateInput {
    purchaseRequestStatus: PurchaseRequestStatus;
}
