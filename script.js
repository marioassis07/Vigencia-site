// Menu do celular: o botão abre e fecha a lista de links
const botaoMenu = document.querySelector('.botao-menu');
const menu = document.querySelector('.menu');

function mudarMenu(abrir) {
    menu.classList.toggle('aberto', abrir);
    botaoMenu.setAttribute('aria-expanded', abrir);
    botaoMenu.querySelector('.texto-oculto').textContent = abrir ? 'Fechar o menu' : 'Abrir o menu';
}

botaoMenu.addEventListener('click', () => mudarMenu(!menu.classList.contains('aberto')));

// Ao escolher um link, o menu fecha para mostrar a seção
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => mudarMenu(false)));

// A tecla Esc também fecha o menu e devolve o foco para o botão
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
        mudarMenu(false);
        botaoMenu.focus();
    }
});

// O cabeçalho ganha sombra quando a página sai do topo
const cabecalho = document.querySelector('.cabecalho');

function atualizarCabecalho() {
    cabecalho.classList.toggle('rolado', window.scrollY > 10);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();

// O link do menu da seção que está na tela ganha a linha vermelha embaixo
const linksMenu = document.querySelectorAll('.links-menu a');
const secoesDoMenu = [...linksMenu].map((link) => document.querySelector(link.getAttribute('href')));

const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        linksMenu.forEach((link) => {
            link.classList.toggle('atual', link.getAttribute('href') === '#' + entrada.target.id);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' }); // conta como "na tela" a seção que passa pelo meio da janela

secoesDoMenu.forEach((secao) => observador.observe(secao));

// Fora das seções do menu (topo, problema, app, painel, contato), nenhum link fica marcado
const outrasSecoes = document.querySelectorAll('#inicio, #problema, #app, #painel, #contato');
const observadorOutras = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) linksMenu.forEach((link) => link.classList.remove('atual'));
    });
}, { rootMargin: '-45% 0px -50% 0px' });

outrasSecoes.forEach((secao) => observadorOutras.observe(secao));

// Animação de entrada: quando uma seção aparece na tela, os elementos dela sobem e aparecem, um depois do outro.
// Cada grupo diz quais elementos animam e de que jeito (o jeito padrão é subir; "lado" desliza da esquerda, "direita" vem da direita e "escala" cresce)
const gruposAnimados = [
    { seletor: '.topo-texto > *' },
    { seletor: '.topo-arte img', jeito: 'escala' },
    { seletor: '.cabeca-secao > *' },
    { seletor: '.numero, .rodape-problema' },
    { seletor: '.tabela-comparacao tbody tr, .etapas > h3, .etapas > p' },
    { seletor: '.lista-etapas li', jeito: 'lado' },
    { seletor: '.cartao, .nota-app' },
    { seletor: '.descricao-painel' },
    { seletor: '.lista-painel li', jeito: 'lado' },
    { seletor: '.caixa-imagem-painel', jeito: 'direita' },
    { seletor: '.destaque-orgaos, .caixa-info, .diferenciais li' },
    { seletor: '.lista-seguranca li' },
    { seletor: '.pessoa' },
    { seletor: '.chamada-contato > *' },
];

const secoesAnimadas = document.querySelectorAll('main section');
const ATRASO_MAXIMO = 10; // depois do 10º elemento, os outros entram juntos, para a seção não demorar demais

secoesAnimadas.forEach((secao) => {
    let ordem = 0;
    gruposAnimados.forEach(({ seletor, jeito }) => {
        secao.querySelectorAll(seletor).forEach((elemento) => {
            elemento.classList.add('item-animado');
            if (jeito) elemento.classList.add('item-' + jeito);
            elemento.style.setProperty('--ordem', Math.min(ordem++, ATRASO_MAXIMO));
        });
    });
    // Só esconde os elementos agora que o JavaScript está funcionando
    secao.classList.add('animar');
});

const observadorEntrada = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const secao = entrada.target;
        secao.classList.add('visivel');
        observadorEntrada.unobserve(secao); // a animação acontece uma vez só

        // Depois que tudo entrou, volta ao estilo normal. A animação mais longa é a do padrão do topo (0,2s + 2,2s), então espera 2,8s
        setTimeout(() => secao.classList.remove('animar', 'visivel'), 2800);
    });
// A seção conta como "na tela" quando o topo dela passa de 85% da altura da janela.
// Assim funciona até em seções mais altas que a tela, que nunca ficariam 20% visíveis de uma vez
}, { threshold: 0, rootMargin: '0px 0px -15% 0px' });

// Faixas de damasco (problema, segurança e o fundo da seção do app): cada uma tem o próprio gatilho, porque a do problema fica no fim
// de uma seção alta e terminaria de animar antes de alguém chegar nela
const faixasPadrao = document.querySelectorAll('.faixa-padrao, #app');
faixasPadrao.forEach((faixa) => faixa.classList.add('faixa-animar'));

const observadorFaixas = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const faixa = entrada.target;
        faixa.classList.add('faixa-visivel');
        observadorFaixas.unobserve(faixa);
        // Quando a cortina termina (1,6s nas faixas, 3s nas ondas do app), volta ao estilo normal
        setTimeout(() => faixa.classList.remove('faixa-animar', 'faixa-visivel'), faixa.id === 'app' ? 3300 : 1900);
    });
}, { rootMargin: '0px 0px -15% 0px' }); // começa assim que o topo passa de 85% da altura da janela, como as outras animações de entrada (funciona até em elementos mais altos que a tela)

function comecarAnimacoes() {
    secoesAnimadas.forEach((secao) => observadorEntrada.observe(secao));
    faixasPadrao.forEach((faixa) => observadorFaixas.observe(faixa));
}

// Tela de abertura: a animação está no CSS. Quando ela termina, o elemento sai da página
// e as seções começam a animar (antes disso, o topo animaria escondido atrás dela)
const telaAbertura = document.querySelector('.tela-abertura');

if (!telaAbertura) {
    comecarAnimacoes();
} else {
    let removida = false;
    const removerAbertura = () => {
        if (removida) return;
        removida = true;
        telaAbertura.remove();
        comecarAnimacoes();
    };

    telaAbertura.addEventListener('animationend', (evento) => {
        // a logo também tem animação e o aviso dela chega aqui: só vale o fim da tela azul
        if (evento.animationName === 'sumirAbertura') removerAbertura();
    });

    // Garantia: se o navegador não avisar o fim da animação, sai mesmo assim (1,7s + 0,6s)
    setTimeout(removerAbertura, 2500);
}

// Voltar ao topo: o botão aparece quando a pessoa já desceu mais que uma tela
const botaoTopo = document.querySelector('.voltar-topo');
const mostrarBotaoTopo = () => botaoTopo.classList.toggle('aparecer', window.scrollY > window.innerHeight * 0.8);
window.addEventListener('scroll', mostrarBotaoTopo, { passive: true });
mostrarBotaoTopo();
