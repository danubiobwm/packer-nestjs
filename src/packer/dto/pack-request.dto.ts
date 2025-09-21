import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DimensoesDto {
  @ApiProperty()
  @IsNumber()
  altura: number;

  @ApiProperty()
  @IsNumber()
  largura: number;

  @ApiProperty()
  @IsNumber()
  comprimento: number;
}

export class ProdutoDto {
  @ApiProperty()
  @IsString()
  produto_id: string;

  @ApiProperty({ type: DimensoesDto })
  @ValidateNested()
  @Type(() => DimensoesDto)
  dimensoes: DimensoesDto;
}

export class PedidoDto {
  @ApiProperty()
  @IsNumber()
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
