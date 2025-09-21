import { Module } from '@nestjs/common';
import { PackerModule } from './packer/packer.module';

@Module({
  imports: [PackerModule],
})
export class AppModule {}
