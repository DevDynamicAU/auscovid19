<template>
	<div>
		<LineChart 
			:chartData="caseData"
			:mainCountry="Country"
			:countries="chartCountries"
			chartType="Active"
			:chartTitle="'Active Cases (' + Country + ')'"
			:axesScale="defaultAxesType.toLowerCase()"
			:lineWidth=3 />
		<LineChart 
			:chartData="caseData"
			:mainCountry="Country"
			:countries="chartCountries"
			chartType="Confirmed"
			:chartTitle="'Confirmed Cases (' + Country + ')'"
			:axesScale="defaultAxesType.toLowerCase()"
			:lineWidth=3 />
		<LineChart 
			:chartData="caseData"
			:mainCountry="Country"
			:countries="chartCountries"
			chartType="Deaths"
			:chartTitle="'No. of Deaths (' + Country + ')'"
			:axesScale="defaultAxesType.toLowerCase()"
			:lineWidth=3 />
		<LineChart 
			:chartData="caseData"
			:mainCountry="Country"
			:countries="chartCountries"
			chartType="Recovered"
			:chartTitle="'No. Recovered (' + Country + ')'"
			:axesScale="defaultAxesType.toLowerCase()"
			:lineWidth=3 />
	</div>
</template>

<script>
import LineChart from "./charts/LineChart";

import axios from 'axios'

export default {
	components: {
		LineChart,
	},
	data() {
		return {
			Country: "US",
			caseData: [],
			defaultAxesType: "logarithmic"
		};
	},
	mounted: function () {
		this.getData();
	},
	computed: {
		chartCountries: function () {
			return [this.Country, "Australia"]
		},
	},
	methods: {
		getData() {
			let apiURL = ""
			let groupBy = this.Country.toLowerCase() == "australia" ? false : true

			for (const country of this.chartCountries) {
				if (typeof process.env.SERVER_URL == "undefined") {
					apiURL = `${window.location.protocol}//${window.location.hostname}/data/getData?Country=${country}&GroupByCountry=${groupBy}`
				} else {
					apiURL = `${process.env.SERVER_URL}data/getActiveCases?Country=${country}&GroupByCountry=${groupBy}`
				}

				axios.get(apiURL).then((resp) => {
					this.caseData.push({
						Country: country,
						Cases: resp.data
					})
				})
			}
		},
	}
};
</script>
