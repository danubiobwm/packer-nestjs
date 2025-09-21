import { Module } from '@nestjs/common';
import { PackerController } from './packer.controller';
import { PackerService } from './packer.service';

@Module({
  controllers: [PackerController],
  providers: [PackerService],
})
export class PackerModule {}
