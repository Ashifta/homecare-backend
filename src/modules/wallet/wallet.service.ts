import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet, WalletOwnerType } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  /**
   * Get existing wallet or create one if not present.
   * This method is SAFE and IDEMPOTENT.
   */
  async getOrCreateWallet(
    tenantId: string,
    ownerType: WalletOwnerType,
    ownerId: string,
    currency = 'INR',
  ): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({
      where: { tenantId, ownerType, ownerId },
    });

    if (!wallet) {
      wallet = this.walletRepo.create({
        tenantId,
        ownerType,
        ownerId,
        currency,
      });
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  /**
   * Read-only access
   */
  async findById(walletId: string): Promise<Wallet | null> {
    return this.walletRepo.findOne({
      where: { id: walletId },
    });
  }
}
