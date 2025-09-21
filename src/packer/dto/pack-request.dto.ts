import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class DimensoesDto {
  @ApiProperty()
  altura: number;
  @ApiProperty()
  largura: number;
  @ApiProperty()
  comprimento: number;
}

class ProdutoDto {
  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes: DimensoesDto;
}

export class PedidoDto {
  @ApiProperty()
  pedido_id: number;

  @ApiProperty({ type: [ProdutoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoDto)
  produtos: ProdutoDto[];
}

export class PackRequestDto {
  @ApiProperty({ type: [PedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoDto)
  pedidos: PedidoDto[];
}
