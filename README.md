Aplicativo de Controle Financeiro (React Native + Expo)

É um aplicativo mobile desenvolvido com React Native e Expo, com o objetivo de auxiliar o usuário no controle de receitas, despesas, metas financeiras e acompanhamento mensal.  
O projeto utiliza componentização, armazenamento local com AsyncStorage e navegação por abas.

## Tecnologias Utilizadas

- React Native
- Expo
- React Navigation (Bottom Tabs)
- AsyncStorage
- DayJS
- React Native Picker
- JavaScript ES6

## Funcionalidades

### Tela Inicial (Home)
- Exibe o saldo atual.
- Atualiza automaticamente quando a tela volta para o foco.
- Acesso às telas de Transações, Metas e Resumo.

### Transações
- Cadastro de receitas e despesas.
- Edição de itens através de modal.
- Exclusão de transações.
- Filtragem por mês.
- Agrupamento automático por mês (ex.: "Maio 2024").
- Armazenamento persistente com AsyncStorage.

### Metas Financeiras
- Criação de metas com título e valor desejado.
- Adição de progresso manual.
- Barra de progresso proporcional ao valor guardado.
- Exclusão de metas.

### Resumo Financeiro
- Exibe total de receitas, despesas e saldo do mês selecionado.
- Atualização automática sempre que a tela é focada.
- Filtro mensal.
## Estrutura do Projeto

```
Appfinan/
│
├── App.js
└── src/
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── TransactionsScreen.js
    │   ├── GoalsScreen.js
    │   └── SummaryScreen.js
    │
    ├── components/
    │   └── CustomButton.js
    │
    ├── navigation/
    │   └── AppNavigator.js
    │
    └── storage/
        └── storageService.js
```

## Como Executar o Projeto

1. Instale o Expo CLI:
```
npm install -g expo-cli
```

2. Instale as dependências:
```
npm install
```

3. Execute o aplicativo:
```
npx expo start
```

4. Abra no dispositivo ou emulador:
- Aplicativo Expo Go  
- Emulador Android/iOS configurado

## Armazenamento Local

A lógica de persistência está centralizada em `storageService.js`, que abstrai o uso do AsyncStorage através de funções dedicadas:

- `saveData` / `loadData`  
- `clearKey` / `clearAll`  
- `getTransacoes` / `saveTransacoes`  
- `getMetas` / `saveMetas`

Essa abordagem mantém o código organizado e facilita manutenção futura.

## Objetivo Acadêmico

Projeto desenvolvido como atividade universitária, aplicando:

- Hooks (useState, useEffect)  
- Navegação com React Navigation  
- Armazenamento persistente  
- Estruturação de componentes  
- Manipulação de datas  
- CRUD completo  
- Filtragem e agrupamento de dados  .

