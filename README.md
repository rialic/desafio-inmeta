# Teste Técnico InMeta

## Descrição do Projeto

O desafio foi realizado utilizando Vuejs3, Vue Quasar, Pinia e Typescript com um estilo minimalista semelhante ao shadcn ui, todas as especficiações do desafio foram realizadas e implementadas conforme solicitado.
### Candidato
###### Rhiali Cândido
* Linkedin: www.linkedin.com/in/rhiali-cândido-8a9408217
* Contato: (67) 99839-0452

### Execução do projeto

1. **Na raiz do projeto:**
    yarn
   ```bash
   yarn dev
   ```
    npm
   ```bash
   npm run dev
   ```
2. **Esse projeto também pode ser executado com Docker:**
    **Especificações:**
    * Docker >= 28.0.4
    * Docker Compose >= 1.29.2
    ```bash
    docker compose run --rm -p 9000:9000 node yarn dev
    ```
    *Ao executar o projeto com Docker o navegador não irá abrir automaticamente, você terá que digitar o endereço na url.

## Implementações realizadas

#### Página de Cadastro e Login
- [X] Página de Cadastro e Login funcionando corretamente
- [X] Implementado validação customizada utilizando "Rule" do Vue Quasar
- [X] Componentização implementada
- [X] SignIn.vue e SignUp.vue como arquivos principais dessa implementação

#### Página com Lista de Solicitações de Troca
- [X] Página com Lista de Solicitações de Troca funcionando corretamente
- [X] Destaque visual que mostra o OFFERING E RECEIVING para cada cartão
- [X] Possibilidade de visualizar os cartões em um Dialog com mais detalhe
- [X] Possibilidade de visualizar todos as solicitações de troca no sistema
- [X] Componentização implementada
- [X] TradeCardGalleryPage.vue como arquivo principal dessa implementação

#### Lista com meus Cartões e Todos Cartões (Página privada com autenticação)
- [X] Página com Lista dos Meus Cartões e Todos os Cartões funcionando corretamente
- [X] É possível adicionar 1 ou Vários cartões ao mesmo tempo em sua coleção
- [X] Tela intuitiva e compreensíve
- [X] Páginação implementada ao carregar a lista de todos os cartões
- [X] Não foi necessário validação de dados pela forma que foi construído o visual das páginas
- [X] Componentização implementada
- [X] CardListPage.vue como arquivo principal dessa implementação

#### Lista com Solicitação de Troca (Página privada com autenticação)
- [X] Página com Lista Solicitação de Troca funcionando corretamente
- [X] É possível visualizar e excluir APENAS as Solicitações de Troca realizadas pelo usuário logado no sistema
- [X] Todas as Solicitações de Troca só podem ser vistas na área pública
- [X] Componentização implementada
- [X] TradeCardListPage.vue como arquivo principal dessa implementação

#### Criar Solicitação de Troca (Página privada com autenticação)
- [X] Página para criar Solicitação de Troca funcionando corretamente
- [X] Destaque visual para criar Solicitação de Troca foi pensado para ser intuitivo e agradável
- [X] É possível adicionar/excluir 1 ou Vários cartões ao mesmo tempo para criar uma Solicitação de Troca
- [X] Componentização implementada, destaque para o componente ChoicerCard.vue que faz todo o trabalho
- [X] Não foi necessário validação de dados pela forma que foi construído o visual da página
- [X] TradeCardForm.vue como arquivo principal dessa implementação

#### Página de Perfil (Página privada com autenticação)
- [X] Página que apresenta o perfil funcionando corretamente
- [X] Visual criado para ser simples e mostrar apenas os dados do usuário
- [X] Componentização implementada
- [X] UserForm.vue como arquivo principal dessa implementação

### Detalhes e observações
- Criado middleware no vue-router para gerenciar páginas autenticadas e públicas
- O componente "<CardImage/>" é utilizado em todas as listas da aplicação aproveitando a reusabilidade
- Sistema tem feedback visual mostrando as mensagens de erro e de sucesso
- Sistema tem tratamento de erros
- Realizado separação de rotas públicas e privadas que precisam de autenticação
- Codificação toda realizada em inglês com nomes e parâmetros bem definidos

