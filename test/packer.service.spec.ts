import { PackerService } from '../src/packer/packer.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PackerService', () => {
  let service: PackerService;
  beforeAll(() => {
    service = new PackerService();
  });

  it('empacota entrada.json como saida.json (fixture)', () => {
    const entrada = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'fixtures', 'entrada.json'), 'utf8'),
    );
    const expected = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'fixtures', 'saida.json'), 'utf8'),
    );

    const result = service.packOrders(entrada);
    expect(result).toEqual(expected);
  });
});
