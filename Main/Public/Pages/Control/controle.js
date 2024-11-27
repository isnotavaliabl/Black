const form = document.getElementById('gordura-form');
const resumo = document.getElementById('resumo');
const details = document.getElementById('details');
const detailsBody = document.getElementById('details-body');
const closeDetails = document.getElementById('close-details');
const usarGorduraBtn = document.getElementById('usar-gordura');
const usarQuantidadeInput = document.getElementById('usar-quantidade');
const saveCsvBtn = document.getElementById('save-csv');
const loadCsvBtn = document.getElementById('load-csv');

const registros = [];
let detalhesAtuais = [];

// Adicionar novo registro
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const placa = document.getElementById('placa').value;
    const cabo = document.getElementById('cabo').value;
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const data = new Date().toLocaleDateString();

    registros.push({ nome, placa, cabo, quantidade, data });

    atualizarResumo();
    form.reset();
});

// Atualizar resumo dos registros
function atualizarResumo() {
    const agrupados = {};

    registros.forEach((registro) => {
        const chave = `${registro.nome}-${registro.cabo}`;
        if (!agrupados[chave]) {
            agrupados[chave] = { nome: registro.nome, cabo: registro.cabo, total: 0, detalhes: [] };
        }
        agrupados[chave].total += registro.quantidade;
        agrupados[chave].detalhes.push(registro);
    });

    resumo.innerHTML = '';

    Object.values(agrupados).forEach((grupo) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grupo.nome}</td>
            <td>${grupo.cabo}</td>
            <td>${grupo.total.toFixed(2)}</td>
            <td><button onclick="mostrarDetalhes('${grupo.nome}', '${grupo.cabo}')">Exibir mais <i class="bi bi-search"></i></button></td>
        `;
        resumo.appendChild(row);
    });
}

// Mostrar detalhes de um registro específico
function mostrarDetalhes(nome, cabo) {
    detalhesAtuais = registros.filter((r) => r.nome === nome && r.cabo === cabo);

    detailsBody.innerHTML = '';
    detalhesAtuais.forEach((registro) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${registro.data}</td>
            <td>${registro.placa}</td>
            <td>${registro.quantidade.toFixed(2)}</td>
        `;
        detailsBody.appendChild(row);
    });

    details.style.display = 'block';
}

// Fechar o modal de detalhes
closeDetails.addEventListener('click', () => {
    details.style.display = 'none';
});

// Usar gordura disponível
usarGorduraBtn.addEventListener('click', () => {
    const usarQuantidade = parseFloat(usarQuantidadeInput.value);

    if (isNaN(usarQuantidade) || usarQuantidade <= 0) {
        alert('Insira um valor válido para usar gordura!');
        return;
    }

    const totalGordura = detalhesAtuais.reduce((acc, r) => acc + r.quantidade, 0);
    if (usarQuantidade > totalGordura) {
        alert('Valor excede a gordura disponível!');
        return;
    }

    registros.push({
        nome: detalhesAtuais[0].nome,
        placa: 'Uso de gordura',
        cabo: detalhesAtuais[0].cabo,
        quantidade: -usarQuantidade,
        data: new Date().toLocaleDateString(),
    });

    atualizarResumo();
    mostrarDetalhes(detalhesAtuais[0].nome, detalhesAtuais[0].cabo);
    usarQuantidadeInput.value = '';
});

// Salvar registros em CSV
saveCsvBtn.addEventListener('click', () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
        'Nome da Dupla,Placa,Tipo de Cabo,Quantidade (kg),Data\n' +
        registros.map((r) => `${r.nome},${r.placa},${r.cabo},${r.quantidade},${r.data}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'controle_de_gordura_18.11.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Carregar registros de um arquivo CSV
loadCsvBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const lines = reader.result.split('\n').slice(1); // Ignorar cabeçalho
            lines.forEach((line) => {
                const [nome, placa, cabo, quantidade, data] = line.split(',');
                if (nome && placa && cabo && quantidade && data) {
                    registros.push({
                        nome: nome.trim(),
                        placa: placa.trim(),
                        cabo: cabo.trim(),
                        quantidade: parseFloat(quantidade.trim()),
                        data: data.trim(),
                    });
                }
            });
            atualizarResumo();
        };

        reader.readAsText(file);
    });

    input.click();
});
