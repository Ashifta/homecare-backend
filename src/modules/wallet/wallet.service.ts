import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet, WalletOwnerType } from './entities/wallet.entity';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: WalletRepository,
  ) {}

  /**
   * Get existing wallet or create one if not present.
   * SAFE, IDEMPOTENT, TENANT-AWARE
   */
  async getOrCreateWallet(
    ownerType: WalletOwnerType,
    ownerId: string,
    currency = 'INR',
  ): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({
      where: { ownerType, ownerId },
    });

    if (!wallet) {
      wallet = this.walletRepo.createForTenant({
        ownerType,
        ownerId,
        currency,
      });

      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  /**
   * Read-only access (tenant enforced automatically)
   */
  async findById(walletId: string): Promise<Wallet | null> {
    return this.walletRepo.findOne({
      where: { id: walletId },
    });
  }
}
