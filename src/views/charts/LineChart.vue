<template>
	<CCard>
		<CCardBody>
			<CRow>
				<CCol sm="5">
					<h4 id="traffic" class="card-title mb-0">{{ chartTitle }}</h4>
				</CCol>
				<CCol sm="7" class="d-md-block">
					<CButtonGroup class="float-right mr-3">
						<CButton
							color="outline-secondary"
							v-for="(value, key) in ['Linear', 'Logarithmic']"
							:key="key"
							class="mx-0"
							:pressed="value.toLowerCase() === yAxesType.toLowerCase() ? true : false"
							@click="yAxesType = value.toLowerCase()"
						>
							{{ value }}
						</CButton>
					</CButtonGroup>
				</CCol>
			</CRow>
			<CChartLine
				style="height:500px; margin-top:40px;"
				:datasets="defaultDatasets"
				:options="defaultOptions"
				:labels="chartLabels"
			/>
		</CCardBody>
		<CCardFooter>
			<CRow class="text-center w-25">
				<CCol md sm="12" class="mb-sm-2 mb-0">
					<div class="text-muted" v-if="chartType!='Confirmed'">{{ chartType }} / Total Confirmed Cases</div>
					<strong>{{ total.value }} / {{ total.confirmed }}</strong>
					<CProgress
						class="progress-xs mt-2"
						:precision="1"
						color="success"
						:value="total.pct"
					/>
				</CCol>
			</CRow>
		</CCardFooter>
	</CCard>
</template>

<script>
import { CChartLine } from "@coreui/vue-chartjs";
//import { getStyle, hexToRgba } from "@coreui/utils/src";
import { parse, differenceInCalendarDays, addDays, format } from 'date-fns'
import _ from 'lodash'

export default {
	name: "ActiveCases",
	components: {
		CChartLine
	},
	props: {
		chartData: Array,
		lineWidth: Number,
		mainCountry: String,
		countries: Array,
		chartType: String,
		chartTitle: String,
		axesScale: String
	},
	data() {
		return {
			countryCases: [],
			yAxesType: typeof this.axesScale == "undefined" ? "linear" : this.axesScale
		}
	},
	computed: {
		defaultDatasets() {
			let dataSets = []
			let countries = this.chartData.map(v => v.Country)

			for (const country of countries) {
				let countryCases = []
				// Get the cases for the country
				if (this.chartData.filter(v => v.Country == country).length > 0) {
					countryCases = this.chartData.filter(v => v.Country == country)[0].Cases.filter( v => v.type != "Totals" );
				} else {
					console.log(`unable to find the data for ${country}`)
				}

				if (this.mainCountry.toLowerCase() == "australia") {
						const qldColour = "#800000"
						const nswColour = "skyblue"
						const actColour = "#00005B"
						const vicColour = "navy"
						const tasColour = "#006A4E"
						const ntColour = "#E65A00"
						const saColour = "gold"
						const waColour = "black"

						const QLD = this.getCaseValues(countryCases, v => v.ProvinceState == "Queensland");
						const NSW = this.getCaseValues(countryCases, v => v.ProvinceState == "New South Wales");
						const ACT = this.getCaseValues(countryCases, v => v.ProvinceState == "Australian Capital Territory");
						const VIC = this.getCaseValues(countryCases, v => v.ProvinceState == "Victoria");
						const TAS = this.getCaseValues(countryCases, v => v.ProvinceState == "Tasmania");
						const NT  = this.getCaseValues(countryCases, v => v.ProvinceState == "Northern Territory");
						const SA  = this.getCaseValues(countryCases, v => v.ProvinceState == "South Australia");
						const WA  = this.getCaseValues(countryCases, v => v.ProvinceState == "Western Australia");

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
					const countryDetails = this.validCountries.filter(v => v.country == country)
					let countryColour = "black"

					if (countryDetails.length > 0 ) {
						countryColour = countryDetails[0].colour
					}

					if (countryCases.length > 0) {
						// Inserts data for the missing days when additional countries don't have the same data. Returns the country cases
						let completeData = this.addMissingDates( country, countryCases )
						
						// Get the totals for the chart.
						let countryData = this.getCaseValues(completeData);

						dataSets.push({ label: country,
										backgroundColor: 'transparent',
										borderColor: countryColour, pointHoverBackgroundColor: countryColour, borderWidth: this.lineWidth, data: countryData })
					}
				}
			}

			return dataSets;
		},
		total: function () {
			// Make sure we have a value for totalType if one was not passed in
			const countryCases = this.chartData.filter(v => v.Country == this.mainCountry)

			if (countryCases.length > 0 ) {
				let result = this.getCaseValues(countryCases[0].Cases, v => v.type == "Totals")[0];
				let totalConfirmed = this.getCaseValues(countryCases[0].Cases, v => v.type == "Totals", "Confirmed")[0];

				return {
					value: result,
					confirmed: totalConfirmed,
					pct: (result / totalConfirmed) * 100
				}
			} else {
				return {
					value: 0,
					confirmed: 0,
					pct: 0
				}
			}
		},
		validCountries() {
			return [
				{
					country: "US",
					colour: "blue"
				},
				{
					country: "Australia",
					colour: "gold"
				},
				{
					country: "United Kingdom",
					colour: "red"
				}
			]
		},
		chartLabels() {
			// Holds the extracted labels
			let labels = []

			// Temp variable that is used to see if we have some data or not to extract the labels from
			let data = this.chartData.filter(v => v.Country == this.mainCountry)

			if (data.length > 0) {
				labels = data[0].Cases.filter(v => v.type != "Totals").map( v => v.LastUpdate)
			} else {
				labels = []
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
				tooltips: {
					enabled: true,
					mode: "index",
					multiKeyBackground: "#FFF", //"#333", // This should be the same as the background to prevent the whitebox
					defaultFontFamily: 'Consolas',
					titleFontSize: 15,
					bodyFontSize: 15,
					bodyAlign: 'right',
					position: 'nearest',
					itemSort: function(i0, i1) {
						var v0 = Number(i0.value);
						var v1 = Number(i1.value);

						// Sort so that the country with the largest value is on top
						return v0 > v1 ? -1 : 1 
					},
					callbacks: {
						label: (tooltipItem, data) => {
							var datasetLabel = data.datasets[tooltipItem.datasetIndex].label + ':' || '';

							let val = Number(tooltipItem.value).toLocaleString().padStart(10);
							let label = val

							return `${label}`;
						},
						
						labelColor: function(tooltipItem, chart) {
							let countryColour = chart.data.datasets[tooltipItem.datasetIndex].pointHoverBackgroundColor
							
							return { backgroundColor: countryColour };
						},
					// 	// labelTextColor: function(tooltipItem, chart) {
					// 	// 	return '#543453';
					// 	// }
					}
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
							type: this.yAxesType,
							ticks: {
								beginAtZero: true,
								//maxTicksLimit: 5,
								//max: 1000000,
								//stepSize: 100,
								callback: function(tick){
									// format the tick in a local format
									return tick.toLocaleString();
								}
							},
							gridLines: {
								display: true
							},
							afterBuildTicks: function(chart) {
								// code adjusted from https://stackoverflow.com/questions/40183188/chart-js-not-allowing-y-axis-steps-with-logarithmic-scale

								// If the chart is logarithmic, we need to adjust tie ticks accordingly
								if (chart.type == "logarithmic") {
									
									// Maximum number of tick values we want
									var maxTicks = 20;
									var maxLog = Math.log(chart.ticks[0]);
									var minLogDensity = maxLog / maxTicks;

									var ticks = [];
									var currLog = -Infinity;
									
									// Find the appropriate value for the tick
									_.each(chart.ticks.reverse(), function(tick) {
										var log = Math.max(0, Math.log(tick));
										if (log - currLog > minLogDensity) {
											ticks.push(tick);
											currLog = log;
										}
									});
									
									// Assign the new tick values
									chart.ticks = ticks;
								}
							},
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
	},
	methods: {
		getCaseValues(countryCases, caseFilter, valueType) {
			// Make sure we have a value for valueType
			valueType = typeof valueType == "undefined" ? this.chartType : valueType
			//console.log(`starting getCaseValues(${valueType})`)

			switch (valueType.toLowerCase()) {
				case "active":
					if (typeof caseFilter != "undefined") {
						return countryCases.filter( caseFilter ).map( v => v.Active );
					} else {
						return countryCases.map( v => v.Active );
					}
				
				case "confirmed":
					if (typeof caseFilter != "undefined") {
						return countryCases.filter( caseFilter ).map( v => v.Confirmed );
					} else {
						return countryCases.map( v => v.Confirmed );
					}
				
				case "deaths":
					if (typeof caseFilter != "undefined") {
						return countryCases.filter( caseFilter ).map( v => v.Deaths );
					} else {
						return countryCases.map( v => v.Deaths );
					}
				
				case "recovered":
					if (typeof caseFilter != "undefined") {
						return countryCases.filter( caseFilter ).map( v => v.Recovered );
					} else {
						return countryCases.map( v => v.Recovered );
					}
			}
		},
		addMissingDates(country, countryCases) {
			// function will adjust the chart data so that every country starts at the same point as the mainCountry
			//console.log(`starting addMissingDates (${country})`)

			// No use doing this for the maincountry
			if ( country.toLowerCase() != this.mainCountry.toLowerCase() ) {
				// let nbrOfMissingDays = 0
				// let mainCountryFirstDate
				let mainCountryDates = []
				let countryDates = []
				let missingDates = []

				//let dateRecords = caseData.filter(v => v.LastUpdate == itm.LastUpdate)
				if ( this.chartData.filter(v => v.Country == this.mainCountry).length > 0) {
					countryDates = countryCases.map( v => v.LastUpdate )
					mainCountryDates = this.chartData.filter( v => v.Country == this.mainCountry )[0].Cases.filter(v => v.type != "Totals").map(v => v.LastUpdate)
					missingDates = mainCountryDates.filter(v => !countryDates.includes(v) )

					if ( missingDates.length > 0 ) {
						// Loop the missing days, creating a dummy record and inserting it into our data
						for (let aDate of missingDates) {
							let dummyRecord = {
								City: '',
								ProvinceState: '',
								CountryRegion: country,
								LastUpdate: aDate,
								Confirmed: 0,
								Deaths: 0,
								Recovered: 0,
								Active: 0,
								AssumedData: true
							}

							// Insert the dummyRecord into the countries cases
							countryCases.push(dummyRecord)
						}

						return countryCases.sort((a, b) => { 
							// Convert the strings into date objects for comparisons
							const aDate = parse(a.LastUpdate, 'dd-MM-yyyy', new Date())
							const bDate = parse(b.LastUpdate, 'dd-MM-yyyy', new Date())
							
							// return if the date is > the next date
							return aDate > bDate ? 1 : -1 
						})
					}
					
				}

				// If we get to here, then we just need to return what was passed in
				return countryCases
			} else {
				console.log(`skipping ${country} : ${this.mainCountry}`)
				return countryCases
			}
		}
	}
};
</script>
