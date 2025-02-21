# CWP Integration API

**Sistema em Produção**: https://cwp-integration.juvhost.com/

**CWP Integration API** é um projeto NestJS desenvolvido para atuar como API intermediária entre o plugin WordPress **cwp_woo** e o painel CWP. Através deste serviço, quando uma compra é finalizada ou concluida no WooCommerce, o plugin cwp_woo aciona essa API para criar uma conta no CWP de forma assíncrona e segura.

## Visão Geral

Este projeto utiliza tecnologias modernas e práticas recomendadas para garantir escalabilidade, manutenibilidade e segurança:

- **NestJS**: Framework progressivo para a construção de aplicações Node.js robustas.
- **BullMQ e BullBoard**: Gerenciam filas de jobs e fornecem uma interface de monitoramento para processos em background.
- **@nestjs/config com Joi**: Gerencia e valida as variáveis de ambiente, garantindo que todas as configurações essenciais estejam definidas antes do início da aplicação.
- **GitHub Actions**: Automatiza o processo de build e deploy, transferindo apenas a pasta `dist` para o servidor via SSH.
- **Guards**: Utilizados para proteger endpoints, verificando que as requisições contenham uma chave (`key`) no corpo que corresponda ao token configurado nas variaveis de ambiente da aplicação.

## Funcionalidades Principais

- **Configuração de Ambiente**:  
  Os usuários devem criar os arquivos `.env.dev` e `.env.prod` com base nos arquivos `.env.dev.example` e `.env.prod.example`. Embora seja necessário criar esses arquivos, as informações podem ser fornecidas diretamente pelo sistema de variáveis de ambiente, sem a necessidade de preenchê-los manualmente.

- **Gerenciamento de Filas**:  
  A API utiliza **BullMQ** para processar jobs em background e **BullBoard** para monitoramento dessas filas, permitindo uma visão clara e controle dos processos assíncronos.

- **Proteção de Endpoints com Guard**:  
  Um **TokenGuard** foi implementado para proteger os endpoints críticos. Esse guard verifica se o corpo da requisição contém uma chave chamada `key` e se o valor dela é igual ao token definido na variável de ambiente `API_TOKEN` (que representa a chave do painel CWP). Caso a verificação falhe, a API retorna uma resposta `401 Unauthorized`.

- **Processamento Assíncrono**:  
  Ao receber a requisição do plugin cwp_woo, a API não executa imediatamente a sincronização. Em vez disso, cria um job na fila (usando BullMQ) e retorna uma mensagem informando que o job foi criado. Esse job é então processado em background.

- **Deploy Automatizado**:  
  O repositório possui um workflow do GitHub Actions que, ao realizar push na branch `main`, compila o projeto e envia a pasta `dist` para um servidor via SSH, facilitando o deploy contínuo.

- **Integração com cwp_woo**:  
  Este projeto foi desenvolvido para quem optar por usar a API intermediária junto com o plugin **cwp_woo**. O repositório do plugin está disponível em: [https://github.com/Jadiael1/cwp-woo](https://github.com/Jadiael1/cwp-woo)

## Estrutura do Projeto

- **src/app.module.ts**: Módulo raiz que importa a configuração de ambiente, módulos de filas, utilitários e outros módulos da aplicação.
- **src/config.service.ts**: Configurações para TypeORM, BullMQ, BullBoard e autenticação.
- **src/common/guards/token.guard.ts**: Implementa o guard que protege os endpoints verificando o token no corpo da requisição.
- **src/account/**: Contém controllers, services e DTOs relacionados à criação e gerenciamento de contas.
- **src/juvhost/**: Contém serviços para processamento dos jobs e integração com o painel CWP.
- **src/util/**: Contém utilitários e controllers para verificação de saúde, configuração de ambiente e interação com o Redis.
- **GitHub Actions Workflow**: Definido em `.github/workflows/deploy.yml`, automatiza o build e o deploy da aplicação.

## Como Começar

1. **Clone o Repositório**:  
   `git clone https://github.com/Jadiael1/cwp-integration.git`

2. **Crie os Arquivos de Ambiente**:  
   - Renomeie ou copie `.env.dev.example` para `.env.dev`
   - Renomeie ou copie `.env.prod.example` para `.env.prod`
   
   Você pode deixar os arquivos vazios, caso prefira configurar as variáveis no sistema, mas recomenda-se fornecer as informações necessárias para o funcionamento adequado da aplicação.

3. **Instale as Dependências e Compile o Projeto**:  
   `npm install`  
   `npm run build`

4. **Inicie a Aplicação**:  
   `npm start`

5. **Deploy Automatizado**:  
   O workflow do GitHub Actions está configurado para compilar o projeto e enviar a pasta `dist` para o servidor via SSH em cada push na branch `main`.

## Conceitos e Tecnologias

- **NestJS**: Facilita a criação de aplicações modulares e escaláveis com uma arquitetura inspirada em Angular.
- **BullMQ & BullBoard**: Permitem o gerenciamento e monitoramento de filas, possibilitando o processamento de jobs em background de forma eficiente.
- **Guards**: Um recurso do NestJS que intercepta requisições e implementa lógica de autorização. Aqui, o `TokenGuard` assegura que apenas requisições com o token correto possam acessar os endpoints protegidos.
- **@nestjs/config + Joi**: Garante que todas as variáveis de ambiente necessárias estejam presentes e válidas, evitando falhas na inicialização.
- **GitHub Actions**: Automatiza o pipeline de CI/CD, garantindo deploy contínuo e facilitando a integração com servidores via SSH.
- **Integração com cwp_woo**: Este projeto foi criado para servir como API intermediária para o plugin cwp_woo, proporcionando uma forma desacoplada de integrar o WooCommerce com o painel CWP.

## Caso de Uso

Ao finalizar uma compra no WooCommerce, o plugin **cwp_woo** se estiver configurado para usar API Intermediaria, envia uma requisição para a API. O fluxo de execução é o seguinte:

1. A requisição chega à API e o `TokenGuard` verifica se o corpo contém a chave `key` com o valor correto (conforme definido na variável de ambiente `API_TOKEN`).
2. Se a verificação for bem-sucedida, a API cria um job na fila (usando BullMQ) e retorna uma resposta indicando que o job foi criado.
3. O job é processado em background, realizando a sincronização e criação de conta no painel CWP.
4. O BullBoard integrado permite monitorar o status dos jobs e diagnosticar eventuais problemas.

Este fluxo garante que a operação seja realizada de forma assíncrona, mantendo a API responsiva e possibilitando uma escalabilidade maior.

## Repositórios Relacionados

- **cwp_woo**: [https://github.com/Jadiael1/cwp-woo](https://github.com/Jadiael1/cwp-woo)  
  Este é o plugin WordPress que se integra à nossa API intermediária para criação de contas no CWP.

## Contribuição

Contribuições são bem-vindas! Se você deseja melhorar este projeto, sinta-se à vontade para abrir um _pull request_ ou uma _issue_.

## Licença

Este projeto é _unlicensed_.

---

Happy Coding!
