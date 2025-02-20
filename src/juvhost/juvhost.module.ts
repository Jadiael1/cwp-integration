import { Module } from '@nestjs/common';
import { JuvHostHttpService } from '@services/juvhost-http.service';
import { HttpModule } from '@modules/http.module';
import { JuvHostService } from '@services/juvhost.service';
import { ResponseManagerService } from '@services/response-manager.service';

@Module({
  providers: [JuvHostService, JuvHostHttpService, ResponseManagerService],
  imports: [HttpModule],
  exports: [JuvHostService],
})
export class JuvHostModule {}
