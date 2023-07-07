<template>
    <div data-app>
        <div v-show="!exibeReport">
            <v-card>
                <v-data-table :headers="headers" :items="reportlist">
                    <template v-slot:item="row">
                                                                                                <tr>
                                                                                                    <td>{{row.item.reportid}} - {{row.item.title}}</td>
                                                                                                    <td>
                                                                                                        <v-btn class="mx-2" fab small v-b-tooltip.hover title="emitir relatório" @click="emmit(row.item)">
                                                                                                            <v-icon>mdi-arrow-collapse-down</v-icon>
                                                                                                        </v-btn>
                                                                                                    </td>
                                                                                                </tr>
</template>
            </v-data-table>
        </v-card>
        <b-modal ref="modalmes" id="modal-mes" title="parâmetro mês" @ok="emmitMes">
            <v-select 
                    v-model="mes"
                    class="col-3" 
                    label="Mês"
                    :items="meses" 
                    item-value="value"
                    item-text="label">
            </v-select>
        </b-modal>
        <b-modal ref="modaldata" id="modal-data" title="parâmetro data" @ok="emmitData">
            <v-text-field label="Data início" v-model="dayStart" hint="Formato: DD/MM/YYYY" type="date"></v-text-field>
            <v-text-field label="Data fim" v-model="dayEnd" hint="Formato: DD/MM/YYYY" type="date"></v-text-field>
        </b-modal>
        </div>
        <div v-show="exibeReport">
            <div :id="'report'+id">
                <div class="mb-3">
                    <v-btn @click="exibeReport = !exibeReport" v-show="escondeBotoes">Voltar</v-btn>
                </div>
                <div>
                    <v-btn v-if="id == 1 || id == 3" style="background-color:red; color:white" v-show="escondeBotoes" @click="pdf">Gerar PDF</v-btn>
                </div> 
                <div>
                    <v-btn v-if="id == 2" style="background-color:green; color:white" v-show="escondeBotoes" @click="id == 2 ? exportToCsv(generateItemsReport2(), headersReport2):null">Exportar CSV</v-btn>
                </div> 
                <div class="p-2 mb-5 mt-3" style="border-style: solid; width: 75%; margin-left: auto; margin-right: auto;">    
                    <strong><p class="p-3 mt-2 mb-2" style="text-align: center;">{{title}}</p></strong>
                </div>
                <canvas v-if="id == 1" width="500%" class="canvas" ref="chart"></canvas>
                <v-data-table v-if="id == 2" :headers="headersReport2" :items="itemsReport2">
<template v-slot:item="row">
    <tr>
        <td>{{row.item.anomalyid}}</td>
        <ul v-for="item in row.item.anomalia.split('\n')">
            <li v-if="item.length > 0">
                <div style="font-size: small;">{{item}}</div>
            </li>
        </ul>
        <td>{{row.item.createdat}}</td>
        <td>{{row.item.lasttreatment}}</td>
        <td>{{row.item.normalizedat}}</td>
        <td>{{row.item.closedat}}</td>
        <ul v-for="item in row.item.acoes">
            <li v-if="item.length > 0">
                <div style="font-size: small;">{{item}}</div>
            </li>
        </ul>
    </tr>
</template>
                </v-data-table>
                <div v-if="id == 3">
                    <div v-for="item in itemsReport3" key="equipmentid">
                        <strong><p class="mt-3"> Equipamento {{ item.equipmentid }} </p></strong>
                        <canvas :id="'canva' + item.equipmentid" width="500%" class="canvas" ></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import reportService from "../service/reportService"
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExportToCsv } from 'export-to-csv';

export default {
    name: "reportDetail",
    mounted() {
        this.load();
    },
    data() {
        return {
            reportlist: [],
            itemsReport2: [],
            itemsReport3: [],
            headersReport2: [
                { text: "anomalia" },
                { text: "ocorrência" },
                { text: "Criada em" },
                { text: "tratamento em" },
                { text: "Normalizada em" },
                { text: "Fechada em" },
                { text: "ação" },
            ],
            headers: [{ text: "Título do relatório" }],
            meses: [
                { label: 'Janeiro', value: 1 },
                { label: 'Fevereiro', value: 2 },
                { label: 'Março', value: 3 },
                { label: 'Abril', value: 4 },
                { label: 'Maio', value: 5 },
                { label: 'Junho', value: 6 },
                { label: 'Julho', value: 7 },
                { label: 'Agosto', value: 8 },
                { label: 'Setembro', value: 9 },
                { label: 'Outubro', value: 10 },
                { label: 'Novembro', value: 11 },
                { label: 'Dezembro', value: 12 },
            ],
            mes: null,
            dayStart: null,
            dayEnd: null,
            id: null,
            title: 'Relatório',
            exibeReport: false,
            chart: null,
            charts: [],
            escondeBotoes: true
        }
    },
    methods: {
        load() {
            new reportService().getReports().then(data => {
                this.reportlist = data.data.sort((a, b) => {
                    if (a.reportid < b.reportid) {
                        return -1;
                    } else if (a.reportid > b.reportid) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
            }).catch(e => {
                console.log('erro', e)
            })
        },
        emmit(report) {
            this.title = report.title
            this.id = report.reportid
            if (report.parametro == 'mes') {
                let element = this.$refs.modalmes
                element.show()
            } else if (report.parametro == 'data') {
                let element = this.$refs.modaldata
                element.show()
            } else {
                new reportService().generateReport(this.id).then(data => {
                    if (this.id == 3) {
                        this.exibeReport = true;
                        let response = data.data
                        const transformedArray = response.reduce((acc, item) => {
                            const { equipmentid, qtd, anomalytypeid } = item;
                            const existingItem = acc.find(obj => obj.equipmentid === equipmentid);

                            if (existingItem) {
                                existingItem.anomalias.push({ qtd, anomalytypeid });
                            } else {
                                acc.push({
                                    equipmentid,
                                    anomalias: [{ qtd, anomalytypeid }]
                                });
                            }

                            return acc;
                        }, []);
                        this.itemsReport3 = transformedArray;
                        for (let i in this.itemsReport3) {
                            let label = []
                            let colors = []
                            let value = []
                            let response = this.itemsReport3[i].anomalias
                            for (let x in response) {
                                label.push(this.loadAnomaly(response[x].anomalytypeid))
                                colors.push(this.generateColor())
                                value.push(response[x].qtd)
                            }
                            setTimeout(() => {
                                for(let y in this.charts){
                                    this.charts[y].destroy()
                                }
                                let ref = document.getElementById('canva' + this.itemsReport3[i].equipmentid)
                                this.renderChartBar(label, colors, value, ref)
                            }, 500)
                        }
                    }
                })
            }
        },
        loadAnomaly(type) {
            if (type == 1) {
                return 'Corrente fora do padrão'
            } else if (type == 2) {
                return 'Tensão fora do padrão'
            } else if (type == 3) {
                return 'Falta de fase'
            }
        },
        emmitMes() {
            if (this.id == 1) {
                this.exibeReport = true;
                new reportService().generateReport(this.id, this.mes).then(data => {
                    let response = data.data
                    let label = []
                    let colors = []
                    let value = []
                    for (let x in response) {
                        label.push('Equipamento ' + response[x].equipmentid + '- ' + response[x].hours + ' horas/mês')
                        colors.push(this.generateColor())
                        value.push(response[x].hours)
                    }
                    if (this.chart != null) {
                        this.chart.destroy();
                    }
                    this.renderChartPie(label, colors, value)
                })
            }
        },
        emmitData() {
            if (this.id == 2) {
                new reportService().generateReport(this.id, this.fortmateDateDMY(this.dayStart) + ';' + this.fortmateDateDMY(this.dayEnd)).then(data => {
                    this.itemsReport2 = data.data.map(x => {
                        return {
                            anomalyid: x.anomalyid,
                            anomalia: x.anomalia,
                            createdat: this.fortmateDate(x.createdat),
                            lasttreatment: this.fortmateDate(x.lasttreatment),
                            normalizedat: this.fortmateDate(x.normalizedat),
                            closedat: this.fortmateDate(x.closedat)
                        }
                    })
                    let acoes = []
                    for (let x in data.data) {
                        let users = data.data[x].username.split(";")
                        let acao = data.data[x].observation.split(";")
                        for (let i in users) {
                            acoes.push(users[i] + ': ' + acao[i])
                        }
                        this.itemsReport2[x] = { ...this.itemsReport2[x], acoes: acoes }
                    }
                    this.exibeReport = true;
                })
            }
        },
        renderChartPie(label, colors, value) {
            const ctx = this.$refs.chart.getContext('2d');
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: label,
                    datasets: [{
                        data: value,
                        backgroundColor: colors,
                    }, ],
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                },
            });
        },
        renderChartBar(label, colors, value, ref) {
            if (this.id == 3) {
                const ctx = ref.getContext('2d');
                this.charts.push(new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: label,
                        datasets: [{
                            label: 'Quantidade de anomalias por tipo',
                            data: value,
                            backgroundColor: colors,
                        }, ],
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                    },
                }))
            }
        },
        pdf() {
            this.escondeBotoes = false
            setTimeout(() => {
                let canvas = document.getElementById("report" + this.id);
                const doc = new jsPDF({
                    orientation: 'landscape',
                    unit: 'cm',
                    format: 'letter'
                });
                html2canvas(canvas).then((canvasImg) => {
                    // Obtém a largura e altura do canvas
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;

                    // Define a largura e altura do PDF com base no canvas
                    const pdfWidth = canvasWidth;
                    const pdfHeight = canvasHeight;

                    // Adiciona a imagem do canvas ao PDF
                    doc.addImage(canvasImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                    // Salva o PDF
                    doc.save('report.pdf');
                    this.exibeReport = false;
                    this.escondeBotoes = true
                });
            }, 1000)
        },
        generateColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';

            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            return color;

        },
        loadtitle() {
            let title = this.reportlist.find(x => { x.reportid == this.id })
            if (title == undefined) {
                return 'Relatório'
            } else {
                return title.title
            }
        },
        fortmateDate(date) {
            if (date == null) {
                return null
            }
            const data = new Date(date);

            const dia = this.adicionarZero(data.getUTCDate());
            const mes = this.adicionarZero(data.getUTCMonth() + 1);
            const ano = data.getUTCFullYear();
            const horas = this.adicionarZero(data.getHours());
            const minutos = this.adicionarZero(data.getMinutes());
            const segundos = this.adicionarZero(data.getSeconds());

            // Criando a string formatada
            return dia + "/" + mes + "/" + ano + " " + horas + ":" + minutos + ":" + segundos;
        },
        fortmateDateDMY(date) {
            if (date == null) {
                return null
            }
            const data = new Date(date);

            const dia = this.adicionarZero(data.getUTCDate());
            const mes = this.adicionarZero(data.getUTCMonth() + 1);
            const ano = data.getUTCFullYear();

            // Criando a string formatada
            return dia + "/" + mes + "/" + ano;
        },
        adicionarZero(numero) {
            if (numero < 10) {
                return "0" + numero;
            }
            return numero;
        },
        exportToCsv(items, fields) {
            const options = {
                fieldSeparator: ';',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                showTitle: true,
                title: this.title,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: true,
                headers: fields,
                filename: "relatorio"
            };

            const csvExporter = new ExportToCsv(options);

            csvExporter.generateCsv(items);
        },
        generateItemsReport2() {
            let items = this.itemsReport2.map(x => {
                x.anomalia = x.anomalia.replace('\n', '|')
                return x
            })
            return items
        }
    },
};
</script>

<style scoped>
.canvas {
    padding-left: 0;
    padding-right: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
    width: 800px;
}
</style>
