<template>
	<CChartLine
		:datasets="defaultDatasets"
		:options="defaultOptions"
		:labels="chartLabels"
	/>
</template>

<script>
import { CChartLine } from "@coreui/vue-chartjs";
import { getStyle, hexToRgba } from "@coreui/utils/src";

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export default {
	name: "MainChartExample",
	components: {
		CChartLine
	},
	props: {
		chartLabels: Array,
		chartData: Array
	},
	computed: {
		defaultDatasets() {
			// '#4dbd74'
			const confirmedCasesColour = "#4dbd74";

			//'#20a8d8'
			const deathsColour = "#f86c6b";

			//'#f86c6b'
			const recoveredColour = "#2e9ba6";

			const activeCasesColour = "green"
			const rateOfGrowthColour = "red"

			let elements = this.chartLabels.length;
			const confirmedCases = [];
			const deaths = [];
			const recovered = [];
			const activeCases = [];
			const rateOfGrowth = [];

			for (let i = 0; i <= elements; i++) {
				confirmedCases.push(random(0, 200));
				deaths.push(random(0, 200));
				recovered.push(random(0,200));
				activeCases.push(random(0, 200))
				rateOfGrowth.push(65);
			}

			return [
				{
					label: "Confirmed Cases",
					backgroundColor: hexToRgba(confirmedCasesColour, 10),
					borderColor: confirmedCasesColour,
					pointHoverBackgroundColor: confirmedCasesColour,
					borderWidth: 2,
					data: confirmedCases
				},
				{
					label: "No. of Deaths",
					backgroundColor: "transparent",
					borderColor: deathsColour,
					pointHoverBackgroundColor: deathsColour,
					borderWidth: 2,
					data: deaths
				},
				{
					label: "Recovered Cases",
					backgroundColor: "transparent",
					borderColor: recoveredColour,
					pointHoverBackgroundColor: recoveredColour,
					borderWidth: 1,
					data: recovered
				},
				{
					label: "Active Cases",
					backgroundColor: "transparent",
					borderColor: activeCasesColour,
					pointHoverBackgroundColor: activeCasesColour,
					borderWidth: 1,
					data: activeCases
				},
				{
					label: "Rate of Growth",
					backgroundColor: "transparent",
					borderColor: rateOfGrowthColour,
					pointHoverBackgroundColor: rateOfGrowthColour,
					borderWidth: 1,
					borderDash: [8, 5],
					data: rateOfGrowth
				}
			];
		},
		defaultOptions() {
			return {
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								drawOnChartArea: false
							}
						}
					],
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
								maxTicksLimit: 5,
								stepSize: Math.ceil(250 / 5),
								max: 250
							},
							gridLines: {
								display: true
							}
						}
					]
				},
				elements: {
					point: {
						radius: 0,
						hitRadius: 10,
						hoverRadius: 4,
						hoverBorderWidth: 3
					}
				}
			};
		}
	}
};
</script>
