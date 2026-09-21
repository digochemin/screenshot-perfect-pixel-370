# Reconstrução educativa QG do Fut

## Objetivo
Substituir integralmente o jogo atual por uma jornada educativa mobile-first em três páginas: Home, Captura e Isca em stories. O conteúdo será apresentado antes da prática, e cada resposta mostrará a explicação do porquê.

## O que será construído
- **Home (`/`)**: capa em tela cheia com refletores, chamada do conteúdo gratuito, título, subtítulo e acesso à captura.
- **Captura (`/comecar`)**: formulário de nome, WhatsApp, e-mail, time e consentimento; opção de outro time; gravação segura e entrada na isca.
- **Isca (`/isca`)**: 31 telas sem rolagem em 360×640, barras de progresso, avanço por toque lateral e teclado, retorno ao progresso salvo e bloqueio sem captura.
- **Conteúdo pedagógico integral**: textos, exemplos e sequência do briefing, sem resumir ou reescrever.
- **Cinco práticas exatas**: prever comentários, quatro rodadas de gatilhos, diagnosticar rotina, comparar valor de páginas e calcular o funil por ticket; cada uma com correção e painel “POR QUE”.
- **Fechamento**: resumo do aprendizado, quatro primeiros posts personalizados e próxima oferta configurável.
- **Privacidade**: manter a página simples exigida pelo consentimento.

## Dados e acompanhamento
- Preservar todos os contatos existentes.
- Adicionar, sem excluir campos antigos: data de cadastro, tela máxima, respostas/acertos, ticket escolhido e conclusão.
- Atualizar o progresso durante a isca e registrar os eventos Lead, ViuTela, Respondeu, ConcluiuIsca e CliqueOferta.
- O painel administrativo citado no final do briefing ficará fora desta entrega, pois o pedido delimita o site a três páginas e não fornece a senha de acesso.

## Direção visual e interação
- Preto, amarelo neon, creme e as quatro cores fixas dos gatilhos; Anton nos títulos e Inter nos textos.
- Cabeçalho e rodapé da marca em todas as telas, marca-texto amarelo e ilustrações leves em CSS/SVG.
- Framer Motion apenas para impacto, marca-texto, sequência, contador, pop e transição lateral; movimento reduzido vira somente fade.
- Sem placar, pontos, níveis, cronômetro, cartas, álbum, arrastar, swipe, sliders, quiz de nicho, montagem de calendário ou plano de jogo.

## Validação
- Conferir a jornada completa e persistência de progresso.
- Testar especialmente em 360×640, garantindo zero rolagem, texto legível e controles tocáveis.
- Verificar Home, Captura, Isca e Privacidade, além dos metadados próprios de cada página.
