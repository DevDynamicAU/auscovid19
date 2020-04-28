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
		chartData: Array,
		lineWidth: Number,
		mainCountry: String,
		countries: Array
	},
	computed: {
		defaultDatasets() {
			let dataSets = []

			for (const country of this.countries) {

				if (this.mainCountry.toLowerCase() == "australia") {
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

						dataSets.push({ label: "QLD", 
										backgroundColor: "transparent", borderColor: qldColour, pointHoverBackgroundColor: qldColour, borderWidth: this.lineWidth, data: QLD })

						dataSets.push({ label: "NSW",
										backgroundColor: "transparent", borderColor: nswColour, pointHoverBackgroundColor: nswColour, borderWidth: this.lineWidth, data: NSW })

						dataSets.push({ label: "ACT",
										backgroundColor: "transparent", borderColor: actColour, pointHoverBackgroundColor: actColour, borderWidth: this.lineWidth, data: ACT })
						
						dataSets.push({ label: "VIC",
										backgroundColor: "transparent", borderColor: vicColour, pointHoverBackgroundColor: vicColour, borderWidth: this.lineWidth, data: VIC })
						
						dataSets.push({ label: "TAS",
										backgroundColor: "transparent", borderColor: tasColour, pointHoverBackgroundColor: tasColour, borderWidth: this.lineWidth, data: TAS })
						
						dataSets.push({ label: "NT",
										backgroundColor: "transparent", borderColor: ntColour,  pointHoverBackgroundColor: ntColour,  borderWidth: this.lineWidth, data: NT  })
						
						dataSets.push({ label: "SA",
										backgroundColor: "transparent", borderColor: saColour,  pointHoverBackgroundColor: saColour,  borderWidth: this.lineWidth, data: SA  })
						
						dataSets.push({ label: "WA",
										backgroundColor: "transparent", borderColor: waColour,  pointHoverBackgroundColor: waColour, borderWidth: this.lineWidth,  data: WA  })

				} else {
					const countryColour = this.validCountries.filter(v => v.country == country)[0].colour

					if (this.chartData.filter( v=> v.Country == country).length > 0) {
						const countryData = this.chartData.filter( v => v.Country == country)[0].Cases.map( v => v.Deaths );
						
						dataSets.push({ label: country,
										backgroundColor: "transparent",
										borderColor: countryColour, pointHoverBackgroundColor: countryColour,borderWidth: this.lineWidth, data: countryData })
					}
				}
			}

			return dataSets;
		},
		validCountries() {
			return [{
				country: "US",
				colour: "blue"
			}, {
				country: "Australia",
				colour: "gold"
			}]
		},
		chartLabels() {
			// Holds the extracted labels
			let labels = []

			// Temp variable that is used to see if we have some data or not to extract the labels from
			let data = []

			// if the main country is Australia, then we can get the labels from the chart data passed in
			if (this.mainCountry.toLowerCase() == "australia") {
				labels = this.chartData.map(v => v.LastUpdate)
			} else {
				// otherwise, for all other countries, we need to get the labels from teh chart data that is filtered by the main country
				data = this.chartData.filter(v => v.Country == this.mainCountry)

				if (data.length > 0) {
					labels = data[0].Cases.filter(v => v.type != "Totals").map( v => v.LastUpdate)
				} else {
					labels = []
				}
			}
			
			// some black magic to remove the duplicate dates from the this.ChartData object - https://medium.com/dailyjs/how-to-remove-array-duplicates-in-es6-5daa8789641c
			return [...new Set(labels) ]
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
