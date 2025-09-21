import { Controller, Post, Body } from '@nestjs/common';
import { PackRequestDto } from './dto/pack-request.dto';
import { PackResponseDto } from './dto/pack-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PackerService } from './packer.service';

@ApiTags('packer')
@Controller()
export class PackerController {
  constructor(private readonly packerService: PackerService) {}

  @Post('pack')
  @ApiOperation({ summary: 'Empacota pedidos' })
  @ApiBody({ type: PackRequestDto })
  @ApiResponse({ status: 200, type: PackResponseDto })
  pack(@Body() body: PackRequestDto): PackResponseDto {
    return this.packerService.packOrders(body);
  }
}
