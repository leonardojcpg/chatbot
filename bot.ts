import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import * as dotenv from "dotenv";

// Carregar as variáveis de ambiente a partir do arquivo .env
dotenv.config();

// Criar o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Exibe o QR Code para login
client.on("qr", (qr) => {
  console.log("Escaneie este QR Code para conectar:");
  qrcode.generate(qr, { small: true });
});

// Confirma que o bot está pronto e online
client.on("ready", () => {
  console.log("✅ Bot do WhatsApp está online!");
});

// Cada usuário será identificado por seu número e o estado do fluxo será salvo
const userState: { [key: string]: string } = {};

// Detalhes dos cursos oferecidos
const cursos = {
  desenvolvimentoFullStack: {
    nome: "Desenvolvimento Full Stack",
    descricao: `O Curso Completo de Desenvolvimento Full Stack é a escolha perfeita para quem deseja se tornar um profissional completo, capaz de desenvolver tanto o front-end quanto o back-end de aplicações web e móveis. Neste curso, você aprenderá desde as bases do desenvolvimento até as tecnologias mais avançadas, adquirindo habilidades para construir sistemas robustos, escaláveis e com excelente experiência de usuário.`,
    duracao: "6 meses",
    preco: "R$ 3000",
  },
  qa: {
    nome: "QA (Analista de Qualidade)",
    descricao: `O Curso Completo de Quality Assurance (QA) é ideal para quem deseja iniciar ou aprimorar sua carreira na área de testes de software. Neste curso, você aprenderá desde os conceitos fundamentais até as técnicas mais avançadas de testes, incluindo automação, testes de performance e segurança. Desenvolva habilidades práticas e teóricas para garantir a qualidade de aplicativos, sistemas e websites.`,
    duracao: "6 meses",
    preco: "R$ 2500",
  },
  analiseDados: {
    nome: "Análise de Dados",
    descricao: `O Curso Completo de Análise de Dados é ideal para quem deseja aprender a coletar, processar, analisar e interpretar dados para gerar insights valiosos e tomar decisões baseadas em dados. Ao longo deste curso, você aprenderá a trabalhar com ferramentas como Excel, SQL, Python, e Power BI, além de explorar técnicas de visualização de dados, estatísticas e modelagem preditiva.`,
    duracao: "10 meses",
    preco: "R$ 3500",
  },
};

// Escuta as mensagens recebidas no WhatsApp
client.on("message", async (message) => {

    // Identifica o usuário pela sua identificação
  const userId = message.from; 

  // Pega a mensagem e converte para minúsculas para evitar erros de digitação
  const text = message.body.trim().toLowerCase(); 

  // Fluxo inicial, quando o bot ainda não sabe o que o usuário quer
  if (!userState[userId]) {
    userState[userId] = "inicio"; 
    message.reply(
      "Olá! 👋 Bem-vindo à *OREGON CURSOS*.\n\nEu sou o assistente virtual e posso te ajudar a escolher um curso.\n\nVocê já é nosso aluno ou é novo por aqui?\n\nDigite:\n1️⃣ Sou ex-aluno\n2️⃣ Sou novo"
    );
    return;
  }

  // Processa a mensagem de acordo com o estado atual do usuário
  switch (userState[userId]) {
    case "inicio":
      // Se o usuário escolher 1, está dizendo que é ex-aluno
      if (text === "1") {
        // Atualiza o estado do usuário
        userState[userId] = "ex-aluno"; 
        message.reply(
          "Que bom ter você de volta! 🎉\nEstá interessado em fazer um novo curso?\n\n1️⃣ Sim, quero conhecer os cursos\n2️⃣ Não, quero falar com um atendente"
        );
      }
      // Se o usuário escolher 2, ele é novo e quer ver cursos
      else if (text === "2") {
        // Atualiza o estado para novo
        userState[userId] = "novo"; 
        message.reply(
          "Ótimo! Temos cursos incríveis. Qual área te interessa?\n\n1️⃣ Desenvolvimento\n2️⃣ Gestão de Produto\n3️⃣ Gestão de Projeto"
        );
      }
      break;

    case "ex-aluno":
      // Se for ex-aluno, ele pode querer ver os cursos ou falar com um atendente
      if (text === "1") {
        // Estado para mostrar os cursos de desenvolvimento
        userState[userId] = "dev"; 
        message.reply(
          "Escolha um dos cursos abaixo:\n\n1️⃣ Desenvolvimento FullStack\n2️⃣ QA (Analista de Qualidade)\n3️⃣ Análise de Dados"
        );
      } else if (text === "2") {
        message.reply(
          "Perfeito! Você será encaminhado para um atendente."
        );
        // Atualiza o estado para atendente
        userState[userId] = "atendente"; 
      }
      break;

    case "novo":
      // Se o usuário for novo, ele escolhe a área de interesse
      if (text === "1") {
         // Estado de cursos de desenvolvimento
        userState[userId] = "dev";
        message.reply(
          "Escolha um dos cursos abaixo:\n\n1️⃣ Desenvolvimento FullStack\n2️⃣ QA (Analista de Qualidade)\n3️⃣ Análise de Dados"
        );
      } else if (text === "2") {
        // Cursos de gestão de produto
        userState[userId] = "gestao-produto"; 
        message.reply(
          "Temos os seguintes cursos:\n\n1️⃣ Gestão Ágil de Produtos\n2️⃣ Product Discovery\n3️⃣ Métricas para PM"
        );
      } else if (text === "3") {
        // Cursos de gestão de projetos
        userState[userId] = "gestao-projeto"; 
        message.reply(
          "Temos os seguintes cursos:\n\n1️⃣ Gestão de Projetos Tradicionais\n2️⃣ Scrum e Metodologias Ágeis\n3️⃣ Certificação PMP"
        );
      }
      break;

    case "dev":
      // Quando o usuário escolhe um curso da área de desenvolvimento
      if (text === "1") {
        // Mostrar os detalhes do curso de Desenvolvimento FullStack
        userState[userId] = "detalhes-curso"; 
        message.reply(
          `Aqui estão mais informações sobre o curso ${cursos.desenvolvimentoFullStack.nome}:\n\n` +
          `📜 *Descrição:* ${cursos.desenvolvimentoFullStack.descricao}\n` +
          `⏳ *Duração:* ${cursos.desenvolvimentoFullStack.duracao}\n` +
          `💲 *Preço:* ${cursos.desenvolvimentoFullStack.preco}\n\n` +
          "Gostou do curso? Digite *1* para se inscrever ou *2* para ver outros cursos."
        );
      } else if (text === "2") {
        // Retorna para a escolha de cursos para ex-alunos
        userState[userId] = "ex-aluno"; 
        message.reply(
          "Escolha um dos cursos abaixo:\n\n1️⃣ Desenvolvimento FullStack\n2️⃣ QA (Analista de Qualidade)\n3️⃣ Análise de Dados"
        );
      } else if (text === "3") {
        // Vai para o curso QA
        userState[userId] = "qa"; 
        message.reply(
          `Aqui estão mais informações sobre o curso ${cursos.qa.nome}:\n\n` +
          `📜 *Descrição:* ${cursos.qa.descricao}\n` +
          `⏳ *Duração:* ${cursos.qa.duracao}\n` +
          `💲 *Preço:* ${cursos.qa.preco}\n\n` +
          "Gostou do curso? Digite *1* para se inscrever ou *2* para ver outros cursos."
        );
      }
      break;

    case "qa":
      // Quando o usuário escolhe o curso de QA
      if (text === "1") {
        // Detalhes do curso de QA
        userState[userId] = "detalhes-curso"; 
        message.reply(
          `Aqui estão mais informações sobre o curso ${cursos.qa.nome}:\n\n` +
          `📜 *Descrição:* ${cursos.qa.descricao}\n` +
          `⏳ *Duração:* ${cursos.qa.duracao}\n` +
          `💲 *Preço:* ${cursos.qa.preco}\n\n` +
          "Gostou do curso? Digite *1* para se inscrever ou *2* para ver outros cursos."
        );
      } else if (text === "2") {
        // Retorna para a seleção de cursos
        userState[userId] = "dev"; 
        message.reply(
          "Escolha um dos cursos abaixo:\n\n1️⃣ Desenvolvimento FullStack\n2️⃣ QA (Analista de Qualidade)\n3️⃣ Análise de Dados"
        );
      }
      break;

    case "detalhes-curso":
      // Se o usuário quiser ver mais cursos, ele pode retornar à lista de cursos
      if (text === "2") {
        // Redefine o estado para mostrar novamente os cursos
        userState[userId] = "dev"; 
        message.reply(
          "Escolha um dos cursos abaixo:\n\n1️⃣ Desenvolvimento FullStack\n2️⃣ QA (Analista de Qualidade)\n3️⃣ Análise de Dados"
        );
      }
      // Quando o usuário digitar "1" para se inscrever no curso
      else if (text === "1") {
        // Atualiza o estado para matrícula
        userState[userId] = "matricula"; 

        // Envia uma mensagem confirmando a matrícula
        message.reply(
          "Parabéns! 🎉 Você foi inscrito no curso.\n\n" +
          "A matrícula será processada em breve. Acompanhe seu e-mail para mais informações. 😊"
        );
      }
      break;

    case "matricula":
      // Resposta para quando o usuário estiver no estado de matrícula
      message.reply(
        "Sua matrícula foi confirmada. Se precisar de mais ajuda, estou à disposição!"
      );
      break;
  }
});

// Inicia o cliente do WhatsApp
client.initialize();
