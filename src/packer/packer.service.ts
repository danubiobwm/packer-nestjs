import { Injectable } from '@nestjs/common';


const BOXES = [
  { id: 'Caixa 1', dims: [30, 40, 80] }, // 30 x 40 x 80
  { id: 'Caixa 2', dims: [50, 50, 40] }, // 50 x 50 x 40
  { id: 'Caixa 3', dims: [50, 80, 60] }, // 50 x 80 x 60
];

// util permutations
function permute<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr.slice()];
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    const xs = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permute(xs)) res.push([x].concat(p));
  }
  return res;
}

function volume(d: number[]) {
  return d[0] * d[1] * d[2];
}

@Injectable()
export class PackerService {
  packOrders(body: any) {
    const pedidosOut = [];
    for (const pedido of body.pedidos) {
      const produtos = pedido.produtos.map((p) => ({
        produto_id: p.produto_id,
        dims: [p.dimensoes.altura, p.dimensoes.largura, p.dimensoes.comprimento],
      }));

      produtos.sort((a, b) => volume(b.dims) - volume(a.dims));

      const openBoxes: { boxType: any; items: any[] }[] = [];
      const caixasSaida: any[] = [];

      for (const produto of produtos) {
        let placed = false;
        for (const ob of openBoxes) {
          if (this.canFitIntoBoxWithItems(ob.boxType.dims, [...ob.items.map(i => i.dims), produto.dims])) {
            ob.items.push(produto);
            placed = true;
            break;
          }
        }

        if (!placed) {
          const candidateBoxes = BOXES
            .map(b => ({ ...b, vol: volume(b.dims) }))
            .filter(b => this.canFitSingleInBox(b.dims, produto.dims))
            .sort((a, b) => a.vol - b.vol);

          if (candidateBoxes.length === 0) {
            caixasSaida.push({
              caixa_id: null,
              produtos: [produto.produto_id],
              observacao: 'Produto não cabe em nenhuma caixa disponível.',
            });
            placed = true;
          } else {
            const chosen = candidateBoxes[0];
            openBoxes.push({ boxType: chosen, items: [produto] });
            placed = true;
          }
        }
      }

      for (const ob of openBoxes) {
        caixasSaida.push({
          caixa_id: ob.boxType.id,
          produtos: ob.items.map(i => i.produto_id),
        });
      }

      pedidosOut.push({
        pedido_id: pedido.pedido_id,
        caixas: caixasSaida,
      });
    }

    return { pedidos: pedidosOut };
  }

  canFitSingleInBox(boxDims: number[], prodDims: number[]): boolean {
    for (const p of permute(prodDims)) {

      if (p[0] <= boxDims[0] && p[1] <= boxDims[1] && p[2] <= boxDims[2]) return true;
    }
    return false;
  }

  canFitIntoBoxWithItems(boxDims: number[], itemsDims: number[][]): boolean {
    const boxPermutations = [
      { heightIndex: 0, baseIndices: [1, 2] },
      { heightIndex: 1, baseIndices: [0, 2] },
      { heightIndex: 2, baseIndices: [0, 1] },
    ];

    for (const choice of boxPermutations) {
      const boxH = boxDims[choice.heightIndex];
      const baseW = boxDims[choice.baseIndices[0]];
      const baseL = boxDims[choice.baseIndices[1]];

      const orientationsPerItem: number[][][] = [];
      let possible = true;
      for (const dims of itemsDims) {
        const orients = permute(dims).filter(o => o[choice.heightIndex] <= boxH);

        const validOrients: number[][] = [];
        for (const p of orients) {

          const mapped = [p[choice.heightIndex], p[choice.baseIndices[0]], p[choice.baseIndices[1]]];
          if (mapped[1] <= baseW && mapped[2] <= baseL) validOrients.push(mapped);

        }
        if (validOrients.length === 0) {
          possible = false;
          break;
        }
        orientationsPerItem.push(validOrients);
      }
      if (!possible) continue;


      const itemIndices = itemsDims.map((_, i) => i);
      const orders = permute(itemIndices);

      for (const order of orders) {
        const rows: { usedLength: number; thickness: number }[] = [];

        const tryPlace = (k: number): boolean => {
          if (k >= order.length) return true;
          const idx = order[k];
          for (const orient of orientationsPerItem[idx]) {
            const h = orient[0], w = orient[1], l = orient[2];
            for (let r = 0; r < rows.length; r++) {
              const row = rows[r];
              if (row.usedLength + l <= baseL) {
                const oldThickness = row.thickness;
                const newThickness = Math.max(row.thickness, w);
                const sumOtherRows = rows.reduce((s, rr, ii) => s + (ii === r ? 0 : rr.thickness), 0);
                if (sumOtherRows + newThickness <= baseW) {
                  // colocar
                  row.usedLength += l;
                  row.thickness = newThickness;
                  if (tryPlace(k + 1)) return true;
                  // backtrack
                  row.usedLength -= l;
                  row.thickness = oldThickness;
                }
              }
            }
            const sumRows = rows.reduce((s, rr) => s + rr.thickness, 0);
            if (sumRows + w <= baseW && l <= baseL) {
              rows.push({ usedLength: l, thickness: w });
              if (tryPlace(k + 1)) return true;
              rows.pop();
            }
          }
          return false;
        };

        if (tryPlace(0)) return true;
      }
    }

    return false;
  }
}
