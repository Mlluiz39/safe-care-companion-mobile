# 🏥 Health Care Mobile

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.74.2-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~51.0.8-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6.svg)

Um aplicativo mobile moderno e elegante para gestão de cuidados de saúde, construído com React Native e Expo.

[Recursos](#-recursos) • [Instalação](#-instalação) • [Uso](#-uso) • [Tecnologias](#-tecnologias) • [Estrutura](#-estrutura-do-projeto)

</div>

---

## ✨ Recursos

- 📱 **Interface Moderna**: Design elegante com NativeWind (Tailwind CSS)
- 🎨 **Tema Personalizado**: Sistema de cores HSL customizável
- 🔐 **Autenticação**: Integração com Supabase
- 📊 **Gestão de Dados**: Armazenamento local e na nuvem
- 🎭 **Dados de Teste**: Geração de dados faker para desenvolvimento
- 🧭 **Navegação Fluida**: Expo Router para navegação type-safe
- 📅 **Manipulação de Datas**: date-fns para formatação de datas
- 🎯 **Ícones**: Lucide React Native para ícones elegantes

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (para testar no dispositivo físico)

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/health-care-mobile.git

# Entre no diretório
cd health-care-mobile

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

### Configuração do Supabase

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 💻 Uso

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios

# Executar no Web
npm run web
```

## 🛠 Tecnologias

### Core

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Expo Router** - Roteamento baseado em arquivos

### UI/UX

- **NativeWind** - Tailwind CSS para React Native
- **Lucide React Native** - Biblioteca de ícones
- **React Native Reanimated** - Animações fluidas
- **React Native Gesture Handler** - Gestos nativos

### Backend & Data

- **Supabase** - Backend as a Service
- **AsyncStorage** - Armazenamento local
- **date-fns** - Manipulação de datas

### Desenvolvimento

- **Faker.js** - Geração de dados de teste
- **TypeScript** - Type safety

## 📁 Estrutura do Projeto

```
health-care-mobile/
├── app/                    # Rotas da aplicação (Expo Router)
│   ├── (tabs)/            # Rotas com tabs
│   ├── _layout.tsx        # Layout principal
│   └── index.tsx          # Tela inicial
├── components/            # Componentes reutilizáveis
├── constants/             # Constantes e configurações
├── hooks/                 # Custom hooks
├── services/              # Serviços (API, Supabase)
├── types/                 # Definições TypeScript
├── utils/                 # Funções utilitárias
├── assets/                # Imagens e recursos
├── .env                   # Variáveis de ambiente (não versionado)
├── .env.example           # Exemplo de variáveis
├── tailwind.config.js     # Configuração do Tailwind
├── babel.config.js        # Configuração do Babel
└── package.json           # Dependências do projeto
```

## 🎨 Tema de Cores

O aplicativo utiliza um sistema de cores HSL personalizado:

```javascript
primary: 'hsl(185 70% 45%)' // Azul turquesa
secondary: 'hsl(142 60% 50%)' // Verde
accent: 'hsl(25 95% 53%)' // Laranja
destructive: 'hsl(0 84.2% 60.2%)' // Vermelho
```

## 📝 Scripts Disponíveis

| Script            | Descrição                               |
| ----------------- | --------------------------------------- |
| `npm start`       | Inicia o servidor de desenvolvimento    |
| `npm run android` | Executa no emulador/dispositivo Android |
| `npm run ios`     | Executa no simulador/dispositivo iOS    |
| `npm run web`     | Executa no navegador web                |
| `npm run dev`     | Alias para `npm start`                  |

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

Marcelo Luiz

- GitHub: [@mlluiz39](https://github.com/mlluiz39)
- LinkedIn: [Seu Nome](https://linkedin.com/in/marcelo-luiz-pereira-souza)

---

<div align="center">

Feito com ❤️ e ☕

</div>
