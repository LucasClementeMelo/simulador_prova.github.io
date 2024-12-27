const cargos = {
    "Assistente Administrativo": [
        {
            pergunta: "Qual a principal função de um assistente administrativo?",
            alternativas: [
                "a) Elaborar campanhas publicitárias",
                "b) Controlar o fluxo de caixa",
                "c) Gerir a logística da empresa",
                "d) Planejar ações de marketing",
                "e) Realizar auditoria interna"
            ],
            resposta: "b) Controlar o fluxo de caixa",
            explicacao: "Assistentes administrativos são responsáveis por funções de apoio administrativo, como o controle financeiro."
        },
        {
            pergunta: "No Excel, qual fórmula calcula a soma das células A1 até A10?",
            alternativas: [
                "a) =ADD(A1:A10)",
                "b) =SUM(A1:A10)",
                "c) =SOMA(A1:A10)",
                "d) =TOTAL(A1:A10)",
                "e) =ALL(A1:A10)"
            ],
            resposta: "b) =SUM(A1:A10)",
            explicacao: "A função =SUM(A1:A10) soma os valores do intervalo A1 até A10 no Excel."
        }
    ],
    "Técnico em Logística": [
        {
            pergunta: "O que significa a sigla 'FIFO' no controle de estoques?",
            alternativas: [
                "a) First In, First Out – primeiro a entrar, primeiro a sair",
                "b) First In, Final Out – primeiro a entrar, final a sair",
                "c) Fast Inventory For Organization – inventário rápido para a organização",
                "d) Free Inventory For Order – inventário livre para pedido",
                "e) First In, First On – primeiro a entrar, primeiro a armazenar"
            ],
            resposta: "a) First In, First Out – primeiro a entrar, primeiro a sair",
            explicacao: "FIFO significa que os primeiros produtos a entrarem no estoque são os primeiros a serem vendidos ou usados."
        },
        {
            pergunta: "O que é 'Just in Time' na logística?",
            alternativas: [
                "a) Um modelo de controle de qualidade",
                "b) A entrega de produtos antes do prazo",
                "c) A entrega de produtos no momento exato em que são necessários",
                "d) Aumento da quantidade de produtos estocados",
                "e) Aumento do custo do transporte para reduzir o tempo de entrega"
            ],
            resposta: "c) A entrega de produtos no momento exato em que são necessários",
            explicacao: "'Just in Time' é uma estratégia que visa reduzir o tempo de armazenamento e melhorar a eficiência no transporte."
        }
    ]
};

let cargoAtual = "Assistente Administrativo";
let questoes = [];
let questaoAtual = 0;
let respostasCorretas = 0;
let respostasErradas = 0;
let respostas = [];
let perguntasErradas = [];

// Função para alternar o Cargo
function toggleTheme() {
    cargoAtual = cargoAtual === "Assistente Administrativo" ? "Técnico em Logística" : "Assistente Administrativo";
    document.getElementById("cargo-atual").innerText = `Cargo atual: ${cargoAtual}`;
    carregarProximaQuestao();
    tocarSom("assets/audio/pageturn.mp3");
}

// Função para carregar perguntas
function carregarProximaQuestao() {
    if (perguntasErradas.length === 0) {
        questoes = [...cargos[cargoAtual]];
        questaoAtual = 0;
        respostasCorretas = 0;
        respostasErradas = 0;
        respostas = [];
    } else {
        questoes = [...perguntasErradas]; // Carregar apenas as perguntas erradas!
        questaoAtual = 0;
    }
    mostrarQuestao();
}

// Função para exibir a questão atual
function mostrarQuestao() {
    if (questaoAtual >= questoes.length) {
        exibirFeedback();
        return;
    }

    const questao = questoes[questaoAtual];
    const container = document.getElementById("quiz-container");
    container.innerHTML = `
        <div class="question">
            <p>${questao.pergunta}</p>
            <ul class="options">
                ${questao.alternativas
            .map((alt, index) => `<li onclick="selecionarResposta(this, ${index})">${alt}</li>`)
            .join("")}
            </ul>
        </div>
    `;
}

// Função para verificar resposta
function selecionarResposta(elemento, indice) {
    const questao = questoes[questaoAtual];
    const alternativas = document.querySelectorAll(".options li");

    // Desabilita seleção múltiplas escolhas
    alternativas.forEach((alt) => (alt.style.pointerEvents = "none"));

    // Seleciona o feedback para a questão atual
    const feedbackContainer = document.querySelector(".feedback");

    // Verifica se a resposta está correta ou incorreta
    if (questao.alternativas[indice] === questao.resposta) {
        elemento.classList.add("correct");
        respostasCorretas++;
        respostas.push(true);

        // Atualiza o feedback para "correto"
        feedbackContainer.classList.remove("incorrect");
        feedbackContainer.classList.add("correct");
        feedbackContainer.innerHTML = `<p>Resposta correta! Parabéns!</p>`;

    } else {
        elemento.classList.add("incorrect");
        respostasErradas++;
        respostas.push(false);

        // Atualiza o feedback para "incorreto"
        feedbackContainer.classList.remove("correct");
        feedbackContainer.classList.add("incorrect");
        feedbackContainer.innerHTML = `<span style='color: red;'>Resposta incorreta!</span>
            <p>Explicação: ${questao.explicacao}</p>`;

        // Armazena a pergunta errada para refazer depois
        perguntasErradas.push(questao);
    }

    // Torna o feedback visível
    feedbackContainer.classList.add("show");

    questaoAtual++;
    setTimeout(mostrarQuestao, 2000);
}

// Função para exibir o feedback imediato de cada questão
function exibirFeedbackQuestao(correta, explicacao) {
    const feedbackText = document.getElementById("feedback-text");

    // Exibe a mensagem de feedback
    feedbackText.innerHTML = correta ?
        "<span style='color: green;'>Resposta correta!</span>" :
        "<span style='color: red;'>Resposta incorreta!</span>";

    // Exibe a explicação
    const explicacaoText = document.createElement("p");
    explicacaoText.textContent = "Explicação: " + explicacao;
    feedbackText.appendChild(explicacaoText);

    // Exibe o feedback, removendo a classe 'hidden'
    const feedbackContainer = document.querySelector(".feedback");
    feedbackContainer.classList.remove("hidden");
}

// Função para limpar o feedback antes de exibir a próxima questão
function limparFeedback() {
    const feedbackText = document.getElementById("feedback-text");
    feedbackText.innerHTML = ''; 

    // Esconde o feedback
    const feedbackContainer = document.querySelector(".feedback");
    feedbackContainer.classList.add("hidden");
}

// Função para esconder os botões de "Refazer" e "Reiniciar"
function esconderBotoes() {
    const buttonsContainer = document.querySelector(".buttons-container");
    buttonsContainer.classList.add("hidden");
    buttonsContainer.innerHTML = '';
}

// Função para exibir o feedback no final do quiz
function exibirFeedback() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = `
        <p>Fim das perguntas!</p>
        <p>Respostas corretas: ${respostasCorretas}</p>
        <p>Respostas incorretas: ${respostasErradas}</p>
    `;

    // Exibindo o feedback final
    const feedbackText = document.getElementById("feedback-text");
    feedbackText.textContent = `Você acertou ${respostasCorretas} de ${questoes.length} perguntas.`;

    // Tocar ao terminar todas as perguntas do quiz sem erros
    if (respostasErradas === 0) {
        tocarSom("assets/audio/goodresult.mp3");
    }

    // Mostrar os botões para refazer e reiniciar, removendo a classe "hidden"
    const buttonsContainer = document.querySelector(".buttons-container");
    buttonsContainer.classList.remove("hidden");

    buttonsContainer.innerHTML = `
        <button class="btn-refazer" onclick="refazerPerguntasErradas()">Refazer perguntas erradas</button>
        <button class="btn-reiniciar" onclick="reiniciarQuiz()">Reiniciar Quiz</button>
    `;
}

function esconderFeedbackEBotoes() {
    const buttonsContainer = document.querySelector(".buttons-container");
    const feedbackText = document.getElementById("feedback-text");

    buttonsContainer.classList.add("hidden");
    feedbackText.textContent = ''; 
    buttonsContainer.innerHTML = '';
}

// Função para refazer as perguntas erradas
function refazerPerguntasErradas() {
    // Resetando os contadores ao refazer
    respostasCorretas = 0;
    respostasErradas = 0;
    respostas = [];

    // Recarrega apenas as perguntas erradas
    questoes = [...perguntasErradas];  // Carrega as perguntas que o usuário errou
    questaoAtual = 0;  // Reinicia o índice das questões
    perguntasErradas = [];  // Limpa o array de perguntas erradas para evitar repetição

    // Esconde os botões antes de exibir as perguntas novamente
    esconderFeedbackEBotoes();

    mostrarQuestao();
}

// Função para reiniciar o quiz
function reiniciarQuiz() {
    cargoAtual = "Assistente Administrativo";
    document.getElementById("cargo-atual").innerText = `Cargo atual: ${cargoAtual}`;
    perguntasErradas = []; 

    esconderFeedbackEBotoes();

    carregarProximaQuestao();
}

// Função para tocar som
function tocarSom(src) {
    const audio = new Audio(src);
    audio.play().catch((e) => console.error("Erro ao reproduzir som:", e));
}

// Inicia o quiz
carregarProximaQuestao();
