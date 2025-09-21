## Packer API – NestJS

API para auxiliar Seu Manoel a embalar pedidos de produtos em caixas de papelão.
Dado um conjunto de pedidos com produtos e dimensões, a API retorna quais caixas devem ser usadas e quais produtos vão em cada caixa.

## Tecnologias

NestJS

Swagger
 (documentação da API)

Jest
 (testes unitários)

Docker & Docker Compose

## Estrutura de pastas
```
packer-nestjs/
├─ src/
│  ├─ main.ts
│  ├─ app.module.ts
│  └─ packer/
│     ├─ packer.module.ts
│     ├─ packer.controller.ts
│     ├─ packer.service.ts
│     └─ dto/
│        ├─ pack-request.dto.ts
│        └─ pack-response.dto.ts
├─ test/fixtures/entrada.json
├─ test/fixtures/saida.json
├─ test/packer.service.spec.ts
├─ package.json
├─ Dockerfile
├─ docker-compose.yml
└─ README.md

```

## Instalação e execução
Rodar localmente

Clone o repositório

```
git clone https://github.com/danubiobwm/packer-nestjs.git
cd packer-nestjs

```
## Instale as dependências

```
yarn install

```
## Rode em modo desenvolvimento
```
yarn start:dev

```

## Acesse no navegador:
```
API: http://localhost:3000

Swagger Docs: http://localhost:3000/docs

```

## Rodar com Docker

```
docker compose up --build

```
API sobe em: http://localhost:3000

## Autenticação (opcional)
Se quiser proteger os endpoints, defina uma API key no ambiente:
```
export API_KEY=meu_token_secreto
```

E envie nos requests o header:
```
x-api-key: meu_token_secreto
```

## Endpoint

POST /pack

Recebe pedidos e retorna a forma de embalar.

Entrada (JSON)

```
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": { "altura": 40, "largura": 10, "comprimento": 25 }
        },
        {
          "produto_id": "Volante",
          "dimensoes": { "altura": 40, "largura": 30, "comprimento": 30 }
        }
      ]
    }
  ]
}
```

Saída (JSON)

```
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        {
          "caixa_id": "Caixa 2",
          "produtos": ["PS5", "Volante"]
        }
      ]
    }
  ]
}
```

## Caixas disponíveis

Caixa 1: 30 × 40 × 80 cm

Caixa 2: 50 × 50 × 40 cm

Caixa 3: 50 × 80 × 60 cm

## Testes

Rodar testes unitários:

```
yarn test

```

## Teste principal:

Usa test/fixtures/entrada.json como entrada

Compara o resultado com test/fixtures/saida.json


## Exemplos de requests
Pedido com múltiplos produtos pequenos
```
{
  "pedidos": [
    {
      "pedido_id": 8,
      "produtos": [
        {
          "produto_id": "Controle Xbox",
          "dimensoes": { "altura": 10, "largura": 15, "comprimento": 10 }
        },
        {
          "produto_id": "Carregador",
          "dimensoes": { "altura": 3, "largura": 8, "comprimento": 8 }
        }
      ]
    }
  ]
}

```

## Resposta esperada

```
{
  "pedidos": [
    {
      "pedido_id": 8,
      "caixas": [
        {
          "caixa_id": "Caixa 1",
          "produtos": ["Controle Xbox", "Carregador"]
        }
      ]
    }
  ]
}
```

## Documentação Swagger

Disponível em:

 http://localhost:3000/docs


