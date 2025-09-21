import { PackerService } from './packer.service';

describe('PackerService', () => {
  let service: PackerService;

  beforeEach(() => {
    service = new PackerService();
  });

  it('should pack a single product that fits in Caixa 1', () => {
    const body = {
      pedidos: [
        {
          pedido_id: 'pedido1',
          produtos: [
            {
              produto_id: 'prod1',
              dimensoes: { altura: 20, largura: 30, comprimento: 40 },
            },
          ],
        },
      ],
    };
    const result = service.packOrders(body);
    expect(result).toEqual({
      pedidos: [
        {
          pedido_id: 'pedido1',
          caixas: [
            {
              caixa_id: 'Caixa 1',
              produtos: ['prod1'],
            },
          ],
        },
      ],
    });
  });

  it('should pack two products in different boxes if they do not fit together', () => {
    const body = {
      pedidos: [
        {
          pedido_id: 'pedido2',
          produtos: [
            {
              produto_id: 'prod1',
              dimensoes: { altura: 30, largura: 40, comprimento: 80 },
            },
            {
              produto_id: 'prod2',
              dimensoes: { altura: 50, largura: 50, comprimento: 40 },
            },
          ],
        },
      ],
    };
    const result = service.packOrders(body);
    expect(result.pedidos[0].caixas.length).toBe(2);
    expect(result.pedidos[0].caixas.map(c => c.caixa_id)).toContain('Caixa 1');
    expect(result.pedidos[0].caixas.map(c => c.caixa_id)).toContain('Caixa 2');
  });

  it('should return observacao if product does not fit in any box', () => {
    const body = {
      pedidos: [
        {
          pedido_id: 'pedido3',
          produtos: [
            {
              produto_id: 'prod1',
              dimensoes: { altura: 100, largura: 100, comprimento: 100 },
            },
          ],
        },
      ],
    };
    const result = service.packOrders(body);
    expect(result.pedidos[0].caixas[0].caixa_id).toBeNull();
    expect(result.pedidos[0].caixas[0].observacao).toBe('Produto não cabe em nenhuma caixa disponível.');
  });

  it('should pack multiple products in the same box if possible', () => {
    const body = {
      pedidos: [
        {
          pedido_id: 'pedido4',
          produtos: [
            {
              produto_id: 'prod1',
              dimensoes: { altura: 10, largura: 10, comprimento: 10 },
            },
            {
              produto_id: 'prod2',
              dimensoes: { altura: 10, largura: 10, comprimento: 10 },
            },
            {
              produto_id: 'prod3',
              dimensoes: { altura: 10, largura: 10, comprimento: 10 },
            },
          ],
        },
      ],
    };
    const result = service.packOrders(body);
    expect(result.pedidos[0].caixas.length).toBe(1);
    expect(result.pedidos[0].caixas[0].produtos).toEqual(['prod1', 'prod2', 'prod3']);
  });

  it('canFitSingleInBox should return true for fitting product', () => {
    expect(service.canFitSingleInBox([30, 40, 80], [20, 30, 40])).toBe(true);
  });

  it('canFitSingleInBox should return false for non-fitting product', () => {
    expect(service.canFitSingleInBox([30, 40, 80], [100, 100, 100])).toBe(false);
  });

  it('canFitIntoBoxWithItems should return true for fitting items', () => {
    expect(service.canFitIntoBoxWithItems([50, 50, 40], [
      [20, 20, 20],
      [20, 20, 20],
    ])).toBe(true);
  });

  it('canFitIntoBoxWithItems should return false for non-fitting items', () => {
    expect(service.canFitIntoBoxWithItems([30, 40, 80], [
      [30, 40, 80],
      [30, 40, 80],
    ])).toBe(false);
  });
});