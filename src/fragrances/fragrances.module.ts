import { Module } from '@nestjs/common';
import { FragrancesService } from './fragrances.service';
import { FragrancesController } from './fragrances.controller';
import { AdminFragrancesController } from './admin-fragrances.controller';

@Module({
  providers: [FragrancesService],
  controllers: [FragrancesController, AdminFragrancesController],
})
export class FragrancesModule {}
