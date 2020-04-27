<template>
	<div>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">Active Cases ({{ Country }})</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<ActiveChart 
					style="height:500px; margin-top:40px;"
					:chartData="ActiveCases"
					:countries="chartCountries"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter>
				<CRow class="text-center w-25">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Active / Total Confirmed Cases</div>
						<strong>{{ totalActive.value }} / {{ totalConfirmed }}</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="success"
							:value="totalActive.pct"
						/>
					</CCol>
				</CRow>
			</CCardFooter>
		</CCard>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">Confirmed Cases ({{ Country }})</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<ConfirmedChart 
					style="height:300px; margin-top:40px;"
					:chartData="ConfirmedCases"
					:countries="chartCountries"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter>
				<CRow class="text-center w-25">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Total</div>
						<strong>{{ totalConfirmed }}</strong>
						<CProgress
							class="progress-xs mt-2 d-none"
							:precision="1"
							color="success"
							:value="totalConfirmed"
						/>
					</CCol>
				</CRow>
			</CCardFooter>
		</CCard>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">No. of Deaths ({{ Country }})</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<NbrOfDeathsChart 
					style="height:500px; margin-top:40px;"
					:chartData="NbrOfDeaths"
					:countries="chartCountries"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter>
				<CRow class="text-center w-25">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Total</div>
						<strong>{{ totalDeaths }}</strong>
						<CProgress
							class="progress-xs mt-2 d-none"
							:precision="1"
							color="success"
							:value="totalDeaths"
						/>
					</CCol>
				</CRow>
			</CCardFooter>
		</CCard>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">No. Recovered ({{ Country }})</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<NbrRecoveredChart 
					style="height:500px; margin-top:40px;"
					:chartData="NbrRecovered"
					:countries="chartCountries"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter>
				<CRow class="text-center w-25">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Recovered / Total Confirmed Cases</div>
						<strong>{{ totalRecovered.value }} / {{ totalConfirmed }}</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="success"
							:value="totalRecovered.pct"
						/>
					</CCol>
				</CRow>
			</CCardFooter>
		</CCard>
	</div>
</template>

<script>
import ActiveChart from "./charts/ActiveCases";
import ConfirmedChart from "./charts/ConfirmedCases";
import NbrOfDeathsChart from './charts/NbrOfDeaths'
import NbrRecoveredChart from './charts/RecoveredCases'

import fs from 'fs'
import path from 'path'
import axios from 'axios'

export default {
	components: {
		ActiveChart,
		ConfirmedChart,
		NbrOfDeathsChart,
		NbrRecoveredChart
	},
	data() {
		return {
			Country: "US",
			selected: "Month",
			chartLabels: [],
			ActiveCases: [],
			ConfirmedCases: [],
			NbrOfDeaths: [],
			NbrRecovered: []
		};
	},
	mounted: function () {
		//this.getLabels();
		this.getActiveCases();
		this.getConfirmedCases();
		this.getNbrOfDeaths();
		this.getNbrRecovered();
	},
	computed: {
		chartCountries: function () {
			return [this.Country]
		},
		totalActive: function () {
			let result = -1

			if (this.ActiveCases.length > 0) {
				result = this.ActiveCases.filter(v => v.type == "Total")[0].count 
			}

			return {
				value: result,
				pct: (result / this.totalConfirmed) * 100
			}
		},
		totalConfirmed: function () {
			let result = -1

			if (this.ConfirmedCases.length > 0) {
				result = this.ConfirmedCases.filter(v => v.type == "Total")[0].count 
			}

			return result
		},
		totalDeaths: function () {
			let result = -1

			if (this.NbrOfDeaths.length > 0) {
				result = this.NbrOfDeaths.filter(v => v.type == "Total")[0].count 
			}

			return result
		},
		totalRecovered: function () {
			let result = -1

			if (this.NbrRecovered.length > 0) {
				result = this.NbrRecovered.filter(v => v.type == "Total")[0].count 
			}

			return {
				value: result,
				pct: (result / this.totalConfirmed) * 100
			}
		}

	},
	methods: {
		getActiveCases() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getActiveCases?Country=${this.Country}`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getActiveCases?Country=${this.Country}`
			}

			axios.get(apiURL).then((resp) => {
				this.ActiveCases = resp.data
			})
		},
		getConfirmedCases() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getConfirmedCases?Country=${this.Country}`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getActiveCases?Country=${this.Country}`
			}

			axios.get(apiURL).then((resp) => {
				this.ConfirmedCases = resp.data
			})
		},
		getNbrOfDeaths() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getNbrOfDeaths?Country=${this.Country}`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getNbrOfDeaths?Country=${this.Country}`
			}

			axios.get(apiURL).then((resp) => {
				this.NbrOfDeaths = resp.data
			})
		},
		getNbrRecovered() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getData?Country=${this.Country}`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getActiveCases?Country=${this.Country}`
			}

			axios.get(apiURL).then((resp) => {
				this.NbrRecovered = resp.data
			})
		},
	}
};
</script>
