import type { Quiz } from '@/types/quiz';

export const SEED_USERS = [
  { username: 'demo_ana', password: 'demo123' },
  { username: 'demo_bruno', password: 'demo123' },
  { username: 'demo_carla', password: 'demo123' },
] as const;

interface SeedQuestion {
  statement: string;
  alternatives: string[];
  correctAlternativeIndex: number;
}

interface SeedQuiz {
  author: 'currentUser' | (typeof SEED_USERS)[number]['username'];
  title: string;
  description?: string;
  difficulty?: Quiz['difficulty'];
  status: 'draft' | 'published';
  questions: SeedQuestion[];
}

export const SEED_QUIZZES: SeedQuiz[] = [
  {
    author: 'currentUser',
    title: 'HTML e CSS',
    description: 'Revise a estrutura de páginas, seletores e propriedades de estilo para a web.',
    difficulty: 'easy',
    status: 'published',
    questions: [
      {
        statement: 'Qual elemento HTML representa o título principal de uma página?',
        alternatives: ['<p>', '<h1>', '<span>', '<footer>'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual propriedade CSS altera a cor do texto?',
        alternatives: ['background-color', 'font-size', 'color', 'border-color', 'display'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual seletor CSS seleciona todos os elementos com a classe destaque?',
        alternatives: ['#destaque', 'destaque', '*destaque', '.destaque'],
        correctAlternativeIndex: 3,
      },
    ],
  },
  {
    author: 'currentUser',
    title: 'JavaScript',
    difficulty: 'medium',
    status: 'published',
    questions: [
      {
        statement: 'Qual método cria um novo array transformando cada elemento do array original?',
        alternatives: ['forEach()', 'map()', 'push()', 'sort()'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual é o resultado de typeof null em JavaScript?',
        alternatives: ['"null"', '"undefined"', '"boolean"', '"object"', '"number"'],
        correctAlternativeIndex: 3,
      },
      {
        statement: 'Qual operador compara valor e tipo sem conversão implícita?',
        alternatives: ['===', '==', '=', '!='],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'O que uma função async sempre retorna?',
        alternatives: ['Uma string', 'Um número', 'Uma Promise', 'Um array', 'Um booleano'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual declaração cria uma variável com escopo de bloco que pode ser reatribuída?',
        alternatives: ['const', 'var', 'function', 'let'],
        correctAlternativeIndex: 3,
      },
    ],
  },
  {
    author: 'currentUser',
    title: 'Revisão de React',
    description: 'Questões sobre estado e renderização para revisar antes da próxima aula.',
    difficulty: 'hard',
    status: 'draft',
    questions: [
      {
        statement: 'Qual hook armazena um valor cuja atualização solicita uma nova renderização?',
        alternatives: ['useRef', 'useState', 'useId', 'useContext'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Para que serve a prop key ao renderizar uma lista de componentes?',
        alternatives: [
          'Definir a ordem alfabética dos itens',
          'Aplicar uma classe CSS automaticamente',
          'Impedir qualquer nova renderização',
          'Compartilhar estado entre todos os itens',
          'Identificar cada item entre seus irmãos durante a reconciliação',
        ],
        correctAlternativeIndex: 4,
      },
    ],
  },
  {
    author: 'currentUser',
    title: 'Lógica de programação',
    status: 'draft',
    questions: [
      {
        statement: 'Em um algoritmo, qual estrutura executa um bloco repetidamente enquanto uma condição é verdadeira?',
        alternatives: ['Condicional if', 'Laço while', 'Comando return', 'Declaração de constante'],
        correctAlternativeIndex: 1,
      },
    ],
  },
  {
    author: 'demo_ana',
    title: 'História do Brasil',
    description: 'Da colonização à República: acontecimentos e personagens da história brasileira.',
    difficulty: 'medium',
    status: 'published',
    questions: [
      {
        statement: 'Em que ano foi proclamada a Independência do Brasil?',
        alternatives: ['1500', '1808', '1822', '1889'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual foi a primeira capital do Brasil colonial?',
        alternatives: ['Salvador', 'Rio de Janeiro', 'Recife', 'São Paulo', 'Brasília'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Qual lei aboliu a escravidão no Brasil em 1888?',
        alternatives: ['Lei de Terras', 'Lei do Ventre Livre', 'Lei dos Sexagenários', 'Lei Áurea'],
        correctAlternativeIndex: 3,
      },
      {
        statement: 'Em que ano ocorreu a Proclamação da República no Brasil?',
        alternatives: ['1822', '1889', '1930', '1964', '1988'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Quem foi o primeiro presidente do Brasil?',
        alternatives: ['Floriano Peixoto', 'Prudente de Morais', 'Deodoro da Fonseca', 'Getúlio Vargas'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual atividade econômica marcou a exploração inicial do litoral pelos portugueses?',
        alternatives: ['Extração de pau-brasil', 'Cultivo de café', 'Mineração de ouro', 'Produção de borracha'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Em que ano foi promulgada a atual Constituição brasileira?',
        alternatives: ['1946', '1967', '1985', '1990', '1988'],
        correctAlternativeIndex: 4,
      },
    ],
  },
  {
    author: 'demo_ana',
    title: 'Geografia mundial',
    difficulty: 'easy',
    status: 'published',
    questions: [
      {
        statement: 'Qual é o maior oceano da Terra em área?',
        alternatives: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
        correctAlternativeIndex: 3,
      },
      {
        statement: 'Qual é a capital da Argentina?',
        alternatives: ['Montevidéu', 'Buenos Aires', 'Santiago', 'Lima', 'Bogotá'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Em qual continente está localizado o Egito?',
        alternatives: ['Europa', 'América', 'África', 'Oceania'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual linha imaginária divide a Terra em hemisférios Norte e Sul?',
        alternatives: ['Linha do Equador', 'Meridiano de Greenwich', 'Trópico de Câncer', 'Círculo Polar Ártico'],
        correctAlternativeIndex: 0,
      },
    ],
  },
  {
    author: 'demo_ana',
    title: 'Literatura brasileira',
    description: 'Um roteiro inicial de revisão de autores e obras da literatura brasileira.',
    status: 'draft',
    questions: [
      {
        statement: 'Quem escreveu Dom Casmurro?',
        alternatives: ['José de Alencar', 'Machado de Assis', 'Clarice Lispector', 'Jorge Amado'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual obra foi escrita por Graciliano Ramos?',
        alternatives: ['Iracema', 'O Cortiço', 'Macunaíma', 'Vidas Secas', 'A Hora da Estrela'],
        correctAlternativeIndex: 3,
      },
    ],
  },
  {
    author: 'demo_bruno',
    title: 'Matemática básica',
    description: 'Pratique porcentagens, frações, operações e conceitos de geometria.',
    difficulty: 'easy',
    status: 'published',
    questions: [
      {
        statement: 'Quanto é 20% de 150?',
        alternatives: ['15', '20', '30', '50'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Qual é a soma de 1/2 com 1/4?',
        alternatives: ['1/6', '2/6', '1/8', '2/4', '3/4'],
        correctAlternativeIndex: 4,
      },
      {
        statement: 'Qual é a área de um retângulo com lados de 4 cm e 6 cm?',
        alternatives: ['24 cm²', '10 cm²', '20 cm²', '12 cm²'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Qual é a raiz quadrada de 81?',
        alternatives: ['7', '9', '8', '6'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual é o valor de x na equação 2x + 6 = 14?',
        alternatives: ['2', '3', '5', '4', '7'],
        correctAlternativeIndex: 3,
      },
      {
        statement: 'Quantos graus somam os ângulos internos de um triângulo?',
        alternatives: ['90°', '360°', '180°', '270°'],
        correctAlternativeIndex: 2,
      },
    ],
  },
  {
    author: 'demo_bruno',
    title: 'Física',
    difficulty: 'hard',
    status: 'published',
    questions: [
      {
        statement: 'Um resistor de 6 Ω é submetido a uma tensão de 12 V. Qual é a corrente elétrica?',
        alternatives: ['0,5 A', '2 A', '6 A', '72 A'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual é a energia cinética de um corpo de 2 kg com velocidade de 3 m/s?',
        alternatives: ['3 J', '6 J', '12 J', '18 J', '9 J'],
        correctAlternativeIndex: 4,
      },
      {
        statement: 'Um corpo de 4 kg sofre uma força resultante de 20 N. Qual é sua aceleração?',
        alternatives: ['5 m/s²', '16 m/s²', '24 m/s²', '80 m/s²'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Uma onda tem frequência de 10 Hz e comprimento de onda de 2 m. Qual é sua velocidade?',
        alternatives: ['5 m/s', '12 m/s', '20 m/s', '8 m/s'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Um gás ideal sofre uma transformação isotérmica. Qual relação permanece constante?',
        alternatives: [
          'Pressão dividida pelo volume',
          'Pressão mais volume',
          'Volume dividido pela pressão',
          'Pressão vezes volume',
          'Pressão menos volume',
        ],
        correctAlternativeIndex: 3,
      },
    ],
  },
  {
    author: 'demo_bruno',
    title: 'Química',
    difficulty: 'medium',
    status: 'draft',
    questions: [
      {
        statement: 'Qual é o símbolo químico do sódio?',
        alternatives: ['S', 'So', 'Na', 'N'],
        correctAlternativeIndex: 2,
      },
      {
        statement: 'Uma solução aquosa com pH 2, a 25 °C, é classificada como:',
        alternatives: ['Ácida', 'Neutra', 'Básica', 'Sempre saturada', 'Sempre insolúvel'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Qual partícula determina o número atômico de um elemento?',
        alternatives: ['Nêutron', 'Elétron', 'Fóton', 'Próton'],
        correctAlternativeIndex: 3,
      },
    ],
  },
  {
    author: 'demo_carla',
    title: 'Biologia',
    description: 'Explore células, genética e processos fundamentais dos seres vivos.',
    difficulty: 'medium',
    status: 'published',
    questions: [
      {
        statement:
          'Qual organela é o principal local de produção de ATP na respiração aeróbica de células eucarióticas?',
        alternatives: ['Ribossomo', 'Mitocôndria', 'Lisossomo', 'Complexo golgiense'],
        correctAlternativeIndex: 1,
      },
      {
        statement: 'Qual base nitrogenada ocorre no RNA no lugar da timina?',
        alternatives: ['Adenina', 'Guanina', 'Citosina', 'Uracila', 'Timina'],
        correctAlternativeIndex: 3,
      },
      {
        statement: 'Qual processo produz gametas haploides nos seres humanos?',
        alternatives: ['Meiose', 'Mitose', 'Bipartição', 'Brotamento'],
        correctAlternativeIndex: 0,
      },
      {
        statement: 'Qual gás é liberado na fotossíntese oxigênica?',
        alternatives: ['Nitrogênio', 'Metano', 'Oxigênio', 'Hidrogênio'],
        correctAlternativeIndex: 2,
      },
    ],
  },
  {
    author: 'demo_carla',
    title: 'Inglês',
    description: 'Primeiras questões de vocabulário para uma revisão rápida.',
    status: 'draft',
    questions: [
      {
        statement: 'Qual palavra em inglês significa biblioteca?',
        alternatives: ['Bookstore', 'Classroom', 'Office', 'Kitchen', 'Library'],
        correctAlternativeIndex: 4,
      },
    ],
  },
  {
    author: 'currentUser',
    title: 'Arquitetura e acessibilidade de aplicações web',
    description:
      'Uma revisão baseada em situações práticas de desenvolvimento de interfaces, com foco na organização das responsabilidades, na experiência de navegação e no acesso ao conteúdo por diferentes pessoas. Os cenários apresentam equipes que precisam tomar decisões sobre formulários, componentes e persistência de informações, considerando tanto a manutenção do código quanto o uso da aplicação em telas pequenas, com teclado e com tecnologias assistivas.',
    difficulty: 'hard',
    status: 'published',
    questions: [
      {
        statement:
          'Uma equipe está desenvolvendo um formulário de inscrição com campos de nome, senha e confirmação de senha. Durante uma revisão, percebe que os campos são identificados apenas por textos de placeholder, que desaparecem quando a pessoa começa a digitar. Além disso, as mensagens de erro são exibidas somente pela mudança da borda para vermelho. Qual alteração melhora a identificação dos campos e a compreensão dos erros para pessoas que utilizam diferentes formas de navegação?',
        alternatives: [
          'Manter apenas os placeholders e aumentar a intensidade do vermelho, pois uma cor mais forte substitui a necessidade de explicar o problema encontrado.',
          'Adicionar rótulos persistentes associados aos campos e mensagens textuais de erro, vinculando essas mensagens aos campos correspondentes.',
          'Remover as mensagens de erro e impedir o envio do formulário até que todos os valores estejam corretos, sem apresentar orientações adicionais.',
          'Exibir os nomes dos campos apenas quando o mouse estiver sobre eles, mantendo o restante das informações disponível somente após o envio.',
        ],
        correctAlternativeIndex: 1,
      },
      {
        statement:
          'Em uma aplicação de quizzes, o componente de listagem recebe uma coleção de registros e permite buscar pelo título. O mesmo componente também contém instruções para ler o armazenamento, verificar quem está autenticado, publicar quizzes e desenhar cada alternativa das questões. A equipe deseja reduzir a dificuldade de manutenção sem criar uma grande quantidade de abstrações. Qual divisão de responsabilidades é mais adequada para esse objetivo?',
        alternatives: [
          'Reunir todas as operações em um único arquivo ainda maior, de modo que qualquer modificação possa ser feita sem abrir outros arquivos.',
          'Duplicar a leitura do armazenamento e as regras de publicação dentro de cada card, permitindo que todos os componentes implementem sua própria versão.',
          'Mover todas as decisões para classes CSS e atributos visuais, deixando a persistência ser determinada pela aparência de cada elemento.',
          'Separar a persistência em serviços, coordenar as regras compartilhadas na camada de estado e manter os componentes visuais focados nos dados que exibem.',
          'Criar um contexto diferente para cada campo de texto, mesmo quando o valor é utilizado apenas em um único formulário local.',
        ],
        correctAlternativeIndex: 3,
      },
      {
        statement:
          'Uma página apresenta dois elementos com aparência semelhante: o primeiro abre a área de cadastro e o segundo remove os filtros atualmente aplicados à listagem, sem sair da página. A equipe quer preservar o comportamento esperado do navegador e permitir que os controles sejam compreendidos por pessoas que navegam com teclado. Qual combinação de elementos HTML representa melhor essas duas ações?',
        alternatives: [
          'Um link com destino para o cadastro e um botão para limpar os filtros, mantendo nomes acessíveis e indicação visual de foco em ambos.',
          'Dois elementos de parágrafo com eventos de clique, pois qualquer texto pode substituir controles de navegação sem adaptações adicionais.',
          'Duas imagens sem texto alternativo, usando somente as cores para diferenciar o cadastro da ação de limpar os filtros.',
          'Um botão para cada ação, removendo a indicação de foco para que o desenho dos controles permaneça igual durante a navegação por teclado.',
        ],
        correctAlternativeIndex: 0,
      },
    ],
  },
  {
    author: 'demo_ana',
    title: 'Planejamento e colaboração em projetos de software',
    description:
      'Analise decisões de uma equipe universitária que precisa organizar uma entrega de software com prazo limitado. As questões exploram recortes de escopo, critérios de aceitação, comunicação entre integrantes e acompanhamento do trabalho. Cada situação contém informações suficientes para comparar alternativas e identificar uma ação coerente com o problema apresentado, sem depender de uma metodologia específica ou de ferramentas externas de gerenciamento.',
    difficulty: 'medium',
    status: 'published',
    questions: [
      {
        statement:
          'Faltam três dias para a apresentação de um projeto acadêmico. A equipe já consegue cadastrar usuários, criar quizzes e publicar questões, mas ainda não implementou avaliações por estrelas, coleções e relatórios detalhados. Os integrantes percebem que tentar concluir todas essas funcionalidades pode impedir a validação do fluxo principal. Qual decisão é mais coerente com uma entrega reduzida, verificável e comunicada de forma clara?',
        alternatives: [
          'Iniciar todas as funcionalidades restantes ao mesmo tempo e avaliar somente no dia da apresentação quais delas conseguiram funcionar.',
          'Manter a promessa de escopo completo, mesmo sabendo que parte das telas será apenas decorativa e não terá o comportamento anunciado.',
          'Definir o fluxo principal que será entregue, registrar o que ficou fora desse recorte e validar os critérios de aceitação das funcionalidades incluídas.',
          'Interromper a revisão do que já foi desenvolvido para aumentar a quantidade de telas, independentemente da utilidade de cada uma.',
        ],
        correctAlternativeIndex: 2,
      },
      {
        statement:
          'Durante a implementação da página inicial, uma pessoa recebe a orientação de exibir apenas quizzes publicados. O requisito geral também menciona coleções e avaliações, mas a tarefa da entrega atual limita o trabalho à listagem de quizzes e aos filtros por título e dificuldade. Para evitar interpretações diferentes entre quem implementa e quem revisa, qual critério de aceitação descreve um comportamento observável dessa entrega?',
        alternatives: [
          'A página deve parecer moderna e demonstrar que a plataforma poderá receber muitas funcionalidades no futuro.',
          'O código deve conter o maior número possível de componentes, independentemente da responsabilidade de cada um.',
          'Todos os recursos mencionados no requisito geral precisam ser iniciados, mesmo quando foram retirados do escopo da tarefa atual.',
          'A implementação deve ser considerada concluída assim que o primeiro card aparecer, sem verificar os registros que foram excluídos.',
          'Ao acessar a home como visitante, os quizzes publicados são exibidos, os rascunhos ficam ausentes e os filtros restringem os resultados apresentados.',
        ],
        correctAlternativeIndex: 4,
      },
      {
        statement:
          'Dois integrantes estão trabalhando na mesma aplicação. Um altera o formato dos dados persistidos enquanto o outro prepara os dados de demonstração usando o formato anterior. A incompatibilidade só é percebida durante a preparação da apresentação, quando parte do conteúdo deixa de aparecer. Qual prática teria ajudado a identificar essa dependência antes da integração final?',
        alternatives: [
          'Evitar compartilhar alterações de estrutura até o momento da apresentação, para que cada integrante possa trabalhar sem interrupções.',
          'Comunicar a mudança do formato, revisar seus consumidores e combinar uma verificação de integração com um pequeno conjunto de dados representativos.',
          'Criar dados aleatórios diferentes a cada execução, sem registrar qual formato cada parte da aplicação espera receber.',
          'Remover as informações que não aparecem e considerar que a ausência de mensagens de erro comprova a compatibilidade dos formatos.',
        ],
        correctAlternativeIndex: 1,
      },
    ],
  },
  {
    author: 'demo_carla',
    title: 'Consumo consciente e gestão de recursos naturais',
    description:
      'Situações do cotidiano de uma comunidade universitária para refletir sobre o uso de água, energia e materiais. Os enunciados apresentam problemas concretos, observações disponíveis e propostas de intervenção, incentivando a comparação de alternativas antes de escolher uma medida. O objetivo é praticar a interpretação de cenários e reconhecer decisões que reduzem desperdícios, preservam a utilidade dos recursos e permitem acompanhar os resultados ao longo do tempo.',
    difficulty: 'easy',
    status: 'published',
    questions: [
      {
        statement:
          'Uma universidade percebeu que o consumo de água permanece elevado mesmo nos fins de semana, quando os prédios estão quase vazios. A equipe de manutenção encontrou torneiras que não fecham completamente e sinais de vazamento em uma tubulação próxima aos banheiros. Antes de iniciar uma campanha pedindo mudanças de comportamento aos estudantes, qual medida atua diretamente sobre os problemas observados?',
        alternatives: [
          'Consertar os vazamentos identificados e acompanhar o consumo após os reparos, comparando períodos de uso semelhantes.',
          'Instalar cartazes que responsabilizem exclusivamente os estudantes, mantendo as torneiras e a tubulação nas mesmas condições.',
          'Suspender a leitura dos medidores nos fins de semana para que o relatório apresente um valor médio de consumo menor.',
          'Aumentar o tempo de abertura das torneiras durante a limpeza, sem investigar a origem do consumo fora do horário de funcionamento.',
        ],
        correctAlternativeIndex: 0,
      },
      {
        statement:
          'Na organização de uma feira de ciências, uma turma precisa escolher os materiais usados nos estandes. Há placas e suportes de edições anteriores em boas condições, mas também existe a possibilidade de comprar todos os itens novamente. A turma quer reduzir a geração de resíduos sem comprometer a segurança e a legibilidade da apresentação. Qual proposta atende melhor a esse objetivo?',
        alternatives: [
          'Descartar todo o material antigo antes de examiná-lo, pois apenas itens novos podem ser utilizados em uma apresentação organizada.',
          'Comprar materiais em quantidade muito superior à necessária, mesmo sem previsão de armazenamento ou de uso em outros eventos.',
          'Misturar os resíduos de montagem para acelerar a limpeza, independentemente das possibilidades de reaproveitamento e separação.',
          'Avaliar e reutilizar os materiais conservados, adaptar a comunicação visual e adquirir somente os itens que realmente faltam.',
          'Eliminar informações essenciais dos estandes para reduzir o tamanho dos cartazes, ainda que o público deixe de compreender os projetos.',
        ],
        correctAlternativeIndex: 3,
      },
      {
        statement:
          'Uma sala de estudos fica iluminada e com equipamentos ligados durante várias horas após o encerramento das atividades. A coordenação deseja reduzir esse desperdício e saber se a mudança teve efeito. Considerando que a quantidade de pessoas e os horários de funcionamento podem variar durante o semestre, qual plano permite agir sobre a situação e avaliar o resultado de forma mais consistente?',
        alternatives: [
          'Comparar apenas o valor total de duas contas de energia, ignorando mudanças no preço, nos horários de uso e na ocupação da sala.',
          'Desligar permanentemente todos os equipamentos, inclusive durante as aulas, sem considerar as necessidades de quem utiliza o espaço.',
          'Definir uma rotina de desligamento após o uso e acompanhar o consumo em períodos comparáveis, registrando os horários e a ocupação.',
          'Manter os equipamentos ligados continuamente e avaliar o resultado apenas pela percepção de que a sala parece mais organizada.',
        ],
        correctAlternativeIndex: 2,
      },
    ],
  },
];
