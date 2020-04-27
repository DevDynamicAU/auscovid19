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

export default {
	name: "NbrOfDeaths",
	components: {
		CChartLine
	},
	props: {
		//chartLabels: Array,
		chartData: Array,
		lineWidth: Number
	},
	computed: {
		defaultDatasets() {
			const qldColour = "#800000"
			const nswColour = "skyblue"
			const actColour = "#00005B"
			const vicColour = "navy"
			const tasColour = "#006A4E"
			const ntColour = "#E65A00"
			const saColour = "gold"
			const waColour = "black"

			const QLD = this.chartData.filter( v => v.ProvinceState == "Queensland").map( v => v.Deaths );
			const NSW = this.chartData.filter( v => v.ProvinceState == "New South Wales").map( v => v.Deaths );
			const ACT = this.chartData.filter( v => v.ProvinceState == "Australian Capital Territory").map( v => v.Deaths );
			const VIC = this.chartData.filter( v => v.ProvinceState == "Victoria").map( v => v.Deaths );
			const TAS = this.chartData.filter( v => v.ProvinceState == "Tasmania").map( v => v.Deaths );
			const NT  = this.chartData.filter( v => v.ProvinceState == "Northern Territory").map( v => v.Deaths );
			const SA  = this.chartData.filter( v => v.ProvinceState == "South Australia").map( v => v.Deaths );
			const WA  = this.chartData.filter( v => v.ProvinceState == "Western Australia").map( v => v.Deaths );

			return [
				{
					label: "QLD",
					backgroundColor: "transparent",
					borderColor: qldColour,
					pointHoverBackgroundColor: qldColour,
					borderWidth: this.lineWidth,
					data: QLD
				},
				{
					label: "NSW",
					backgroundColor: "transparent",
					borderColor: nswColour,
					pointHoverBackgroundColor: nswColour,
					borderWidth: this.lineWidth,
					data: NSW
				},
				{
					label: "ACT",
					backgroundColor: "transparent",
					borderColor: actColour,
					pointHoverBackgroundColor: actColour,
					borderWidth: this.lineWidth,
					data: ACT
				},
				{
					label: "VIC",
					backgroundColor: "transparent",
					borderColor: vicColour,
					pointHoverBackgroundColor: vicColour,
					borderWidth: this.lineWidth,
					data: VIC
				},
				{
					label: "TAS",
					backgroundColor: "transparent",
					borderColor: tasColour,
					pointHoverBackgroundColor: tasColour,
					borderWidth: this.lineWidth,
					data: TAS
				},
								{
					label: "NT",
					backgroundColor: "transparent",
					borderColor: ntColour,
					pointHoverBackgroundColor: ntColour,
					borderWidth: this.lineWidth,
					data: NT
				},
								{
					label: "SA",
					backgroundColor: "transparent",
					borderColor: saColour,
					pointHoverBackgroundColor: saColour,
					borderWidth: this.lineWidth,
					data: SA
				},
				{
					label: "WA",
					backgroundColor: "transparent",
					borderColor: waColour,
					pointHoverBackgroundColor: waColour,
					borderWidth: this.lineWidth,
					data: WA
				}
			];
		},
		chartLabels() {
			// some black magic to remove the duplicate dates from the this.ChartData object - https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
			return [...new Set(this.chartData.map( v => v.LastUpdate)) ]
		},
		defaultOptions() {
			return {
				maintainAspectRatio: false,
				responsive: true,
				legend: {
					display: true
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
								stepSize: 100 //Math.ceil(250 / 5)
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
