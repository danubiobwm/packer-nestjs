import { ApiProperty } from '@nestjs/swagger';

export class CaixaSaida {
  @ApiProperty({ nullable: true })
  caixa_id: string | null;
  @ApiProperty({ type: [String] })
  produtos: string[];
  @ApiProperty({ required: false })
  observacao?: string;
}

export class PedidoSaida {
  @ApiProperty()
  pedido_id: number;
  @ApiProperty({ type: [CaixaSaida] })
  caixas: CaixaSaida[];
}

export class PackResponseDto {
  @ApiProperty({ type: [PedidoSaida] })
  pedidos: PedidoSaida[];
}
